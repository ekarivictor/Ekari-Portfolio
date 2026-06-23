import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDF9kLE9BxBagQvMB11jXSitYhwS0siw84",
  authDomain: "ekari-portfolio.firebaseapp.com",
  projectId: "ekari-portfolio",
  storageBucket: "ekari-portfolio.firebasestorage.app",
  messagingSenderId: "357234658242",
  appId: "1:357234658242:web:d3a2c2e85f8690a716e45b",
  measurementId: "G-HH925SDYL6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to our stats document
const statsDocRef = doc(db, "portfolio", "stats");

// Listen for real-time updates
onSnapshot(statsDocRef, (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // 1. Update Messages Sent
        const msgCountEls = document.querySelectorAll('#msg-count');
        msgCountEls.forEach(el => {
            el.textContent = data.messages_sent !== undefined ? data.messages_sent : 0;
        });

        // 2. Update Availability Badge
        const availBadgeEls = document.querySelectorAll('#availability-badge');
        availBadgeEls.forEach(el => {
            if (data.is_available) {
                el.textContent = 'Available';
                el.style.backgroundColor = 'rgba(212, 255, 63, 0.15)'; 
                el.style.color = 'var(--accent-color)';
                el.style.borderColor = 'rgba(212, 255, 63, 0.3)';
            } else {
                el.textContent = 'Busy';
                el.style.backgroundColor = 'rgba(255, 63, 63, 0.15)'; 
                el.style.color = '#ff3f3f';
                el.style.borderColor = 'rgba(255, 63, 63, 0.3)';
            }
        });
    } else {
        console.warn("Firestore 'stats' document does not exist yet. Please initialize it via admin.html.");
    }
});

// Attach increment function to window so it can be called from standard HTML form submissions
window.incrementMessages = async () => {
    try {
        await updateDoc(statsDocRef, {
            messages_sent: increment(1)
        });
    } catch (e) {
        console.error("Error updating message count:", e);
    }
};

// --- FIREBASE STORAGE FOR FILE UPLOADS ---
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const storage = getStorage(app);

window.uploadFileToFirebase = async (file) => {
    // Create a unique filename to prevent overwriting
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substring(7) + '-' + file.name;
    const storageRef = ref(storage, 'attachments/' + uniqueName);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};
