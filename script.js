const wordElement = document.getElementById("word");
const categoryElement = document.getElementById("category");
const meaningPanel = document.getElementById("meaningPanel");
const meaningText = document.getElementById("meaningText");
const meaningButton = document.getElementById("meaningButton");
const nextButton = document.getElementById("nextButton");

let currentIndex = -1;
let meaningVisible = false;

function hideMeaning() {
  meaningVisible = false;
  meaningPanel.hidden = true;
  meaningButton.textContent = "意味を見る";
  meaningButton.setAttribute("aria-expanded", "false");
}

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
  meaningText.textContent = item.meaning;
  hideMeaning();
}

function toggleMeaning() {
  meaningVisible = !meaningVisible;
  meaningPanel.hidden = !meaningVisible;
  meaningButton.textContent = meaningVisible ? "意味を閉じる" : "意味を見る";
  meaningButton.setAttribute("aria-expanded", String(meaningVisible));
}

meaningButton.addEventListener("click", toggleMeaning);
nextButton.addEventListener("click", showRandomWord);

meaningButton.setAttribute("aria-controls", "meaningPanel");
meaningButton.setAttribute("aria-expanded", "false");

showRandomWord();
