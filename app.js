import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoXoNXWZABE3RLKZ4A5Q5MD4eI_ikaXq4",
  authDomain: "ai-isn-t-funny.firebaseapp.com",
  projectId: "ai-isn-t-funny",
  storageBucket: "ai-isn-t-funny.appspot.com",
  messagingSenderId: "87563153287",
  appId: "1:87563153287:web:1ed3f843a2f5929c43ed22",
  measurementId: "G-ZVZPZBVRKY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const suggestionsRef = collection(db, "suggestions");

async function renderSuggestions() {
  const list = document.getElementById("suggestion-list");
  list.innerHTML = "";

  const q = query(suggestionsRef, orderBy("likes", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      ${data.text} — ${data.likes} likes
      <button onclick="likeSuggestion('${docSnap.id}')">Like</button>
    `;
    list.appendChild(li);
  });
}

async function submitSuggestion() {
  const input = document.getElementById("suggestion-input");
  const text = input.value.trim();
  if (text.length > 0) {
    await addDoc(suggestionsRef, { text, likes: 0 });
    input.value = "";
    renderSuggestions();
  }
}

async function likeSuggestion(id) {
  const suggestionDoc = doc(suggestionsRef, id);
  await updateDoc(suggestionDoc, { likes: increment(1) });
  renderSuggestions();
}
async function updateComicImage() {
  try {
    const response = await fetch("https://your-replit-name.repl.co/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: window.currentTopSuggestion?.text || "a goblin with a laptop"
      })
    });

    const data = await response.json();
    const imageUrl = data.imageUrl;

    const comicImg = document.getElementById("comic-img");
    comicImg.src = imageUrl;

    const promptText = window.currentTopSuggestion?.text || "unknown";
    document.getElementById("comic-prompt").textContent = `Prompt: ${promptText}`;
  } catch (error) {
    console.error("❌ Failed to update comic image:", error);
  }
}
window.submitSuggestion = submitSuggestion;
window.likeSuggestion = likeSuggestion;

document.addEventListener("DOMContentLoaded", renderSuggestions);
