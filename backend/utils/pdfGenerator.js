const PDFDocument = require("pdfkit")
const path = require("path")

const generatePDF = (prediction,medicalHistory, res) => {

  const doc = new PDFDocument({ margin: 50 })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=prediction-report.pdf"
  )

  doc.pipe(res)

  // RED HEADER BACKGROUND
  doc
    .rect(19, 20, doc.page.width-38, 80)
    .fill("#178d91")

    try{
    doc.image(path.join(__dirname,"../../frontend/assets/heart.png"), 35, 35, { width: 35 })
    }catch(err){}

  /* CONTACT INFO (LEFT SIDE) */
doc
.fillColor("white")
.font("Helvetica-Bold")
.fontSize(24)
.text("DermAI", 75, 40)

doc
.font("Helvetica")
.fontSize(10)
.text("Website: www.dermai.com", doc.page.width - 200, 35)
.text("Email: support@dermai.com", doc.page.width - 200, 50)
.text("Helpline: +91-9000000000", doc.page.width - 200, 65)

  // Reset color
  doc.fillColor("black")
  doc.x=50
  doc.y = 120

  // REPORT TITLE
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("Prediction Report", { align: "center" })

  doc.moveDown()

    //date
    const today = new Date().toLocaleDateString()

doc
.fontSize(10)
.fillColor("black")
.text(`Generated on: ${today}`,{
align:"left"
})
doc.moveDown()

doc.fillColor("black")

  //Medical dwtails
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Medical Profile")

  doc.moveDown()

  doc.font("Helvetica")

  doc.text(`Age: ${medicalHistory.age || "N/A"}`)
  doc.text(`Gender: ${medicalHistory.gender || "N/A"}`)
  doc.text(`Skin Type: ${medicalHistory.skinType || "N/A"}`)

  doc.text(
    `Allergies: ${
      medicalHistory.allergies?.length
        ? medicalHistory.allergies.join(", ")
        : "None"
    }`
  )
  doc.text(
    `Symptoms: ${
      medicalHistory.symptoms?.length
        ? medicalHistory.symptoms.join(", ")
        : "None"
    }`
  )
  
  doc.moveDown(2)
  // PREDICTION DETAILS
  doc.fontSize(14).font("Helvetica-Bold").text("Prediction Details")

  doc.moveDown()

  doc.font("Helvetica")

  doc.text(`Disease: ${prediction.disease}`)
  doc.text(`Confidence: ${(prediction.confidence*100).toFixed(2)}%`)
  doc.text(`Advice: ${prediction.advice}`,{
    width: doc.page.width - 100
  })

  doc.moveDown(3)

  // DISCLAIMER
  doc
    .fillColor("red")
    .fontSize(12)
    .text(
      "Disclaimer: This AI prediction is not a medical diagnosis. Please consult a qualified dermatologist.",
      { align: "center" }
    )

  doc.fillColor("black")

  // ⬛ PAGE BORDER
  doc
    .lineWidth(2)
    .rect(
      20,
      20,
      doc.page.width - 40,
      doc.page.height - 40
    )
    .stroke()

  doc.end()
}

module.exports = generatePDF