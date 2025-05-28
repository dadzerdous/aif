const suggestions = [
  { text: "A toaster uprising", likes: 2 },
  { text: "Elon Musk vs. AI duck", likes: 5 }
];

function renderSuggestions() {
  const list = document.getElementById('suggestion-list');
  list.innerHTML = '';
  suggestions.forEach((sugg, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${sugg.text} — ${sugg.likes} likes
      <button onclick="likeSuggestion(${index})">Like</button>
    `;
    list.appendChild(li);
  });
}

function submitSuggestion() {
  const input = document.getElementById('suggestion-input');
  const text = input.value.trim();
  if (text.length > 0) {
    suggestions.push({ text, likes: 0 });
    input.value = '';
    renderSuggestions();
  }
}

function likeSuggestion(index) {
  suggestions[index].likes++;
  renderSuggestions();
}

document.addEventListener('DOMContentLoaded', renderSuggestions);
