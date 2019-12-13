function gameRoutes(app) {
  let goodAnswers = 0;
  let gameOver = false;
  let phoneFriendUsed = false;
  let questionAudienceUsed = false;
  let fiftyFiftyUsed = false;

  const questions = [
    {
      question: "What is the most popular programming language?",
      answers: ["C++", "JavaScript", "PHP", "Java"],
      correctAnswer: 1
    },
    {
      question: "What is the best programming language?",
      answers: ["C++", "PHP", "Java", "JavaScript"],
      correctAnswer: 3
    },
    {
      question: "What is the most interesting language?",
      answers: ["C++", "PHP", "JavaScript", "Java"],
      correctAnswer: 2
    }
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true
      });
    } else if (gameOver) {
      res.json({
        loser: true
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      const { question, answers } = nextQuestion;
      res.json({
        question,
        answers
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (gameOver) {
      res.json({
        loser: true
      });
    }
    const { index } = req.params;
    const question = questions[goodAnswers];
    const correctAnswer = question.correctAnswer === Number(index);
    if (correctAnswer) {
      goodAnswers++;
    } else {
      gameOver = true;
    }
    res.json({
      correct: correctAnswer,
      goodAnswers
    });
  });

  app.get("/help/friend", (req, res) => {
    if (phoneFriendUsed) {
      return res.json({
        text: "You have already used this help."
      });
    }
    phoneFriendUsed = true;
    const friendHelp = Math.random() < 0.5;
    const question = questions[goodAnswers];
    res.json({
      text: friendHelp
        ? `I think answer is ${question.answers[question.correctAnswer]}`
        : "Sorry, I really do not know..."
    });
  });

  app.get("/help/fiftyfifty", (req, res) => {
    if (fiftyFiftyUsed) {
      return res.json({
        text: "You have already used this help."
      });
    }
    fiftyFiftyUsed = true;
    const question = questions[goodAnswers];
    const arrAnswers = question.answers.filter(
      (string, index) => index !== question.correctAnswer
    );
    arrAnswers.splice(~~(Math.random() * arrAnswers.length), 1);

    res.json({
      answersRemove: arrAnswers
    });
  });

  app.get("/help/audience", (req, res) => {
    if (questionAudienceUsed) {
      return res.json({
        text: "You have already used this help."
      });
    }
    questionAudienceUsed = true;
    const chart = [10, 20, 30, 40];
    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);
      chart[i] += change;
      chart[i - 1] -= change;
    }
    const question = questions[goodAnswers];
    const { correctAnswer } = question;
    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]]; // change 2 elements in places [40, 30]
    res.json({
      chart
    });
  });
}

module.exports = gameRoutes;
