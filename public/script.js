// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBb4NTWy...",
    authDomain: "pdf-editor-616e9.firebaseapp.com",
    projectId: "pdf-editor-616e9",
    storageBucket: "pdf-editor-616e9.firebasestorage.app",
    messagingSenderId: "59540219446",
    appId: "1:59540219446:web:f205b9af2cd71d158f1a97",
    measurementId: "G-3HN9MTHN1Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication Handling
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

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Signed up successfully!"))
        .catch((error) => alert(error.message));
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert("Logged in successfully!"))
        .catch((error) => alert(error.message));
}

function logout() {
    auth.signOut().then(() => alert("Logged out successfully!"));
}

// PDF Handling
let fabricCanvas = new fabric.Canvas("pdf-canvas");

// Add Text
function addText() {
    let text = new fabric.Textbox("Editable Text", {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: "black",
        fontFamily: "Arial",
    });
    fabricCanvas.add(text);
}

// Add Shapes
function addRectangle() {
    let rect = new fabric.Rect({
        left: 100, top: 100, width: 100, height: 50, fill: "blue"
    });
    fabricCanvas.add(rect);
}

function addCircle() {
    let circle = new fabric.Circle({
        left: 150, top: 150, radius: 50, fill: "red"
    });
    fabricCanvas.add(circle);
}

// Undo & Redo
function undo() {
    fabricCanvas.undo();
}

function redo() {
    fabricCanvas.redo();
}

// Zoom
function zoomIn() {
    fabricCanvas.setZoom(fabricCanvas.getZoom() * 1.1);
}

function zoomOut() {
    fabricCanvas.setZoom(fabricCanvas.getZoom() * 0.9);
}

// Download PDF
function downloadPDF() {
    const dataURL = fabricCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "edited-pdf.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Print PDF
function printPDF() {
    const dataURL = fabricCanvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    printWindow.document.write('<img src="' + dataURL + '" width="100%">');
    printWindow.print();
}

// Page Navigation (Future Improvement)
function prevPage() { alert("Previous Page - Feature Coming Soon!"); }
function nextPage() { alert("Next Page - Feature Coming Soon!"); }
