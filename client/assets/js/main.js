const words = [
  { english: 'apple', emoji: '🍎' },
  { english: 'cat', emoji: '🐱' },
  { english: 'dog', emoji: '🐶' },
  { english: 'car', emoji: '🚗' },
  { english: 'sun', emoji: '☀️' },
  { english: 'ball', emoji: '⚽' },
  { english: 'fish', emoji: '🐟' },
  { english: 'book', emoji: '📘' },
  { english: 'star', emoji: '⭐' },
  { english: 'banana', emoji: '🍌' }
];

const targetWord = document.getElementById('targetWord');
const options = document.getElementById('options');
const feedback = document.getElementById('feedback');
const scoreLabel = document.getElementById('score');
const roundLabel = document.getElementById('round');
const speakButton = document.getElementById('speakButton');
const restartButton = document.getElementById('restartButton');

let score = 0;
let round = 1;
let currentAnswer = null;
let quizSet = [];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function speakWord(word) {
  if (!window.speechSynthesis) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function generateRoundData() {
  const answer = quizSet[round - 1];
  const wrongChoices = shuffle(words.filter((item) => item.english !== answer.english)).slice(0, 2);
  const choices = shuffle([answer, ...wrongChoices]);

  currentAnswer = answer;
  targetWord.textContent = answer.english.toUpperCase();
  options.innerHTML = '';

  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.setAttribute('aria-label', choice.english);
    button.innerHTML = `<span class="emoji">${choice.emoji}</span><span class="label">${choice.english}</span>`;
    button.addEventListener('click', () => evaluateAnswer(choice.english));
    options.appendChild(button);
  });

  speakWord(answer.english);
}

function disableOptions() {
  options.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
  });
}

function evaluateAnswer(selectedEnglish) {
  disableOptions();

  if (selectedEnglish === currentAnswer.english) {
    score += 1;
    feedback.textContent = '🎉 Chính xác! Giỏi lắm!';
    feedback.className = 'feedback good';
  } else {
    feedback.textContent = `💡 Đáp án đúng là ${currentAnswer.english.toUpperCase()}`;
    feedback.className = 'feedback';
  }

  scoreLabel.textContent = score;

  setTimeout(() => {
    if (round >= 10) {
      finishGame();
      return;
    }

    round += 1;
    roundLabel.textContent = round;
    feedback.textContent = '';
    feedback.className = 'feedback';
    generateRoundData();
  }, 1200);
}

function finishGame() {
  targetWord.textContent = 'FINISH!';
  options.innerHTML = '';
  feedback.textContent = `🌟 Bé được ${score}/10 điểm. Tuyệt vời!`;
  feedback.className = 'feedback good';
  restartButton.classList.remove('hidden');
}

function startGame() {
  score = 0;
  round = 1;
  quizSet = shuffle(words).slice(0, 10);
  scoreLabel.textContent = score;
  roundLabel.textContent = round;
  feedback.textContent = '';
  feedback.className = 'feedback';
  restartButton.classList.add('hidden');
  generateRoundData();
}

speakButton.addEventListener('click', () => {
  if (currentAnswer) {
    speakWord(currentAnswer.english);
  }
});

restartButton.addEventListener('click', startGame);

startGame();
