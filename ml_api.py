from fastapi import FastAPI, File, UploadFile, Form, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
import google.generativeai as genai
from tensorflow.keras.applications.efficientnet import preprocess_input
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# ----------------------------
# Gemini API Setup
# ----------------------------
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model_gen = genai.GenerativeModel("gemini-2.5-flash")

# ----------------------------
# Global ML variables
# ----------------------------
interpreter = None
input_details = None
output_details = None

classes = [
    "Eczema",
    "Warts",
    "Melanoma",
    "Atopic Dermatitis",
    "Basal Cell Carcinoma",
    "Melanocytic Nevi",
    "Benign Keratosis",
    "Psoriasis / Lichen Planus",
    "Seborrheic Keratosis",
    "Tinea / Fungal Infection"
]


# ----------------------------
# Load model on startup
# ----------------------------
@app.on_event("startup")
def load_model():
    global interpreter, input_details, output_details

    print("🚀 Loading TFLite model...")

    interpreter = tf.lite.Interpreter(
        model_path="model_flex.tflite",
        experimental_delegates=[]
    )

    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    print("✅ Model loaded successfully!")
# ----------------------------
# Image preprocessing
# ----------------------------
def preprocess_image(contents):
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((380, 380))

    img = np.array(img)
    img = preprocess_input(img)

    img = np.expand_dims(img, axis=0)

    return img


def generate_ai_response(predicted_class, symptoms, age, allergies, skinType):

    prompt = f"""
    A patient has the following details:

    Disease: {predicted_class}
    Symptoms: {symptoms}
    Age: {age}
    Allergies: {allergies}
    Skin Type: {skinType}

    Explain the disease in simple terms within 10 words.
    Then suggest treatment (maximum 3 points).
    Also say if doctor consultation is urgent or not.
    """

    response = model_gen.generate_content(prompt)

    return response.text


# ----------------------------
# Prediction API
# ----------------------------
@app.post("/predict-image/")
async def predict_image(
    image: UploadFile = File(...),
    symptoms: str = Form(None),
    age: int = Form(None),
    allergies: str = Form(None),
    gender: str = Form(None),
    skinType: str = Form(None)
):

    try:

        print("📩 Request received")

        # Safe defaults
        symptoms = symptoms or "None"
        age = age if age is not None else "Not provided"
        allergies = allergies or "None"
        gender = gender or "None"
        skinType = skinType or "Unknown"

        # Read uploaded image
        contents = await image.read()

        img = preprocess_image(contents)

        print("🧠 Running inference...")

        # Set model input
        interpreter.set_tensor(
            input_details[0]['index'],
            img.astype(np.float32)
        )

        # Run model
        interpreter.invoke()

        preds = interpreter.get_tensor(
            output_details[0]['index']
        )

        predicted_class = classes[np.argmax(preds)]
        confidence = float(np.max(preds))

        print("✅ Prediction done")

        # Generate explanation using Gemini
        ai_answer = generate_ai_response(
            predicted_class,
            symptoms,
            age,
            allergies,
            skinType
        )

        return {
            "prediction_class": predicted_class,
            "confidence": confidence,
            "ai_explanation": ai_answer
        }

    except Exception as e:

        print("❌ Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )