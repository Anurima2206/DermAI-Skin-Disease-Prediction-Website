console.log("Prediction JS loaded");

/* BACKEND BASE URL */
const API_BASE = "https://skin-disease-prediction-website-1-nsua.onrender.com";


/* ELEMENT REFERENCES */

const form = document.getElementById("predictionForm");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const resultText = document.getElementById("resultText");
const fileName = document.getElementById("fileName");
const resultPopup = document.getElementById("resultPopup");
const loadingPopup = document.getElementById("loadingPopup");
const loadingText = document.getElementById("loadingText");

const token = localStorage.getItem("token");

let selectedFile = null;
let lastPredictionId = null;


/* WARNING POPUP */

function showWarning(){
  document.getElementById("warningPopup").style.display = "flex";
}

function closeWarning(){
  document.getElementById("warningPopup").style.display = "none";

  setTimeout(() => {
    imageInput.click();
  },100);
}


/* IMAGE PREVIEW */

imageInput.addEventListener("change", () => {

  const file = imageInput.files[0];
  if(!file) return;

  selectedFile = file;

  fileName.innerText = file.name;

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

});


/* FORM SUBMIT (PREDICTION) */

form.addEventListener("submit", predict);


async function predict(event){

  if(event){
    event.preventDefault();
    event.stopPropagation();
  }

  console.log("Predict button clicked");

  const file = imageInput.files[0];

  if(!file){
    alert("Please upload an image first.");
    return;
  }

  try{

    const formData = new FormData();
    formData.append("image", file);

    console.log("Sending request to backend...");

    loadingPopup.style.display = "flex";
    loadingText.innerText = "Prediction in progress...";

    const timer1 = setTimeout(()=>{
      loadingText.innerText = "Please wait a moment...";
    },1500);

    const timer2 = setTimeout(()=>{
      loadingText.innerText = "Almost there...";
    },3000);

    const res = await fetch(
      `${API_BASE}/api/v1/predict/predictdisease`,
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:formData
      }
    );

    console.log("Response status:", res.status);

    if(!res.ok){
      const text = await res.text();
      console.log("Server error response:", text);
      throw new Error("Server returned error");
    }

    const data = await res.json();

    clearTimeout(timer1);
    clearTimeout(timer2);

    console.log("Backend response:", data);

    lastPredictionId = data.predictionId;

    showResult(data);

  }
  catch(err){

    loadingPopup.style.display = "none";

    console.error("Prediction error:", err);

    alert("Prediction failed. Please try again.");

  }

}


/* RESULT POPUP */

function showResult(data){

  loadingPopup.style.display = "none";

  console.log("showResult called", data);

  const cleanedAdvice = data.ai_explanation.replace(/\*\*/g, "");

  resultText.innerHTML = `
  <strong>Predicted Condition:</strong> ${data.prediction_class}<br><br>
  <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%<br><br>
  <strong>Advice:</strong> ${cleanedAdvice}
  `;

  resultPopup.style.display = "flex";

}


/* DOWNLOAD REPORT */

async function downloadReport(){

  if(!lastPredictionId){
    alert("Prediction not available yet");
    return;
  }

  try{

    const res = await fetch(
      `${API_BASE}/api/v1/predict/pdf/${lastPredictionId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "prediction-report.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();

  }
  catch(err){

    console.error("PDF download error:", err);

    alert("Failed to download report");

  }

}


/* CLEAR IMAGE */

function clearImage(){

  imageInput.value = "";

  preview.src = "";

  preview.style.display = "none";

  selectedFile = null;

  fileName.innerText = "No file chosen";

}


/* CLOSE RESULT POPUP */

function closeResult(){

  resultPopup.style.display = "none";

  clearImage();

}


/* CLOSE POPUP WHEN CLICK OUTSIDE */

resultPopup.addEventListener("click",(event)=>{

  if(event.target === resultPopup){

    resultPopup.style.display = "none";

    clearImage();

  }

});