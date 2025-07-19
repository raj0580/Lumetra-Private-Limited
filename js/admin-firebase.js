/* ==========================================================================
   Central Firebase & API Key Configuration for the Lumetra Admin Panel
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

const imgbbApiKey = '5090ec8c335078581b53f917f9657083';


// --- 2. INITIALIZATION ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// --- 3. SECURITY GUARD ---
if (!window.location.pathname.endsWith('admin.html')) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'admin.html';
        }
    });
}
