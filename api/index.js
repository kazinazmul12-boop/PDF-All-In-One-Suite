const express = require('express');
const multer = require('multer');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

const app = express();

// Use memory storage to stay strictly serverless (no disk writes allowed on Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoint: Merge multiple PDFs
app.post('/api/merge', upload.array('pdfs'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).send('Please upload at least 2 PDF files to merge.');
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged-document.pdf');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    res.status(500).send('Error merging PDFs: ' + error.message);
  }
});

// API Endpoint: Extract plain text from PDF
app.post('/api/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Please upload a PDF file to extract text from.');
    }

    const data = await pdfParse(req.file.buffer);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(data.text);
  } catch (error) {
    res.status(500).send('Error parsing PDF: ' + error.message);
  }
});

// Fallback to index.html for root path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
