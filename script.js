const quill = new Quill('#editor', {
  theme: 'snow',
});

const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

let currentDoc = 'default';

const demoDocs = {
  doc1: [{ insert: "📘 Study Notes\n\n- Chapter 1\n- Chapter 2\n" }],
  doc2: [{ insert: "📁 Project Report\n\nFrontend: HTML, CSS, JS\nBackend: 👹 Demon Collab\n" }],
  doc3: [{ insert: "🧠 Creative Ideas\n\n- Build a mood tracker\n- Launch a UI kit\n" }]
};

// Load when page opens
window.addEventListener('load', () => {
  const saved = localStorage.getItem(`doc-${currentDoc}`);
  if (saved) {
    quill.setContents(JSON.parse(saved));
  } else {
    quill.setText("✨ Select a demo document or start typing!");
  }
});

// Save manually
saveBtn.addEventListener('click', () => {
  const content = quill.getContents();
  localStorage.setItem(`doc-${currentDoc}`, JSON.stringify(content));
  status.textContent = "✅ Document saved!";
  setTimeout(() => status.textContent = "", 2000);
});

// Load demo docs
function loadDemo(docKey) {
  currentDoc = docKey;
  const saved = localStorage.getItem(`doc-${docKey}`);
  if (saved) {
    quill.setContents(JSON.parse(saved));
  } else {
    quill.setContents(demoDocs[docKey]);
  }
}

// Fake "open collaboration"
function openCollabTab() {
  window.open(window.location.href, '_blank');
}

// Fake real-time sync
quill.on('text-change', () => {
  const content = quill.getContents();
  localStorage.setItem(`doc-${currentDoc}`, JSON.stringify(content));
  localStorage.setItem('doc-update', Date.now());
});

// Listen to other tab's changes
window.addEventListener('storage', (e) => {
  if (e.key === 'doc-update') {
    const updated = localStorage.getItem(`doc-${currentDoc}`);
    if (updated) {
      const incoming = JSON.parse(updated);
      const current = quill.getContents();
      if (JSON.stringify(incoming) !== JSON.stringify(current)) {
        quill.setContents(incoming);
      }
    }
  }
});
