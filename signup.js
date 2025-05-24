import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // User signed up successfully
    const user = userCredential.user;
    console.log('User signed up:', user.uid);
    // Redirect to dashboard or index
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});
