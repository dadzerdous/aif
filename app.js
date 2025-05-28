// Load suggestions from localStorage or use default
let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [
  { text: "A toaster uprising", likes: 2 },
  { text: "Elon Musk vs. AI duck", likes: 5 }
];

function saveSuggestions() {
  localStorage.setItem('suggestions', JSON.stringify(suggestions));
}
function getTopSuggestion() {
  return suggestions.reduce((top, curr) => curr.likes > top.likes ? curr : top, suggestions[0]);
}
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
    saveSuggestions();
    renderSuggestions();
  }
}

function likeSuggestion(index) {
  suggestions[index].likes++;
  saveSuggestions();
  renderSuggestions();
}

document.addEventListener('DOMContentLoaded', renderSuggestions);
