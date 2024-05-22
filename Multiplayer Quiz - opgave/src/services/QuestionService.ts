import Question from "../models/Question";
import { IAPIQuestion } from "../types/interfaces/IAPIQuestion";

class QuestionService {
    baseUrl: string = 'https://opentdb.com/api.php?amount='
    categoryUrl: string = 'https://opentdb.com/api_category.php'

    constructor() {
    }


getQuestions(aantal: number) {
    return new Promise((resolve, reject) => {
        fetch(`${this.baseUrl} + ${aantal}`)
           .then(response => response.json())
           .then(data => resolve(data))
           .catch(error => reject(error));
    });
}

    getCategories() {
        return new Promise((resolve, reject) => {
            fetch(this.categoryUrl)
               .then(response => response.json())
               .then(data => resolve(data))
               .catch(error => reject(error));
        })
    };
}
export default QuestionService