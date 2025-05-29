<script type="module">
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

  const db = window.AIF_DB; // Set by your firebaseConfig script in index.html
  const suggestionsRef = collection(db, "suggestions");

  function getTopSuggestion(suggestions) {
    return suggestions.reduce((top, curr) =>
      curr.likes > top.likes ? curr : top,
      suggestions[0]
    );
  }

  async function renderSuggestions() {
    const list = document.getElementById("suggestion-list");
    list.innerHTML = "";

    const q = query(suggestionsRef, orderBy("likes", "desc"));
    const snapshot = await getDocs(q);

    const suggestionArray = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      suggestionArray.push({ id: docSnap.id, ...data });

      const li = document.createElement("li");
      li.innerHTML = `
        ${data.text} — ${data.likes} likes
        <button onclick="likeSuggestion('${docSnap.id}')">Like</button>
      `;
      list.appendChild(li);
    });

    // Store top suggestion globally if needed later
    window.currentTopSuggestion = getTopSuggestion(suggestionArray);
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

  window.submitSuggestion = submitSuggestion;
  window.likeSuggestion = likeSuggestion;

  document.addEventListener("DOMContentLoaded", renderSuggestions);
</script>
