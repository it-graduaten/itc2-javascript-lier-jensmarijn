import Question from "./Question";
import Player from "./Player";
import { GameMode } from "../types/enum/GameMode";
import { QuestionMode } from "../types/enum/QuestionMode";
import Swal from "sweetalert2";


class QuizApp {
  quizDuration: number = 0;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;

  numberOfPlayers: number;
  players: Player[] = [];
  currentPlayerIndex: number;
  questionMode: QuestionMode;

  constructor(questions: Question[], players: Player[], duration: number, numberofPlayers: number) {
    this.questions = questions;
    this.players = players;
    this.quizDuration = duration;
    this.questionMode = QuestionMode.Custom;
    this.currentPlayerIndex = 0;
    this.numberOfPlayers = numberofPlayers; 
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
    this.disableNavigation();
    this.currentQuestionIndex = 0;
    this.nextQuestion();
  }

  disableNavigation() {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('#lstNavigation a');
    navLinks.forEach(link => {
        //link.classList.add('disabled-link');
        link.addEventListener('click', this.preventNavigation.bind(this), true);

    });
  }

  enableNavigation() {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('#lstNavigation a');
    navLinks.forEach(link => {
        //link.classList.remove('disabled-link');
        link.removeEventListener('click', this.preventNavigation.bind(this), true);
    });
  }

  //.bind(this) zorgt ervoor dat we de showcustomalert kunnen oprozpen zonder een uncaught runtime error te krijgen.


  preventNavigation(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.showCustomAlert("Navigatie is uitgeschakeld tijdens de quiz. Probeer na de quiz opnieuw aub.")
}

showCustomAlert(message: string){
Swal.fire({
  text: message,
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: true,
  position: 'top',
  toast: true
})
}


  testIfAnswerIsCorrect(index: number, answer: string) {
    const question = this.questions[index - 1];
    const correctAnswer = question.answers.find(x => x.isCorrect);
    return correctAnswer?.text === answer;
  }

  nextQuestion() {
    console.log(this.currentPlayerIndex)
    console.log(this.currentQuestionIndex)
    if (this.currentQuestionIndex === this.questions.length) {
      this.endQuiz();
    } else {
      
      this.showQuestion(this.currentQuestionIndex);
      
      this.currentQuestionIndex++;
      if(this.currentPlayerIndex === this.players.length-1){
        this.currentPlayerIndex = 0
      }
      // else if(this.currentQuestionIndex == 0){
      //   this.currentPlayerIndex = 0
      // }
      else{
        this.currentPlayerIndex++;
      }

      this.showCurrentPlayer();
    }
    console.log(this.currentPlayerIndex)
    
  }

  updatePlayerList(elementId: string = "player-list") {
    const playersList = document.getElementById(elementId) as HTMLElement;
    if (!playersList) return;

    playersList.innerHTML = "";

    this.players.forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name} ${player.isCurrent ? "(Current)" : ""}`;
      playersList.appendChild(li);
      this.numberOfPlayers + 1;
      
    });
  }

  private endQuiz() {
    
    this.hideQuiz();
    this.showScoreBoard();
  }

  private hideQuiz() {
    this.enableNavigation();
    const quizContainer = document.getElementById("quiz-container") as HTMLElement;
    if (quizContainer) {
      quizContainer.classList.add("d-none");
    }
  }

  showCurrentPlayer() {
    const currentPlayerContainer = document.getElementById("current-player-container") as HTMLElement;
    const currentPlayerName = document.getElementById("current-player-name") as HTMLElement;

    if (currentPlayerContainer && currentPlayerName) {
      currentPlayerName.textContent = this.players[this.currentPlayerIndex].name
      currentPlayerContainer.classList.remove("d-none");
    }
  }

  private sortPlayersOnScore() {
    return this.players.sort((a, b) => b.score - a.score);
  }


  private showScoreBoard() {
    const btnRestart = document.getElementById("btn-restart-game") as HTMLButtonElement;
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

    btnRestart.addEventListener("click", () => {
      window.location.href = "index.html"
    })
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