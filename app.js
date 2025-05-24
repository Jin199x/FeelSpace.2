import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js';

const rantForm = document.getElementById('rantForm');
const rantText = document.getElementById('rantText');
const wordCount = document.getElementById('wordCount');
const confirmation = document.getElementById('confirmation');

const loginLink = document.getElementById('loginLink');
const signupLink = document.getElementById('signupLink');
const dashboardBtn = document.getElementById('dashboardBtn');

const MAX_WORDS = 2000;

let currentUser = null;

// Word count update
rantText.addEventListener('input', () => {
  const words = rantText.value.trim().split(/\s+/).filter(Boolean);
  wordCount.textContent = `${words.length} / ${MAX_WORDS} words`;
  wordCount.style.color = words.length > MAX_WORDS ? 'red' : '#880e4f';
});

// Listen for auth state and show/hide nav links
onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) signupLink.style.display = 'none';
    if (dashboardBtn) dashboardBtn.style.display = 'inline';
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (signupLink) signupLink.style.display = 'inline';
    if (dashboardBtn) dashboardBtn.style.display = 'none';
  }
});

// Handle form submission
rantForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert('You need to be logged in to save your journal.');
    return;
  }

  const words = rantText.value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    alert('Please write something before submitting.');
    return;
  }

  if (words.length > MAX_WORDS) {
    alert(`Please limit your thoughts to ${MAX_WORDS} words.`);
    return;
  }

  confirmation.style.display = 'none';

  try {
    // Save journal in subcollection users/{uid}/journals
    await addDoc(collection(db, 'users', currentUser.uid, 'journals'), {
      text: rantText.value.trim(),
      createdAt: serverTimestamp()
       deleted: false
    });

    confirmation.style.display = 'block';
    rantForm.reset();
    wordCount.textContent = `0 / ${MAX_WORDS} words`;
  } catch (error) {
    alert('Error sending your feelings. Please try again.');
    console.error(error);
  }
});
