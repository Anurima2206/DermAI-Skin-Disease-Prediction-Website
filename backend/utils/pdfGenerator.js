const PDFDocument = require("pdfkit")

const generatePDF = (prediction, res) => {

  const doc = new PDFDocument({ margin: 50 })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=prediction-report.pdf"
  )

  doc.pipe(res)

  // RED HEADER BACKGROUND
  doc
    .rect(19, 20, doc.page.width-38, 70)
    .fill("#d32f2f")

  // WEBSITE NAME
  doc
    .fillColor("white")
    .fontSize(28)
    .text("Skin Disease Detection System", 50, 40, {
      align: "center"
    })

  // Reset color
  doc.fillColor("black")

  doc.moveDown(2)

  // REPORT TITLE
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("Prediction Report", { align: "center" })

  doc.moveDown(2)

  // PREDICTION DETAILS
  doc.fontSize(14).font("Helvetica-Bold").text("Prediction Details")

  doc.moveDown()

  doc.font("Helvetica")

  doc.text(`Disease: ${prediction.disease}`)
  doc.text(`Confidence: ${prediction.confidence}`)
  doc.text(`Advice: ${prediction.advice}`)

  doc.moveDown(10)

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