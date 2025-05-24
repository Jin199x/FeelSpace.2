import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const journalList = document.getElementById('journalList');
const logoutBtn = document.getElementById('logoutBtn');
const newEntryBtn = document.getElementById('newEntryBtn');

const journalModal = document.getElementById('journalModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const q = query(
      collection(db, 'users', user.uid, 'journals'),
      where('deleted', '!=', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      journalList.innerHTML = '<li>No journals yet. Start writing your feelings.</li>';
    } else {
      journalList.innerHTML = '';

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Unknown date';

        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.textContent = `${date} — ${data.text.substring(0, 100)}${data.text.length > 100 ? '...' : ''}`;

        // Open modal with full text on snippet click
        li.addEventListener('click', () => {
          modalContent.textContent = data.text;
          journalModal.style.display = 'flex';
        });

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginLeft = '10px';
        editBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent triggering modal open
          const newText = prompt('Edit your journal:', data.text);
          if (newText !== null && newText.trim() !== '') {
            await updateJournal(docSnap.id, newText.trim());
            li.firstChild.textContent = `${date} — ${newText.substring(0, 100)}${newText.length > 100 ? '...' : ''}`;
            data.text = newText.trim(); // update local data for modal
          }
        });
        li.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent triggering modal open
          if (confirm('Are you sure you want to delete this entry?')) {
            await softDeleteJournal(docSnap.id);
            li.remove();
          }
        });
        li.appendChild(deleteBtn);

        journalList.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Error loading journals:', err);
    journalList.innerHTML = '<li>Error loading journals.</li>';
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
});

newEntryBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Modal close button
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
