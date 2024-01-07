import bodyParser from "body-parser";
import express from "express";
import { PdfReader } from "pdfreader";
const PDFParser = new PdfReader();
const port = 3003;
const app = express();
//
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.raw({ type: "application/pdf", limit: "10mb" }));
//
app.post("/upload-pdf", async (req, res) => {
  const pdfData = req.body;
  const textArr = [];
  //  Using Promise to return Actual Result
  const parsePromise = new Promise((resolve, reject) => {
    PDFParser.parseBuffer(pdfData, (err, item) => {
      if (err) {
        console.error("Error parsing PDF:", err);
        reject(err);
      } else if (!item) {
        console.warn("End of file");
        const resultText = textArr.join("             ");
        resolve(resultText);
      } else if (item.text) {
        textArr.push(item.text);
      }
    });
  });
  // Switch Case Statement
  try {
    const resultText = await parsePromise;
    return res.status(200).json({ status: true, data: resultText });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return res.status(500).json({ status: false, error: "Error parsing PDF" });
  }
});
//
//
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
