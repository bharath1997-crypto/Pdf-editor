// Initialize Firebase (Using Firebase CDN)
const firebaseConfig = {
    apiKey: "AIzaSyDBb4NTWyvfVKd7fjQ6hDOJhyOfRFshARY",
    authDomain: "pdf-editor-616e9.firebaseapp.com",
    projectId: "pdf-editor-616e9",
    storageBucket: "pdf-editor-616e9.appspot.com",  // Fixed Storage URL
    messagingSenderId: "59540219446",
    appId: "1:59540219446:web:f205b9af2cd71d158f1a97",
    measurementId: "G-3HN9MTHN1Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

console.log("Firebase successfully initialized!");

// PDF Handling Variables
let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;
let canvas = document.getElementById("pdf-canvas");
let ctx = canvas.getContext("2d");
let fabricCanvas = new fabric.Canvas("pdf-canvas");

// Load PDF
document.getElementById("upload-pdf").addEventListener("change", async (event) => {
    let file = event.target.files[0];
    if (file) {
        let fileReader = new FileReader();
        fileReader.onload = async function() {
            let typedArray = new Uint8Array(this.result);
            pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
            currentPage = 1;
            renderPDF();
        };
        fileReader.readAsArrayBuffer(file);
    }
});

// Render PDF Page
async function renderPDF() {
    if (!pdfDoc) return;
    let page = await pdfDoc.getPage(currentPage);
    let viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    let renderContext = { canvasContext: ctx, viewport: viewport };
    await page.render(renderContext).promise;
}

// Add Text
function addText() {
    let text = new fabric.Textbox("Editable Text", {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: "#007BFF",
        fontFamily: "Arial",
    });
    fabricCanvas.add(text);
}

// Add Rectangle
function addRectangle() {
    let rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 50,
        fill: "transparent",
        stroke: "#007BFF",
        strokeWidth: 2,
    });
    fabricCanvas.add(rect);
}

// Add Highlight
function addHighlight() {
    let rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 50,
        fill: "#ffc107",
        opacity: 0.5,
    });
    fabricCanvas.add(rect);
}

// Download PDF
async function downloadPDF() {
    if (!pdfDoc) {
        alert("Please upload a PDF first.");
        return;
    }

    // Convert canvas to image
    let image = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
    });

    // Create a new PDF with PDF-Lib
    const newPdfDoc = await PDFLib.PDFDocument.create();
    const page = newPdfDoc.addPage();

    // Embed the image into the PDF
    const pngImage = await newPdfDoc.embedPng(image);
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
    });

    // Save the PDF
    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited-pdf.pdf";
    link.click();
}
