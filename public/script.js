const question = document.querySelector("#question");
const gameBoard = document.querySelector("#game-board");
const h2 = document.querySelector("h2");

function fillQuestions(data) {
  question.innerText = data.question;
  if (data.winner === true) {
    gameBoard.style.display = "none";
    h2.innerText = "YOU WON THE GAME!";
    return;
  }
  if (data.loser === true) {
    gameBoard.style.display = "none";
    h2.innerText = "You lose the game, try again.";
    return;
  }
  for (const i in data.answers) {
    const answerEl = document.querySelector(`#answer${Number(i) + 1}`);
    answerEl.innerText = data.answers[i];
  }
}

function showNextQuestion() {
  fetch("/question", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => {
      fillQuestions(data);
    });
}
showNextQuestion();

const goodAnswersSpan = document.querySelector("#good-answers");

function handleAnswer(data) {
  goodAnswersSpan.innerText = data.goodAnswers;
  showNextQuestion();
}

function sendAnswer(index) {
  fetch(`/answer/${index}`, {
    method: "POST"
  })
    .then(r => r.json())
    .then(data => {
      handleAnswer(data);
    });
}

const buttons = document.querySelectorAll(".answer-btn");
for (const button of buttons) {
  button.addEventListener("click", event => {
    const answerIndex = event.target.dataset.answer;
    sendAnswer(answerIndex);
  });
}

const tip = document.querySelector("#tip");

function handleFriendsAnswer(data) {
  tip.innerText = data.text;
}
function phoneFirend() {
  fetch("/help/friend", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => {
      handleFriendsAnswer(data);
    });
}
document.querySelector("#phone-friend").addEventListener("click", phoneFirend);

function handleFiftyAnswer(data) {
  if (typeof data.text === "string") {
    tip.innerText = data.text;
  } else {
    for (const button of buttons) {
      if (data.answersRemove.indexOf(button.innerText) > -1) {
        button.innerText = " - ";
      }
    }
  }
}
function fiftyFifty() {
  fetch("/help/fiftyfifty", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => {
      handleFiftyAnswer(data);
    });
}
document.querySelector("#fifty-fifty").addEventListener("click", fiftyFifty);

function handleAudienceAnswer(data) {
  if (typeof data.text === "string") {
    tip.innerText = data.text;
  } else {
    data.chart.forEach((percent, index) => {
      buttons[index].innerText = `${buttons[index].innerText}: ${percent}%`;
    });
  }
}
function questionAudience() {
  fetch("/help/audience", {
    method: "GET"
  })
    .then(r => r.json())
    .then(data => {
      handleAudienceAnswer(data);
    });
}
document
  .querySelector("#question-audience")
  .addEventListener("click", questionAudience);
