import Question from "./Question";
import Player from "./Player";
import { GameMode } from "../types/enum/GameMode";
import { QuestionMode } from "../types/enum/QuestionMode";

class QuizApp {
  quizDuration: number = 0;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;

  numberOfPlayers: number = 1;
  players: Player[] = [];
  currentPlayerIndex: number;
  questionMode: QuestionMode;

  constructor(questions: Question[], players: Player[], duration: number) {
    this.questions = questions;
    this.players = players;
    this.quizDuration = duration;
    this.questionMode = QuestionMode.Custom;
    this.currentPlayerIndex = 0;
  }

  setQuestionMode(mode: QuestionMode) {
    this.questionMode = mode;
  }

  addQuestion(q: Question) {
    if (!this.questions.includes(q))
      this.questions.push(q);
  }

  addPlayer(name: string) {
    const player = new Player(name);
    this.players.push(player);
    this.updatePlayerList();
  }

  removePlayer(name: string) {
    this.players = this.players.filter(player => player.name !== name);
    this.updatePlayerList();
  }

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.nextQuestion();
  }

  testIfAnswerIsCorrect(index: number, answer: string) {
    const question = this.questions[index];
    const correctAnswer = question.answers.find(x => x.isCorrect);
    return correctAnswer?.text === answer;
  }

  nextQuestion() {
    if (this.currentQuestionIndex === this.questions.length) {
      this.endQuiz();
    } else {
      this.showQuestion(this.currentQuestionIndex);
      this.currentQuestionIndex++;
    }
  }

  updatePlayerList(elementId: string = "player-list") {
    const playersList = document.getElementById(elementId) as HTMLElement;
    if (!playersList) return;

    playersList.innerHTML = "";

    this.players.forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name} ${player.isCurrent ? "(Current)" : ""}`;
      playersList.appendChild(li);
    });
  }

  private endQuiz() {
    this.hideQuiz();
    this.showScoreBoard();
  }

  private hideQuiz() {
    const quizContainer = document.getElementById("quiz-container") as HTMLElement;
    if (quizContainer) {
      quizContainer.classList.add("d-none");
    }
  }

  showCurrentPlayer() {
    const currentPlayerContainer = document.getElementById("current-player-container") as HTMLElement;
    const currentPlayerName = document.getElementById("current-player-name") as HTMLElement;

    if (currentPlayerContainer && currentPlayerName) {
      currentPlayerName.textContent = this.players[this.currentPlayerIndex]?.name;
      currentPlayerContainer.classList.remove("d-none");
    }
  }

  private sortPlayersOnScore() {
    return this.players.sort((a, b) => b.score - a.score);
  }


  private showScoreBoard() {
    const btnRestart = document.getElementById("btnRestart") as HTMLButtonElement;
    btnRestart.classList.remove("d-none");
    const scoreBoardContainer = document.getElementById("scoreboard-container") as HTMLElement;
    const scoreBoard = document.getElementById("scoreboard") as HTMLElement;
    if (scoreBoardContainer) {
      scoreBoardContainer.classList.remove("d-none");
      this.sortPlayersOnScore().forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.toString();
        scoreBoard.appendChild(li);
      });
    }
  }

  private showQuestion(index: number) {

    const question = this.questions[index];
    const questionElement = document.getElementById("question") as HTMLElement;
    if (questionElement) {
      questionElement.textContent = question.question;
    }

    const possibleAnswers = document.getElementById("answer-container") as HTMLElement;
    possibleAnswers.innerHTML = "";
    //loop through the answers and create a radiobutton for each one
    question.answers.forEach(answer => {
      // make sure the answers are shown underneat each other
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = answer.text;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(answer.text));
      possibleAnswers.appendChild(label);
      label.style.display = "block";
      label.style.marginBottom = "10px"; // Adjust the margin as needed for spacing      
    });
  }
}

export default QuizApp;