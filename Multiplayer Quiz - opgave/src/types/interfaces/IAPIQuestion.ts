import { Difficulty } from "../enum/Difficulty";

export interface IAPIQuestion {
    type: string,
    difficulty: Difficulty,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
}