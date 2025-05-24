import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // User logged in successfully
    const user = userCredential.user;
    console.log('User logged in:', user.uid);
    // Redirect to dashboard or index
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});
