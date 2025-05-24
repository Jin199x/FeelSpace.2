import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const journalList = document.getElementById('journalList');
const logoutBtn = document.getElementById('logoutBtn');
const newEntryBtn = document.getElementById('newEntryBtn');

const journalModal = document.getElementById('journalModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const q = query(
    collection(db, 'users', user.uid, 'journals'),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, (querySnapshot) => {
    const journals = querySnapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .filter(journal => !journal.deleted);

    if (journals.length === 0) {
      journalList.innerHTML = '<li>No journals yet. Start writing your feelings.</li>';
    } else {
      journalList.innerHTML = '';

      journals.forEach(journal => {
        const date = journal.createdAt?.toDate ? journal.createdAt.toDate().toLocaleString() : 'Unknown date';

        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.textContent = `${date} — ${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}`;

        // Open modal with full text on snippet click
        li.addEventListener('click', () => {
          modalContent.textContent = journal.text;
          journalModal.style.display = 'flex';
        });

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginLeft = '10px';
        editBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent modal open
          const newText = prompt('Edit your journal:', journal.text);
          if (newText !== null && newText.trim() !== '') {
            await updateJournal(journal.id, newText.trim());
          }
        });
        li.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent modal open
          if (confirm('Are you sure you want to delete this entry?')) {
            await softDeleteJournal(journal.id);
          }
        });
        li.appendChild(deleteBtn);

        journalList.appendChild(li);
      });
    }
  });
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
});

newEntryBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

closeModalBtn.addEventListener('click', () => {
  journalModal.style.display = 'none';
});

// Helper functions for soft delete and edit
async function softDeleteJournal(journalId) {
  const journalRef = doc(db, 'users', auth.currentUser.uid, 'journals', journalId);
  await updateDoc(journalRef, { deleted: true });
}

async function updateJournal(journalId, newText) {
  const journalRef = doc(db, 'users', auth.currentUser.uid, 'journals', journalId);
  await updateDoc(journalRef, { text: newText });
}
