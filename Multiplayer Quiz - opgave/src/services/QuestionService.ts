import Question from "../models/Question";
import { Difficulty } from "../types/enum/Difficulty";
import { IAPIQuestion } from "../types/interfaces/IAPIQuestion";
import { ICategory } from "../types/interfaces/ICategory";

class QuestionService {
    baseUrl: string = 'https://opentdb.com/api.php?amount='
    categoryUrl: string = 'https://opentdb.com/api_category.php'

    constructor() {
    }


getQuestions = async(aantal:number, difficulty: string, categorie: ICategory) => {
    try {
        const response = await fetch(`${this.baseUrl}${aantal}&type=multiple&difficulty=${difficulty}&category=${categorie.id}`);

        if (!response.ok){
            throw new Error("Api kan niet worden opgehaald");
        }

        const data = await response.json();
        const questions = data.results.map((q: IAPIQuestion) => q);
        return questions;
    } catch (error) {
        console.error(error);
}
}

getCategories = async(): Promise<ICategory[]> => {
    try {
        const response = await fetch(this.categoryUrl)

        if (!response.ok){
            throw new Error("Api kan niet worden ophehaald");
        }

        const data = await response.json();
        const categories: ICategory[] = data.trivia_categories.map((c: ICategory) => ({
            id: c.id,
            name: c.name,
        }))
        return categories;
    } catch (error) {
        console.error(error);
        return [];

}
}
}
export default QuestionService