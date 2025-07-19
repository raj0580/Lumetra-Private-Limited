/* ==========================================================================
   Central Firebase Configuration for the Lumetra Admin Panel
   ========================================================================== */

// --- 1. CONFIGURATION ---
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzzNaBj_TjvQMkqLW7_DC0L7M6uULgjs8",
  authDomain: "lumetra-protfolio.firebaseapp.com",
  databaseURL: "https://lumetra-protfolio-default-rtdb.firebaseio.com",
  projectId: "lumetra-protfolio",
  storageBucket: "lumetra-protfolio.firebasestorage.app",
  messagingSenderId: "633062556570",
  appId: "1:633062556570:web:d9cdc60726444ba7fd3023"
};


// --- 2. INITIALIZATION ---
// Initialize Firebase and export the services for other scripts to use.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// We no longer use storage directly in the new ImgBB version, but it's good practice to keep it here if needed later.
// const storage = firebase.storage(); 


// --- 3. SECURITY GUARD ---
// This function checks if a user is logged in. If not, it kicks them out.
// We exclude the login page itself from this check.
if (!window.location.pathname.endsWith('admin.html')) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            console.log("No user logged in. Redirecting to login page.");
            window.location.href = 'admin.html';
        }
    });
}
