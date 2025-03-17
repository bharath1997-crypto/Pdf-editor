// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBb4NTWyvfVKd7fjQ6hDOJhyOfRFshARY",
    authDomain: "pdf-editor-616e9.firebaseapp.com",
    projectId: "pdf-editor-616e9",
    storageBucket: "pdf-editor-616e9.firebasestorage.app",
    messagingSenderId: "59540219446",
    appId: "1:59540219446:web:f205b9af2cd71d158f1a97",
    measurementId: "G-3HN9MTHN1Z"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("upload-pdf").style.display = "block";
        document.getElementById("toolbar").style.display = "flex";
        document.getElementById("user-email").innerText = user.email;
    } else {
        // User is signed out
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
        .then(() => {
            alert("Logged in successfully!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Sign Up Function
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("Signed up successfully!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Logout Function
function logout() {
    auth.signOut()
        .then(() => {
            alert("Logged out successfully!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Add your existing PDF editor code here
