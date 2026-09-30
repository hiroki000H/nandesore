const wordElement = document.getElementById("word");
const categoryElement = document.getElementById("category");
const nextButton = document.getElementById("nextButton");

let currentIndex = 0;

function showRandomWord() {
  if (!window.WORDS || window.WORDS.length === 0) return;

  let nextIndex = currentIndex;

  while (window.WORDS.length > 1 && nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * window.WORDS.length);
  }

  currentIndex = nextIndex;
  const item = window.WORDS[currentIndex];

  wordElement.textContent = item.word;
  categoryElement.textContent = item.category;
}

nextButton.addEventListener("click", showRandomWord);

showRandomWord();
