import Question from "../models/Question";
import { IAPIQuestion } from "../types/interfaces/IAPIQuestion";

class QuestionService {
    baseUrl: string = 'https://opentdb.com/api.php?'
    categoryUrl: string = 'https://opentdb.com/api_category.php'

    constructor() {
    }
}

export default QuestionService;