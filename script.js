
const words = ["СОНЦЕ", "КОМП'ЮТЕР", "ГАМАК", "БУДИНОК", "ЯБЛУКО", "ПРОГРАМА"];

// Масив файлів зображень (4 зображення)
const imageFiles = [
  "images/step0.png",
  "images/step1.png",
  "images/step2.png",
  "images/step3.png"
];

// Максимальна кількість помилок
const MAX_MISTAKES = imageFiles.length - 1;

// Ігровий стан
let chosenWord = "";
let guessed = [];
let mistakes = 0;

// DOM-елементи
const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const hangmanImage = document.getElementById("hangman-image");

// --- Ініціалізація гри ---
function startGame() {
  chosenWord = words[Math.floor(Math.random() * words.length)];
  guessed = [];
  mistakes = 0;
  message.textContent = "";
  restartBtn.style.display = "none";
  hangmanImage.src = imageFiles[0];
  generateLetterButtons();
  renderWord();
  updateImage();
}

// Показ слова (з підкресленнями)
function renderWord() {
  const display = chosenWord.split("").map(ch => {
    if (!isCyrillicLetter(ch)) return ch;
    return guessed.includes(ch) ? ch : "_";
  }).join(" ");
  wordDiv.textContent = display;

  // Перевірка на перемогу
  if (!display.includes("_")) {
    endGame(true);
  }
}

// Генерація кнопок української абетки
function generateLetterButtons() {
  lettersDiv.innerHTML = "";
  const alphabet = [..."АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'"];
  alphabet.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = "letter-btn";
    btn.addEventListener("click", () => handleGuess(letter, btn));
    lettersDiv.appendChild(btn);
  });
}

// Обробка відгадування букви
function handleGuess(letter, btn) {
  if (btn.disabled) return;
  btn.disabled = true;

  if (guessed.includes(letter)) return;

  if (chosenWord.includes(letter)) {
    guessed.push(letter);
    btn.classList.add("correct");
    renderWord();
  } else {
    mistakes++;
    btn.classList.add("wrong");
    updateImage();

    if (mistakes >= MAX_MISTAKES) {
      endGame(false);
    }
  }
}

// Оновлення зображення шибениці
function updateImage() {
  const idx = Math.min(mistakes, imageFiles.length - 1);
  hangmanImage.src = imageFiles[idx];
}

// Перевірка, чи символ — літера української абетки
function isCyrillicLetter(ch) {
  return /[А-ЯҐЄІЇ'’]/i.test(ch);
}

// Завершення гри
function endGame(win) {
  const buttons = lettersDiv.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (win) {
    message.textContent = "🎉 Ви виграли!";
    message.style.color = "green";
  } else {
    message.textContent = `💀 Ви програли. Слово: ${chosenWord}`;
    message.style.color = "red";
    wordDiv.textContent = chosenWord.split("").join(" ");
  }
  restartBtn.style.display = "block";
}

// Кнопка повторної гри
restartBtn.addEventListener("click", startGame);

// Запуск гри
startGame();
