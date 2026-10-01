const ALL_WORDS = [
  ...(window.WORDS || []),
  ...(window.EXTRA_WORDS || [])
];

const screens = {
  home: document.getElementById("homeScreen"),
  study: document.getElementById("studyScreen"),
  history: document.getElementById("historyScreen")
};

const wordElement = document.getElementById("word");
const categoryElement = document.getElementById("category");
const meaningPanel = document.getElementById("meaningPanel");
const meaningText = document.getElementById("meaningText");
const meaningButton = document.getElementById("meaningButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const startButton = document.getElementById("startButton");
const historyButton = document.getElementById("historyButton");
const homeButton = document.getElementById("homeButton");
const historyHomeButton = document.getElementById("historyHomeButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");
const historySummary = document.getElementById("historySummary");
const progressText = document.getElementById("progressText");
const wordCount = document.getElementById("wordCount");

const HISTORY_KEY = "nandesore-history-v1";
const HISTORY_LIMIT = 300;

let currentIndex = -1;
let sessionTrail = [];
let trailPosition = -1;
let meaningVisible = false;

wordCount.textContent = ALL_WORDS.length;

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function hideMeaning() {
  meaningVisible = false;
  meaningPanel.hidden = true;
  meaningButton.textContent = "意味を見る";
  meaningButton.setAttribute("aria-expanded", "false");
}

function renderWord(index) {
  currentIndex = index;
  const item = ALL_WORDS[currentIndex];
  wordElement.textContent = item.word;
  categoryElement.textContent = item.category;
  meaningText.textContent = item.meaning;
  hideMeaning();
  backButton.disabled = trailPosition <= 0;
  progressText.textContent = `${ALL_WORDS.length}語収録`;
}

function randomIndex() {
  if (ALL_WORDS.length <= 1) return 0;
  let next = currentIndex;
  while (next === currentIndex) {
    next = Math.floor(Math.random() * ALL_WORDS.length);
  }
  return next;
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToHistory(item) {
  const history = loadHistory();
  history.unshift({
    word: item.word,
    category: item.category,
    viewedAt: new Date().toISOString()
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
}

function startStudy() {
  sessionTrail = [];
  trailPosition = -1;
  const index = randomIndex();
  sessionTrail.push(index);
  trailPosition = 0;
  renderWord(index);
  saveToHistory(ALL_WORDS[index]);
  showScreen("study");
}

function nextWord() {
  const index = randomIndex();
  sessionTrail = sessionTrail.slice(0, trailPosition + 1);
  sessionTrail.push(index);
  trailPosition += 1;
  renderWord(index);
  saveToHistory(ALL_WORDS[index]);
}

function previousWord() {
  if (trailPosition <= 0) return;
  trailPosition -= 1;
  renderWord(sessionTrail[trailPosition]);
}

function toggleMeaning() {
  meaningVisible = !meaningVisible;
  meaningPanel.hidden = !meaningVisible;
  meaningButton.textContent = meaningVisible ? "意味を閉じる" : "意味を見る";
  meaningButton.setAttribute("aria-expanded", String(meaningVisible));
}

function formatTime(iso) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function renderHistory() {
  const raw = loadHistory();
  const seen = new Set();
  const unique = raw.filter(item => {
    if (seen.has(item.word)) return false;
    seen.add(item.word);
    return true;
  });

  historyList.innerHTML = "";
  historySummary.textContent = raw.length
    ? `閲覧 ${raw.length}回・${unique.length}語`
    : "まだ閲覧履歴はありません";

  emptyHistory.hidden = unique.length > 0;

  unique.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";

    const main = document.createElement("span");
    const word = document.createElement("span");
    word.className = "history-word";
    word.textContent = item.word;

    const category = document.createElement("span");
    category.className = "history-category";
    category.textContent = item.category;

    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = formatTime(item.viewedAt);

    main.append(word, category);
    button.append(main, time);

    button.addEventListener("click", () => {
      const index = ALL_WORDS.findIndex(entry => entry.word === item.word);
      if (index < 0) return;
      sessionTrail = [index];
      trailPosition = 0;
      renderWord(index);
      showScreen("study");
    });

    historyList.appendChild(button);
  });
}

startButton.addEventListener("click", startStudy);
nextButton.addEventListener("click", nextWord);
backButton.addEventListener("click", previousWord);
meaningButton.addEventListener("click", toggleMeaning);

historyButton.addEventListener("click", () => {
  renderHistory();
  showScreen("history");
});

homeButton.addEventListener("click", () => showScreen("home"));
historyHomeButton.addEventListener("click", () => showScreen("home"));

clearHistoryButton.addEventListener("click", () => {
  if (!loadHistory().length) return;
  if (window.confirm("履歴をすべて消去しますか？")) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
});

meaningButton.setAttribute("aria-controls", "meaningPanel");
meaningButton.setAttribute("aria-expanded", "false");

showScreen("home");
