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

interface NewQuestionId {
  newQuestionId: number;
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
    duration: 0,
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
    const [removedQuiz] = user.quizIds.splice(index, 1);
    user.trash.push(removedQuiz);

    const quizDetails = data.quizzes.find((id) => id.quizId === quizId);
    if (quizDetails === undefined) {
      return { error: 'Quiz ID does not refer to a valid quiz' };
    }
    quizDetails.timeLastEdited = Math.floor(Date.now() / 1000);
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
function adminQuizInfo(authUserId: number, quizId: number): Quiz | ErrorObject {
  // can't interface type just be Quiz from dataStore?
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
    duration: selected.duration,
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

function adminQuizQuestion(
  authUserId: number,
  quizId: number,
  questionBody: questionInput
): QuestionId | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (currentQuiz === undefined) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  } else if (
    questionBody.question.length < 5 ||
    questionBody.question.length > 50
  ) {
    return {
      error:
        'Question string is less than 5 characters in length or greater than 50 characters in length',
    };
  } else if (
    questionBody.answers.length < 2 ||
    questionBody.answers.length > 6
  ) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers',
    };
  } else if (questionBody.duration < 0) {
    return { error: 'The question duration is not a positive number' };
  } else if (
    currentQuiz.questions.reduce(
      (accumulator, currentItem) => accumulator + currentItem.duration,
      0
    ) +
      questionBody.duration >
    180
  ) {
    return {
      error: 'The sum of the question durations in the quiz exceeds 3 minutes',
    };
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    return {
      error:
        'The points awarded for the question are less than 1 or greater than 10',
    };
  } else if (
    questionBody.answers.some(
      (answer) => answer.answer.length < 1 || answer.answer.length > 30
    )
  ) {
    return {
      error: 'Answer strings should be between 1 and 30 characters long',
    };
  } else if (
    questionBody.answers.some(
      (answer, index, answers) =>
        answers.findIndex((a) => a.answer === answer.answer) !== index
    )
  ) {
    return {
      error:
        'Answer strings should not contain duplicates within the same question',
    };
  } else if (!questionBody.answers.some((answer) => answer.correct)) {
    return { error: 'Question must have at least one correct answer' };
  }

  const newAnswers: Answer[] = questionBody.answers.map((answer, index) => {
    const colour = answer.correct ? 'green' : 'red';
    return {
      answerId: index,
      answer: answer.answer,
      colour: colour,
      correct: answer.correct,
    };
  });
  const questionId = data.unclaimedQuestionId;
  // const questionId = currentQuiz.questions.length;
  const newQuestion: Question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: newAnswers,
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
  // Return the questionId of the newly added question
  return { questionId: questionId };
}

/**
 * This function moves a question to a specificed position
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {number} questionId
 * @param {number} newPosition
 *
 * @returns {{}}
 *
 */
function adminQuizQuestionMove(
  authUserId: number,
  quizId: number,
  questionId: number,
  newPosition: number
): Record<string, never> | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (currentQuiz === undefined) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  } else if (
    !currentQuiz.questions.some(
      (question) => question.questionId === questionId
    )
  ) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
    };
  } else if (newPosition < 0 || newPosition > currentQuiz.questions.length - 1) {
    return {
      error: 'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions',
    };
  }
  const sourceQuestion = currentQuiz.questions.find(
    (question) => question.questionId === questionId
  );
  const currentPosition = currentQuiz.questions.indexOf(sourceQuestion);
  if (currentPosition === newPosition) {
    return { error: 'NewPosition is the position of the current question' };
  }

  // Create a copy 'newQuestion': splice to correct index and then remove old one
  const newQuestion = { ...sourceQuestion };
  currentQuiz.questions.splice(newPosition + 1, 0, newQuestion);
  currentQuiz.questions.splice(currentPosition, 1);

  // Update values for currentQuiz: timeLastEdited
  currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

/**
 * This function duplicates a question and adds it directly afterwards.
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {number} questionId
 *
 * @returns {{questionId: number}}
 *
 */
function adminQuizQuestionDuplicate(
  authUserId: number,
  quizId: number,
  questionId: number
): NewQuestionId | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid user' };
  } else if (currentQuiz === undefined) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  } else if (
    !currentQuiz.questions.some(
      (question) => question.questionId === questionId
    )
  ) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
    };
  }

  // Create a copy 'newQuestion' and splice to correct index
  const sourceQuestion = currentQuiz.questions.find(
    (question) => question.questionId === questionId
  );
  const questionIndex = currentQuiz.questions.indexOf(sourceQuestion);
  const newQuestion = { ...sourceQuestion };

  // also increment unclaimedQuestionId
  newQuestion.questionId = data.unclaimedQuestionId;
  data.unclaimedQuestionId++;

  currentQuiz.questions.splice(questionIndex + 1, 0, newQuestion);

  // Update values for currentQuiz: timeLastEdited & duration & numQuestions
  currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  const totalDuration = (total: number, question: Question) => {
    return total + question.duration;
  };
  currentQuiz.duration = currentQuiz.questions.reduce(totalDuration, 0);
  currentQuiz.numQuestions++;

  setData(data);
  return { newQuestionId: newQuestion.questionId };
}

function adminQuizTrash(
  authUserId: number
): EmptyQuizList | QuizList | ErrorObject {
  const data = getData();
  const user = data.users.find((user) => user.authUserId === authUserId);
  if (user === undefined) {
    return { error: 'AuthUserId is not a valid' };
  }
  return { quizzes: user.trash };
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizQuestion,
  adminQuizQuestionMove,
  adminQuizQuestionDuplicate,
  adminQuizTrash
};
