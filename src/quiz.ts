import { getData, setData, QuizIds, Quiz, Question, Answer } from './dataStore';

interface ErrorObject {
  error: string;
}

interface QuizId {
  quizId: number;
}

interface EmptyQuizList {
  quizzes: [];
}

interface QuizList {
  quizzes: QuizIds[];
}

interface answerInput {
  answer: string;
  correct: boolean;
}

interface questionInput {
  question: string;
  duration: number;
  points: number;
  answers: answerInput[];
}

interface QuestionId {
  questionId: number;
}

/**
 * This function provides a list of all the quizzes owned by the currently
 * logged in user.
 *
 * @param {integer} authUserId
 *
 * @returns {
 *  quizzes: [
 *      {
 *          quizId: integer,
 *          name: string
 *      }
 *  ]
 * }
 */
function adminQuizList(
  authUserId: number
): EmptyQuizList | QuizList | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (user.quizIds) {
    return { quizzes: user.quizIds.map((quiz) => quiz) };
  }

  return {
    quizzes: [],
  };
}

/**
 * This function creates a quiz given a basic description for the logged in
 * user, thus creating a new quix for an individual.
 *
 * @param {number} authUserId
 * @param {string} name
 * @param {string} description
 *
 * @returns {{quizId: number}}
 */
function adminQuizCreate(
  authUserId: number,
  name: string,
  description: string
): QuizId | ErrorObject {
  const data = getData();

  // Save the selected user to be used for error checking & return values
  const user = data.users.find((user) => user.authUserId === authUserId);
  const acceptedCharacters = /^[a-zA-Z0-9 ]+$/;

  // Error checking block
  if (!data.users.some((users) => users.authUserId === authUserId)) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (!acceptedCharacters.test(name)) {
    return { error: 'Name contains invalid characters' };
  } else if (name.length > 30 || name.length < 3) {
    return { error: 'Name is less than 3 or more than 30 characters' };

    // Checks if 'quizIds' exists as an array & that it has the correct quiz 'name
  } else if (
    user.quizIds &&
    Array.isArray(user.quizIds) &&
    user.quizIds.some((quiz) => quiz.name === name)
  ) {
    return { error: 'Name is already used for another quiz' };
  } else if (description.length > 100) {
    return { error: 'Description is more than 100 characters' };
  }

  const quizId = data.quizzes.length;
  const currentTime = Math.floor(Date.now() / 1000);

  // Adds quiz to the quizIds array in this user's object.
  user.quizIds.push({
    quizId: quizId,
    name: name,
  });

  data.quizzes.push({
    quizId: quizId,
    name: name,
    timeCreated: currentTime,
    timeLastEdited: currentTime,
    description: description,
    numQuestions: 0,
    questions: [],
    duration: 0
  });

  setData(data);

  return {
    quizId: quizId,
  };
}

/**
 * This function is given a particular quiz and then permanently removes
 * and deletes the quiz.
 *
 * @param {integer} authUserId
 * @param {integer} quizId
 *
 * @returns {}
 */
function adminQuizRemove(
  authUserId: number,
  quizId: number
): Record<string, never> | ErrorObject {
  const data = getData();
  const user = data.users.find((user) => user.authUserId === authUserId);
  const quiz = data.trash.find((item) => item.quizId === quizId);
  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (!data.quizzes.some((quizzes) => quizzes.quizId === quizId)) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (!user.quizIds.some((id) => id.quizId === quizId)) {
    return {
      error: 'Quiz ID does not refer to a valid quiz that this user owns',
    };
  } else {
    // If no errors; remove the quiz and update 'quizzes' in dataStore.js
    const index = user.quizIds.findIndex((id) => id.quizId === quizId);
    user.quizIds.splice(index, 1);

    const indexQuiz = data.quizzes.findIndex((id) => id.quizId === quizId);
    const [removedQuiz] = data.quizzes.splice(indexQuiz, 1);
    data.trash.push(removedQuiz);
    const quiz = data.trash.find((item) => item.quizId === quizId);
    if (quiz === undefined) {
      return { error: 'Quiz ID does not refer to a valid quiz' };
    }
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  }
}

/**
 * This function returns all the relevant information
 * about the given quiz.
 *
 * @param {integer} authUserId
 * @param {integer} quizId
 *
 * @returns {
 *  quizId: integer,
 *  name: string,
 *  timeCreated: integer,
 *  timeLastEdited: integer,
 *  description: string,
 * }
 */
function adminQuizInfo(
  authUserId: number,
  quizId: number
): Quiz | ErrorObject {
  //can't interface type just be Quiz from dataStore?
  const data = getData();

  // Save the selected user to be used for error checking & return values
  const user = data.users.find((user) => user.authUserId === authUserId);
  const selected = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (selected === undefined) {
    return { error: 'Quiz Id does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz Id does not refer to a quiz that this user owns' };
  }

  return {
    quizId: selected.quizId,
    name: selected.name,
    timeCreated: selected.timeCreated,
    timeLastEdited: selected.timeLastEdited,
    description: selected.description,
    numQuestions: selected.numQuestions,
    questions: selected.questions,
    duration: selected.duration //this might need to be coded
  };
}

/**
 * Function to update the name of the given quiz.
 *
 * @param {integer} authUserId
 * @param {integer} quizId
 * @param {string} name
 *
 * @returns {}
 */
function adminQuizNameUpdate(
  authUserId: number,
  quizId: number,
  name: string
): Record<string, never> | ErrorObject {
  const data = getData();
  const acceptedCharacters = /^[a-zA-Z0-9 ]+$/;

  // Save the selected user to be used for error checking & return values
  const user = data.users.find((user) => user.authUserId === authUserId);
  const selected = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (!acceptedCharacters.test(name)) {
    return {
      error:
        'Name contains any characters that are not alphanumeric or are spaces',
    };
  } else if (name.length < 3 || name.length > 30) {
    return {
      error:
        'Name is either less than 3 characters long or more than 30 characters long',
    };
  } else if (selected === undefined) {
    return { error: 'Quiz Id does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz Id does not refer to a quiz that this user owns' };
  } else if (user.quizIds.some((quiz) => quiz.name === name)) {
    return {
      error:
        'Name is already used by the current logged in user for another quiz',
    };
  }

  // Inputs are valid thus change name and timeLastEdited
  const userQuiz = user.quizIds.find((quiz) => quiz.quizId === quizId);
  if (userQuiz === undefined) {
    return { error: 'Quiz Id does not refer to a valid quiz' };
  }

  selected.name = name;
  userQuiz.name = name;
  selected.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

/**
 * This function updates the description of the relevant quiz.
 *
 * @param {integer} authUserId
 * @param {integer} quizId
 * @param {string} description
 *
 * @returns {}
 *
 */
function adminQuizDescriptionUpdate(
  authUserId: number,
  quizId: number,
  description: string
): Record<string, never> | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const selected = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (selected === undefined) {
    return { error: 'Quiz Id does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz Id does not refer to a quiz that this user owns' };
  } else if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  // Inputs are valid thus change description and timeLastEdited
  selected.description = description;
  selected.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

function adminQuizQuestion(authUserId: number, quizId: number, questionBody: questionInput): QuestionId | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (currentQuiz === undefined) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  } else if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return { error: 'Question string is less than 5 characters in length or greater than 50 characters in length' };
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: 'The question has more than 6 answers or less than 2 answers' };
  } else if (questionBody.duration < 0) {
    return { error: 'The question duration is not a positive number' };
  } else if (
    currentQuiz.questions.reduce((accumulator, currentItem) => accumulator + currentItem.duration, 0) +
      questionBody.duration >
    180
  ) {
    return { error: 'The sum of the question durations in the quiz exceeds 3 minutes' };
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    return { error: 'The points awarded for the question are less than 1 or greater than 10' };
  } else if (
    questionBody.answers.some((answer) => answer.answer.length < 1 || answer.answer.length > 30)
  ) {
    return { error: 'Answer strings should be between 1 and 30 characters long' };
  } else if (
    questionBody.answers.some(
      (answer, index, answers) =>
        answers.findIndex((a) => a.answer === answer.answer) !== index
    )
  ) {
    return { error: 'Answer strings should not contain duplicates within the same question' };
  } else if (!questionBody.answers.some((answer) => answer.correct)) {
    return { error: 'Question must have at least one correct answer' };
  }

  const questionId = currentQuiz.questions.length + 1;
  const newAnswers: Answer[] = questionBody.answers.map((answer, index) => {
  const colour = answer.correct ? 'green' : 'red';
    return {
      answerId: index,
      answer: answer.answer,
      colour: colour,
      correct: answer.correct,
    };
  });

  const newQuestion: Question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: newAnswers,
  };

  currentQuiz.questions.push(newQuestion);

  // Update the timeLastEdited for the quiz
  currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  setData(data);
  // Return the questionId of the newly added question
  return { questionId: questionId };
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizQuestion
};