// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDBb4NTWyvfVKd7fjQ6hDOJhyOfRFshARY",
    authDomain: "pdf-editor-616e9.firebaseapp.com",
    projectId: "pdf-editor-616e9",
    storageBucket: "pdf-editor-616e9.firebasestorage.app",
    messagingSenderId: "59540219446",
    appId: "1:59540219446:web:f205b9af2cd71d158f1a97",
    measurementId: "G-3HN9MTHN1Z"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Authentication
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("user-email").innerText = user.email;
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("user-info").style.display = "none";
    }
});

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("Logged in successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Signed up successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

function logout() {
    auth.signOut()
        .then(() => alert("Logged out successfully!"))
        .catch((error) => alert("Error: " + error.message));
}

// PDF Editor Functions
let pdfDoc = null, currentPage = 1, scale = 1.5;
const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");
const fabricCanvas = new fabric.Canvas("pdf-canvas");

// Load PDF
document.getElementById("upload-pdf").addEventListener("change", async (event) => {
    let file = event.target.files[0];
    if (file) {
        let fileReader = new FileReader();
        fileReader.onload = async function () {
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
    let page = await pdfDoc.getPage(currentPage);
    let viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    let renderContext = { canvasContext: ctx, viewport };
    await page.render(renderContext).promise;
}

// Page Navigation
function nextPage() {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        document.getElementById("page-info").innerText = `Page ${currentPage}`;
        renderPDF();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById("page-info").innerText = `Page ${currentPage}`;
        renderPDF();
    }
}

// Editing Functions
function addText() {
    let text = new fabric.Textbox("Editable Text", { left: 50, top: 50, fontSize: 20, fill: "blue" });
    fabricCanvas.add(text);
}

function addRectangle() {
    let rect = new fabric.Rect({ left: 100, top: 100, width: 100, height: 50, fill: "red" });
    fabricCanvas.add(rect);
}

function addCircle() {
    let circle = new fabric.Circle({ left: 150, top: 150, radius: 50, fill: "green" });
    fabricCanvas.add(circle);
}

function undo() {
    let objects = fabricCanvas.getObjects();
    if (objects.length) fabricCanvas.remove(objects[objects.length - 1]);
}

function downloadPDF() {
    alert("PDF Download Feature Coming Soon!");
}
