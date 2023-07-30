import { getData, setData, QuizIds, Quiz, Question, Answer, SessionId, SessionState } from './dataStore';
import HTTPError from 'http-errors';

const MAXNAME = 30;
const MINNAME = 3;
const MAXDESCRIPTION = 100;
const MAXQUESTIONLENGTH = 50;
const MINQUESTIONLENGTH = 5;
const MINANSWERS = 2;
const MAXANSWERS = 6;
const MAXPOINTS = 10;
const MINPOINTS = 1;
const MINANSWERLENGTH = 1;
const MAXANSWERLENGTH = 30;
const MAXDURATION = 180;

function adminQuizQuestionV2(
    authUserId: number,
    quizId: number,
    questionBody: questionInput
  ): QuestionId | ErrorObject {
    const data = getData();
  
    const user = data.users.find((user) => user.authUserId === authUserId);
    const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  
    // Error-checking block
    if (user === undefined) {
      throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
    } else if (currentQuiz === undefined) {
      throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
    } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
      throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
    } else if (
      questionBody.question.length < MINQUESTIONLENGTH ||
      questionBody.question.length > MAXQUESTIONLENGTH
    ) {
      throw HTTPError(400, {
        error:
          'Question string is less than 5 characters in length or greater than 50 characters in length'
      });
    } else if (
      questionBody.answers.length < MINANSWERS ||
      questionBody.answers.length > MAXANSWERS
    ) {
      throw HTTPError(400, { error: 'The question has more than 6 answers or less than 2 answers' });
    } else if (questionBody.duration < 0) {
      throw HTTPError(400, { error: 'The question duration is not a positive number' });
    } else if (
      currentQuiz.questions.reduce(
        (accumulator, currentItem) => accumulator + currentItem.duration, 0) +
        questionBody.duration > MAXDURATION
    ) {
      throw HTTPError(400, { error: 'The sum of the question durations in the quiz exceeds 3 minutes' });
    } else if (questionBody.points > MAXPOINTS || questionBody.points < MINPOINTS) {
      throw HTTPError(400, {
        error:
          'The points awarded for the question are less than 1 or greater than 10'
      });
    } else if (
      questionBody.answers.some(
        (answer) => answer.answer.length < MINANSWERLENGTH || answer.answer.length > MAXANSWERLENGTH
      )
    ) {
      throw HTTPError(400, { error: 'Answer strings should be between 1 and 30 characters long' });
    } else if (
      questionBody.answers.some(
        (answer, index, answers) =>
          answers.findIndex((a) => a.answer === answer.answer) !== index
      )
    ) {
      throw HTTPError(400, {
        error:
          'Answer strings should not contain duplicates within the same question'
      });
    } else if (!questionBody.answers.some((answer) => answer.correct)) {
      throw HTTPError(400, { error: 'Question must have at least one correct answer' });
    } else if (questionBody.thumbnailUrl === '') {
      throw HTTPError(400, { error: 'The thumbnailUrl is an empty string' });
    }

    try {
      const url = new URL(thumbnailUrl);
    } catch (error) {
      throw HTTPError(400, { error: 'The thumbnailUrl is an empty string' });
    }


    // Create a new answer array: this generates a random colour based on a random index
    const newAnswers: Answer[] = questionBody.answers.map((answer, index) => {
      const numbers = [0, 1, 2, 3, 4, 5];
      const randomIndex = Math.floor(Math.random() * numbers.length);
  
      // Remove the picked number from the array
      numbers.splice(randomIndex, 1);
  
      const colour: string = Object.values(Colours)[randomIndex];
      return {
        answerId: index,
        answer: answer.answer,
        colour: colour,
        correct: answer.correct
      };
    });

    // Assign new questionId and push question into the quiz
    const questionId = data.unclaimedQuestionId;
    const newQuestion: Question = {
      questionId: questionId,
      question: questionBody.question,
      duration: questionBody.duration,
      points: questionBody.points,
      answers: newAnswers,
      thumbnailUrl: questionBody.thumbnailUrl
    };

    data.unclaimedQuestionId++;
    currentQuiz.questions.push(newQuestion);
  
    // Update the timeLastEdited for the quiz and total duration
    currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
    const totalDuration = (total: number, question: Question) => {
      return total + question.duration;
    };
    currentQuiz.duration = currentQuiz.questions.reduce(totalDuration, 0);
    currentQuiz.numQuestions++;
  
    setData(data);
    return { questionId: questionId };
  }