const words = ["СОНЦЕ", "ГРА", "БУДИНОК", "ЯБЛУКО", "ПРОГРАМА"]; // коротші слова


const imageFiles = [
  "images/step0.png", 
  "images/step1.png",
  "images/step2.png",
  "images/step3.png",
  "images/step4.png"  
];


const MAX_MISTAKES = 4;

let chosenWord = "";
let guessed = [];
let mistakes = 0;

const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const hangmanImage = document.getElementById("hangman-image");
const attemptsInfo = document.getElementById("attempts-info");

function startGame() {
  chosenWord = words[Math.floor(Math.random() * words.length)];
  guessed = [];
  mistakes = 0;
  message.textContent = "";
  restartBtn.style.display = "none";
  hangmanImage.src = imageFiles[0]; 
  updateAttempts();
  generateLetterButtons();
  renderWord();
  updateImage();
}

function renderWord() {
  const display = chosenWord.split("").map(ch => {
    if (!isCyrillicLetter(ch)) return ch;
    return guessed.includes(ch) ? ch : "_";
  }).join(" ");
  wordDiv.textContent = display;

  if (!display.includes("_")) {
    endGame(true);
  }
}

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
    updateAttempts();

    if (mistakes >= MAX_MISTAKES) { 
      endGame(false);
    }
  }
}

function updateImage() {
  const idx = Math.min(mistakes, imageFiles.length - 1);
  hangmanImage.src = imageFiles[idx];
}

function updateAttempts() {
  attemptsInfo.textContent = `У вас залишилось спроб: ${MAX_MISTAKES - mistakes}`;
}

function isCyrillicLetter(ch) {
  return /[А-ЯҐЄІЇ'’]/i.test(ch);
}

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

restartBtn.addEventListener("click", startGame);

startGame();
