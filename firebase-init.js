// firebase-init.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN4_IG7XfpAoKXXnW_oZEZrIpHhjwEvMM",
  authDomain: "prakarshportfolio.firebaseapp.com",
  projectId: "prakarshportfolio",
  storageBucket: "prakarshportfolio.firebasestorage.app",
  messagingSenderId: "774195642418",
  appId: "1:774195642418:web:cb6a269b695c966df3fc2b",
  measurementId: "G-C21YBG6MBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize analytics if needed

const db = getFirestore(app);

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    formStatus.textContent = "Sending message...";
    formStatus.style.color = "#888";

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    try {
      await addDoc(collection(db, "messages"), {
        name: name,
        email: email,
        message: message,
        timestamp: new Date()
      });
      formStatus.textContent = "Message sent successfully! Thank you.";
      formStatus.style.color = "green";
      contactForm.reset();
    } catch (error) {
      console.error("Error adding document: ", error);
      formStatus.textContent = "Error sending message. Please try again. " + error.message;
      formStatus.style.color = "red";
    }
  });
} else {
  console.log("Contact form or form status element not found (not on main landing page).");
}