// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDBb4NTWyvfVKd7fjQ6hDOJhyOfRFshARY",
    authDomain: "pdf-editor-616e9.firebaseapp.com",
    projectId: "pdf-editor-616e9",
    storageBucket: "pdf-editor-616e9.appspot.com",
    messagingSenderId: "59540219446",
    appId: "1:59540219446:web:f205b9af2cd71d158f1a97",
    measurementId: "G-3HN9MTHN1Z"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("upload-pdf").style.display = "block";
        document.getElementById("toolbar").style.display = "flex";
        document.getElementById("user-email").innerText = user.email;
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("user-info").style.display = "none";
        document.getElementById("upload-pdf").style.display = "none";
        document.getElementById("toolbar").style.display = "none";
    }
});

// Login Function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("Logged in successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

// Sign Up Function
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Signed up successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

// Logout Function
function logout() {
    auth.signOut()
        .then(() => alert("Logged out successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

// PDF Editor Functionality
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

// Render PDF
async function renderPDF() {
    if (!pdfDoc) return;
    let page = await pdfDoc.getPage(currentPage);
    let viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    let renderContext = { canvasContext: ctx, viewport: viewport };
    await page.render(renderContext).promise;
    document.getElementById("page-num").innerText = `Page ${currentPage} of ${pdfDoc.numPages}`;
}

// Page Navigation
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPDF();
    }
}

function nextPage() {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPDF();
    }
}

// Add Elements to PDF
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

function downloadPDF() {
    alert("Feature Coming Soon!");
}