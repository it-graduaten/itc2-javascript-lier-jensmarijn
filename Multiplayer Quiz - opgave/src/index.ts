import Player from "./models/Player";
import Question from "./models/Question";
import QuizApp from "./models/Quiz";
import QuestionService from "./services/QuestionService";
import { GameMode } from "./types/enum/GameMode";
import { QuestionMode } from "./types/enum/QuestionMode";
import { IAnswer } from "./types/interfaces/IAnswer";
import { ICategory } from "./types/interfaces/ICategory";
import { Difficulty } from "./types/enum/Difficulty";

window.addEventListener('load', () => {

    const quizApp = new QuizApp([], [], 0, 1);
    const questionAnswers: IAnswer[] = [];
    const divWelcome = document.getElementById("welcome-container") as HTMLElement;
    const divQuestionsContainer = document.getElementById("question-container") as HTMLElement;
    const divPlayersContainer = document.getElementById("players-container") as HTMLElement;
    const divQuizContainer = document.getElementById("quiz-container") as HTMLElement;
    const divScoreboardContainer = document.getElementById("scoreboard-container") as HTMLElement;
    const divQuestionApiContainer = document.getElementById("question-api-container") as HTMLElement;
    const divCurrentPlayer = document.getElementById("current-player-container") as HTMLElement;
    const questionService = new QuestionService();
    


    //navigatie
    document.getElementById("aQuestions")?.addEventListener('click', () => {
        quizApp.questionMode === QuestionMode.Custom ? updateVisibleItem(divQuestionsContainer) : updateVisibleItem(divQuestionApiContainer);
    });

    document.getElementById("aPlayers")?.addEventListener('click', () => {
        updateVisibleItem(divPlayersContainer);
        const btn = document.getElementById("btn-start-quiz") as HTMLButtonElement;
        const btnAddPlayer = document.getElementById("btn-add-player") as HTMLButtonElement;

        if (quizApp.players.length === quizApp.numberOfPlayers) {
            btn.classList.remove('d-none');
            btnAddPlayer.classList.add('d-none');
        } else {
            btn.classList.add('d-none');
            btnAddPlayer.classList.remove('d-none');
        }

    });

    document.getElementById("aQuiz")?.addEventListener('click', () => {

        if (quizApp.players.length === quizApp.numberOfPlayers)
            quizApp.startQuiz();
        showCurrentPlayerBlock();
        updateVisibleItem(divQuizContainer);
        updateVisibleItem(divCurrentPlayer);

    });

    document.getElementById("aScoreboard")?.addEventListener('click', () => {
        updateVisibleItem(divScoreboardContainer);
        
    });

    document.getElementById("btn-start-quiz")?.addEventListener('click', () => {
        if (quizApp.players.length === quizApp.numberOfPlayers)
            quizApp.startQuiz();
        showCurrentPlayerBlock();
        updateVisibleItem(divQuizContainer);
        updateVisibleItem(divCurrentPlayer);
    });


    

  
    // implement logic to set the number of players

    document.getElementById('inpNrPlayers')?.addEventListener("change", (e) => {
        const inpNumberPlayers = e.target as HTMLInputElement;
        if (parseInt(inpNumberPlayers.value) < 1){
            quizApp.showCustomAlert("geef meer dan 2 spelers in!")
            return;
        }
        quizApp.numberOfPlayers = parseInt(inpNumberPlayers.value);
    })

    document.getElementById('gameMode')?.addEventListener("change", (e) => {
        const gameModeInput = e.target as HTMLInputElement;


        const gameMode = gameModeInput.checked ? GameMode.Multi : GameMode.Single;  


        const gameModeText = document.getElementById('txtGameMode');
        const inpNumberPlayers = document.getElementById('inpNrPlayers');
        

        
        if (gameModeText) {
            gameModeText.textContent = gameMode;
        }
       

        if  (gameMode === GameMode.Multi) {

            document.getElementById("btn-next")?.addEventListener('click', () => {
                console.log(quizApp.numberOfPlayers)
        
                if (quizApp.numberOfPlayers < 1) {
                    quizApp.showCustomAlert("geef een aantal spelers in groter dan 1!")
                    
                }
                else{
                    updateVisibleItem(divPlayersContainer);
                }
                
            });
            
            if (inpNumberPlayers){
                inpNumberPlayers.classList.remove('d-none');
                
                const numberOfPlayersInput = document.getElementById('inpNrPlayers') as HTMLInputElement;
                const numberOfPlayers = parseInt(numberOfPlayersInput.value);
               
                
                
            }
        }else {
            if (inpNumberPlayers) {
                inpNumberPlayers.classList.add('d-none');
                
                quizApp.numberOfPlayers = 1;
                document.getElementById("btn-next")?.addEventListener('click', () => {
        
                        updateVisibleItem(divPlayersContainer);
                    
                    
                });
        }
    }
    });

     

    document.getElementById("txtNumberQuestions")?.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const number = parseInt(target.value);
        quizApp.quizDuration = number * quizApp.numberOfPlayers;
        console.log(quizApp.quizDuration)
        const btn = document.getElementById("btnStart") as HTMLButtonElement;
        btn.disabled = number <= 0;
    });

    // implement logic to set the question mode
    document.getElementById('questionMode')?.addEventListener("change", (e) => {
        const questionText = document.getElementById("txtQuestionMode") as HTMLElement;
        const apiCont = document.getElementById('api-container') as HTMLElement;

        const target = e.target as HTMLInputElement;
       if (!target.checked) {
       quizApp.questionMode =(QuestionMode.Custom)
       questionText.innerText = QuestionMode.Custom;
       apiCont.classList.add('d-none')
       }else{
        quizApp.questionMode =(QuestionMode.Api)
        questionText.innerText = QuestionMode.Api;
        apiCont.classList.remove('d-none')
       }
    });

    // implement logic to fetch questions from api

 

    document.getElementById("btnStart")?.addEventListener("click", () => {
        const x = document.getElementById('gameMode') as any
        console.log(x)
        
        if(quizApp.numberOfPlayers <2 && x.checked){
            quizApp.showCustomAlert("geef een aantal spelers in groter dan 1!")
            return
        }
        quizApp.quizDuration = quizApp.numberOfPlayers
        console.log(quizApp.quizDuration)
        const navigation = document.getElementById("lstNavigation")
        navigation?.classList.remove('d-none')
        if (quizApp.questionMode === QuestionMode.Custom) {
            updateVisibleItem(divQuestionsContainer);
            const noQuestionText = document.getElementById("no-questions") as HTMLElement;
            let amountOfQuestions = (quizApp.quizDuration * quizApp.numberOfPlayers);
            noQuestionText.innerText = `No questions have been added yet. Add ${amountOfQuestions} questions to start.`;
        }
        
        
        else {
            updateVisibleItem(divQuestionApiContainer);
        }

    });

    document.getElementById("btn-add-question")?.addEventListener("click", () => {
        const q = document.getElementById("txt-question") as HTMLInputElement;
        const btnCloseModal = document.getElementById("btnCloseModal") as HTMLButtonElement;
        
        if (!validateQuestionInput(q.value, questionAnswers)) {
            // alert("Please fill in the question and provide at least one answer with the correct option.");
            return;
        }

        // if(questionAnswers.length <2){
        //     alert("geef minstens 2 antwoorden.")
        //     return
        // }
        const question = new Question(q.value);
        questionAnswers.forEach(a => question.addAnswer(a));
        quizApp.addQuestion(question);
        updateQuestionList();
        clearAnwsersList();
        q.value = '';

        quizApp.quizDuration === quizApp.questions.length ? updateVisibleItem(divPlayersContainer) : null;
        btnCloseModal.click();
        toggleAddQuestionButton();
    });

    document.getElementById("btn-add-answer")?.addEventListener('click', () => {
        const answer = document.getElementById("txt-answer") as HTMLInputElement;
       
        const chkAnswer = document.getElementById("chk-correct") as HTMLInputElement;
        const a: IAnswer = {
            text: answer.value,
            isCorrect: chkAnswer.checked
        }
        
        if(a.text != ""){
            questionAnswers.push(a);
            updateAnswersList();
        }

        else{
            alert("Geef een tekstuele waarde in voor het antwoord.")
        }
        

        answer.value = '';
        chkAnswer.checked = false;
    });

  

    document.getElementById("btn-add-player")?.addEventListener("click", () => {
        const input = document.getElementById("player-name") as HTMLInputElement;
        const name = input.value.trim();
        let addedPlayers = quizApp.players.length;
        

        if(name === ''){
            alert('Naam mag niet leeg zijn')
            return;
        }

        const existingPlayers = quizApp.players.find(player => player.name === name);
    if (existingPlayers) {
        alert('Kies een unieke naam')
        return;
    }
        
        quizApp.addPlayer(name);
        addedPlayers ++;
    
        input.value = "";

        if (addedPlayers === quizApp.numberOfPlayers) {
            showCurrentPlayerBlock();
            updateVisibleItem(divQuizContainer);
            quizApp.startQuiz();
        }
            
        
    });

    // implement logic to submit the answer, update the score and move to the next question
    // implement logic to restart the game
    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
        restartGame();
        
    })

    const restartGame = () => {
        quizApp.questions = [];
        quizApp.players = [];
        quizApp.currentPlayerIndex = 0;
        quizApp.currentQuestionIndex = 0;
        hideAllElementsExcept(divWelcome);
    };

    document.getElementById("btn-submit")?.addEventListener('click', () => {
        // Zoek het geselecteerde antwoord
        const selectedAnswer = document.querySelector('input[type="radio"]:checked');

        const id = quizApp.currentQuestionIndex;
        const correctAnswerList = document.getElementById("correct-answer-list") as HTMLElement

        const selectedAnswerValue = (selectedAnswer as HTMLInputElement).value

        const correctAnswer = correctAnswerList.contains(selectedAnswer)

        const correctQuestion = quizApp.testIfAnswerIsCorrect(quizApp.currentQuestionIndex ,selectedAnswerValue)
        const currentPlayer = quizApp.players[quizApp.currentPlayerIndex]
        
       
        if(correctQuestion === true){
            
            
            currentPlayer.updateScore(1)
        }
        

        quizApp.nextQuestion()
        
    });
    


    const updateQuestionList = () => {
        const noQuestions = document.getElementById("no-questions") as HTMLElement;
        const list = document.getElementById("question-list") as HTMLElement;

        list.innerHTML = '';

        quizApp.questions.forEach(q => {
            const li = document.createElement("li");
            li.textContent = q.toString();
            list.appendChild(li);
        });
        noQuestions.classList.add('d-none');
    };

    const updateAnswersList = () => {
        const answersList = document.getElementById("answers-list") as HTMLElement;
        const correctAnswerList = document.getElementById("correct-answer-list") as HTMLElement;

        answersList.innerHTML = '';
        correctAnswerList.innerHTML = '';

        questionAnswers.forEach(a => {
            const li = document.createElement("li");
            li.textContent = a.text;
            
            answersList.appendChild(li);
        });

        const correctAnswer = questionAnswers.find(a => a.isCorrect)
        if (correctAnswer) {
            const li = document.createElement("li");
            li.textContent = correctAnswer.text;
            correctAnswerList.appendChild(li);
        }

        toggleAddButton(correctAnswer);
    };

    const clearAnwsersList = () => {
        questionAnswers.length = 0;
        updateAnswersList();
    };

    const toggleAddQuestionButton = () => {
        const btn = document.getElementById("btn-add-q") as HTMLButtonElement;
        if (quizApp.questions.length === quizApp.quizDuration * quizApp.numberOfPlayers) {
            btn.disabled = true;
        }
    };

    const toggleAddButton = (correctAnswer: IAnswer | undefined) => {
        const btn = document.getElementById("btn-add-question") as HTMLButtonElement;
        btn.disabled = correctAnswer ? false : true;
    };

    const hideAllElementsExcept = (element: HTMLElement) => {
        const elementsToHide = [divCurrentPlayer, divWelcome, divQuestionsContainer, divPlayersContainer, divQuizContainer, divScoreboardContainer, divQuestionApiContainer];
        elementsToHide.forEach(e => {
            if (e !== null)
                e.classList.add('d-none')
        });
        element.classList.remove('d-none');
    };

    const updateVisibleItem = (element: HTMLElement) => {
        hideAllElementsExcept(element);

        if (element === divQuestionApiContainer || element === divQuestionsContainer) {
            const btnAdd = document.getElementById("btn-add-q") as HTMLButtonElement;
            const btnNext = document.getElementById("btn-next") as HTMLButtonElement;
            if (quizApp.questionMode === QuestionMode.Custom) {
                btnNext.classList.add("d-none");
                btnAdd.classList.remove("d-none");
                return;
            } else {
                btnNext.classList.remove("d-none");
                btnAdd.classList.add("d-none");
                return;
            }
        }

        if (element === divQuizContainer) {
            showCurrentPlayerBlock();
            return;
        }
    };

    const validateQuestionInput = (questionText: string, answers: IAnswer[]): boolean => {
        
        if(wordCount(questionText) < 5){
            alert("De vraag moet minstens 5 woorden omvatten.")
            return false
        }
        if (checkAnswers(answers) == false){
            alert("Geef minstens 2 antwoorden waarvan 1 correct.")
            return false
        }

        else{
            return true
        }
        // implement validation logic, return true if the input is valid
        // logic: questionText should have at least 5 characters, answers should have at least one correct answer
       
    };

    const showDifficulties = () => {
        const difficultySelect = document.getElementById("difficultySelect") as HTMLSelectElement;
        const difficulties = getDifficulty()
        difficulties.forEach((difficulty) =>{
            const option = document.createElement("option")
            option.value = difficulty
            option.innerText = difficulty
            difficultySelect.appendChild(option)
        })
    };


    const showCatagories = () => {
        const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;
    

       questionService.getCategories()
       .then(categories =>{

        categories.forEach((category: ICategory) =>{
            const option = document.createElement("option")
            option.value = category.id.toString()
            option.innerText = category.name
            categorySelect.appendChild(option)
        })

            }).catch(error => {
                console.log(error)
            })
    };


    const showCurrentPlayerBlock = () => {
        const currentPlayer = document.getElementById("current-player-container") as HTMLElement;
        currentPlayer.classList.remove("d-none");
        const currentPlayerName = document.getElementById("current-player-name") as HTMLElement;
        currentPlayerName.innerText = quizApp.players[quizApp.currentPlayerIndex].name ?? '';
    }
    function wordCount(questionText: string){
        const words = questionText.split(" ")
        return words.length
    }

    function checkAnswers(answersList: IAnswer[]){
        if (answersList.length < 2){
            return false
        }


        answersList.forEach(a => {
            if  (a.isCorrect == true){
                return true
            }

            if (a.text == ""){
                return false
            }

            return false
        });

        return true
    }



const getDifficulty = () => {
    const difficultyList: string[] = [];

    for (const difficulty in Difficulty) {
        const value = Difficulty[difficulty as keyof typeof Difficulty];

        if (typeof value === "string") {
            difficultyList.push(value);
        }
    }

    return difficultyList;

};


    const getQuestions = async () => {
        try{
            const questions =  questionService.getQuestions(2, "easy", {id:16, name:"Art"})
            console.log(questions)
        }catch (error){
            console.error(error);
        }
    }

    const init = () => {
        hideAllElementsExcept(divWelcome);
        
        getQuestions();
        console.log(showCatagories());
        showDifficulties();
    };


    init();

});
