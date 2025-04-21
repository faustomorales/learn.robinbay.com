const wordList = ["apple", "grape", "melon", "peach", "berry"];
const correctWord = wordList[Math.floor(Math.random() * wordList.length)];

const input = document.getElementById("word-input");
const submitBtn = document.getElementById("submit-btn");
const message = document.getElementById("message");
const grid = document.getElementById("grid");

let attempts = 0;
const maxAttempts = 6;

submitBtn.addEventListener("click", () => {
  const guess = input.value.toLowerCase();
  input.value = "";

  if (guess.length !== 5) {
    message.textContent = "Please enter a 5-letter word.";
    return;
  }

  if (!{{"id": "validate-word", "default": "wordList.includes(guess)", "width": 25}}) {
    message.textContent = "Not a valid word.";
    return;
  }

  const row = document.createElement("div");
  row.className = "row";

  for (let i = 0; i < 5; i++) {
    const box = document.createElement("span");
    box.className = "letter";
    box.textContent = guess[i];

    if (guess[i] === correctWord[i]) {
      box.classList.add("correct");
    } else if ({{"id": "check-contains", "default": "correctWord.includes(guess[i])", "width": 30}}) {
      box.classList.add("present");
    } else {
      box.classList.add("absent");
    }

    row.appendChild(box);
  }

  grid.appendChild(row);

  if (guess === correctWord) {
    message.textContent = "Congratulations! You guessed it!";
    submitBtn.disabled = true;
    return;
  }

  attempts++;
  if (attempts >= maxAttempts) {
    message.textContent = `Game over. The word was ${correctWord}.`;
    submitBtn.disabled = true;
  }
});