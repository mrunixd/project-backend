import { getData, setData, QuizIds, Quiz, Question, Answer } from './dataStore';
import HTTPError from 'http-errors';

// defining all magic numbers
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

enum Colours {
  red = 'red',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  purple = 'purple',
  orange = 'orange',
}
/**
 * This function provides a list of all the quizzes owned by the currently
 * logged in user.
 *
 * @param {number} authUserId
 *
 * @returns {
 *  quizzes: [
 *      {
 *          quizId: number,
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (!acceptedCharacters.test(name)) {
    throw HTTPError(400, { error: 'Name contains invalid characters' });
  } else if (name.length > MAXNAME || name.length < MINNAME) {
    throw HTTPError(400, { error: 'Name is less than 3 or more than 30 characters' });

    // Checks if 'quizIds' exists as an array & that it has the correct quiz 'name
  } else if (
    (user.quizIds.some((quiz) => quiz.name === name) ||
    user.trash.some((quiz) => quiz.name === name))
  ) {
    throw HTTPError(400, { error: 'Name is already used for another quiz' });
  } else if (description.length > MAXDESCRIPTION) {
    throw HTTPError(400, { error: 'Description is more than 100 characters' });
  }

  const quizId = data.quizCounter;
  const currentTime = Math.floor(Date.now() / 1000);

  data.quizCounter++;
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
 * @param {number} authUserId
 * @param {number} quizId
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (!data.quizzes.some((quizzes) => quizzes.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  } else if (!user.quizIds.some((id) => id.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz that this user owns' });
  }
  // If no errors; remove the quiz and update 'quizzes' in dataStore.js
  const index = user.quizIds.findIndex((id) => id.quizId === quizId);
  const [removedQuiz] = user.quizIds.splice(index, 1);
  user.trash.push(removedQuiz);

  const quizDetails = data.quizzes.find((id) => id.quizId === quizId);
  if (quizDetails === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  }
  quizDetails.timeLastEdited = Math.floor(Date.now() / 1000);
  setData(data);
  return {};
}

/**
 * This function returns all the relevant information
 * about the given quiz.
 *
 * @param {number} authUserId
 * @param {number} quizId
 *
 * @returns {
 *  quizId: number,
 *  name: string,
 *  timeCreated: number,
 *  timeLastEdited: number,
 *  description: string,
 * }
 */
function adminQuizInfo(authUserId: number, quizId: number): Quiz | ErrorObject {
  const data = getData();

  // Save the selected user to be used for error checking & return values
  const user = data.users.find((user) => user.authUserId === authUserId);
  const selected = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error checking block
  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (selected === undefined) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a valid quiz' });
  } else if (
    !user.quizIds.some((quiz) => quiz.quizId === quizId) &&
    !user.trash.some((quiz) => quiz.quizId === quizId)
  ) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a quiz that this user owns' });
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
 * @param {number} authUserId
 * @param {number} quizId
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (!acceptedCharacters.test(name)) {
    throw HTTPError(400, { error: 'Name contains any characters that are not alphanumeric or are spaces' });
  } else if (name.length < MINNAME || name.length > MAXNAME) {
    throw HTTPError(400, {
      error:
        'Name is either less than 3 characters long or more than 30 characters long'
    });
  } else if (selected === undefined) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a valid quiz' });
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a quiz that this user owns' });
  } else if (user.quizIds.some((quiz) => quiz.name === name)) {
    throw HTTPError(400, {
      error:
        'Name is already used by the current logged in user for another quiz'
    });
  }

  // Inputs are valid thus change name and timeLastEdited
  const userQuiz = user.quizIds.find((quiz) => quiz.quizId === quizId);
  if (userQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a valid quiz' });
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
 * @param {number} authUserId
 * @param {number} quizId
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (selected === undefined) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a valid quiz' });
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz Id does not refer to a quiz that this user owns' });
  } else if (description.length > MAXDESCRIPTION) {
    throw HTTPError(400, { error: 'Description is more than 100 characters in length' });
  }

  // Inputs are valid thus change description and timeLastEdited
  selected.description = description;
  selected.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

/**
 * This function views all the quizzes in the trash and returns them as an array.
 *
 * @param {number} authUserId
 *
 * @returns {EmptyQuizList | QuizList}
 *
 */
function adminQuizTrash(
  authUserId: number
): EmptyQuizList | QuizList | ErrorObject {
  const data = getData();
  const user = data.users.find((user) => user.authUserId === authUserId);
  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid' });
  }
  return { quizzes: user.trash };
}

/**
 * This function restores a specific quiz from the trash
 *
 * @param {number} authUserId
 * @param {number} quizId
 *
 * @returns {}
 *
 */
function adminQuizRestore(
  authUserId: number,
  quizId: number
): Record<string, never> | ErrorObject {
  const data = getData();
  const user = data.users.find((user) => user.authUserId === authUserId);
  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  }
  const quizzes = data.quizzes.find((quiz) => quiz.quizId === quizId);
  const restoredQuiz = user.trash.find((quiz) => quiz.quizId === quizId);
  const checkQuizzes = user.quizIds.find((quiz) => quiz.quizId === quizId);
  const index = user.trash.findIndex((trash) => trash.quizId === quizId);

  if (quizzes === undefined) {
    throw HTTPError(400, { error: 'Quiz id does not refer to a valid quiz' });
  } else if (checkQuizzes === undefined && restoredQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz id does not refer to a valid quiz that this user owns' });
  } else if (restoredQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz id refers to a quiz that is not currently in trash' });
  } else {
    const [movingQuiz] = user.trash.splice(index, 1);
    user.quizIds.push(movingQuiz);
    quizzes.timeLastEdited = Math.floor(Date.now() / 1000);
    setData(data);
    return {};
  }
}

/**
 * This function restores a specific quiz from the trash
 *
 * @param {string[]} array
 * @param {number} userId
 *
 * @returns {}
 *
 */
function adminQuizTrashEmpty(
  array: string[],
  userId: number
): Record<string, never> | ErrorObject {
  const data = getData();
  const user = data.users.find((user) => user.authUserId === userId);
  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  }
  // error checking array
  for (const string of array) {
    const quizId = parseInt(string);
    const quizzes = data.quizzes.find((quiz) => quiz.quizId === quizId);
    const trashQuiz = user.trash.find((quiz) => quiz.quizId === quizId);
    const workingQuizzes = user.quizIds.find((quiz) => quiz.quizId === quizId);
    if (quizzes === undefined) {
      throw HTTPError(400, { error: 'One or more of the Quiz Ids is not a valid quiz' });
    } else if (trashQuiz === undefined && workingQuizzes === undefined) {
      throw HTTPError(400, { error: 'One or more of the Quiz IDs refers to a quiz that this current user does not own' });
    } else if (trashQuiz === undefined) {
      throw HTTPError(400, { error: 'One or more of the Quiz IDs is not currently in the trash' });
    }
  }

  for (const string of array) {
    const quizId = parseInt(string);
    const quizIndex = user.trash.findIndex((quiz) => quiz.quizId === quizId);
    user.trash.splice(quizIndex, 1);
  }
  setData(data);
  return {};
}

/**
 * This function creates a new question provided a quizId and a question body.
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {questionInput} questionBody
 *
 * @returns {QuestionId}
 *
 */
function adminQuizQuestion(
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
      (accumulator, currentItem) => accumulator + currentItem.duration,
      0
    ) +
      questionBody.duration >
    MAXDURATION
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

/**
 * This function transfers a quiz from one person to a specified email
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} userEmail
 *
 * @returns {{}}
 *
 */
function adminQuizTransfer(
  authUserId: number,
  quizId: number,
  userEmail: string
): Record<string, never> | ErrorObject {
  const data = getData();

  const currentUser = data.users.find((user) => user.authUserId === authUserId);
  const targetUser = data.users.find((user) => user.email === userEmail);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  // Error-checking block
  if (currentUser === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (currentQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  } else if (!currentUser.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
  } else if (targetUser === undefined) {
    throw HTTPError(400, { error: 'userEmail is not a real user' });
  } else if (currentUser.email === userEmail) {
    throw HTTPError(400, { error: 'userEmail is the current logged in user' });
  } else if (
    targetUser.quizIds.some((quiz) => quiz.name === currentQuiz.name)
  ) {
    throw HTTPError(400, {
      error:
        'Quiz ID refers to a quiz that has a name that is already used by the target user'
    });
  }

  const newQuiz = { ...currentQuiz };
  targetUser.quizIds.push({
    quizId: newQuiz.quizId,
    name: newQuiz.name,
  });
  const currentPosition = currentUser.quizIds.indexOf(currentQuiz);
  currentUser.quizIds.splice(currentPosition, 1);

  setData(data);
  return {};
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (currentQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
  } else if (
    !currentQuiz.questions.some(
      (question) => question.questionId === questionId
    )
  ) {
    throw HTTPError(400, { error: 'Question Id does not refer to a valid question within this quiz' });
  } else if (
    newPosition < 0 ||
    newPosition > currentQuiz.questions.length - 1
  ) {
    throw HTTPError(400, {
      error:
        'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions'
    });
  }
  const sourceQuestion = currentQuiz.questions.find(
    (question) => question.questionId === questionId
  );
  const currentPosition = currentQuiz.questions.indexOf(sourceQuestion);
  if (currentPosition === newPosition) {
    throw HTTPError(400, { error: 'NewPosition is the position of the current question' });
  }

  // Create a copy 'newQuestion': remove old one and then insert at correct index
  const newQuestion = { ...sourceQuestion };
  currentQuiz.questions.splice(currentPosition, 1);
  currentQuiz.questions = [...currentQuiz.questions.slice(0, newPosition), newQuestion, ...currentQuiz.questions.slice(newPosition)];
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
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (currentQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  } else if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
  } else if (
    !currentQuiz.questions.some(
      (question) => question.questionId === questionId
    )
  ) {
    throw HTTPError(400, { error: 'Question Id does not refer to a valid question within this quiz' });
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

/**
 * This function updates the body of the question
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {number} questionId
 * @param {questionInput} questionBody
 *
 * @returns {}
 *
 */
function adminQuizQuestionUpdate(
  authUserId: number,
  quizId: number,
  questionId: number,
  questionBody: questionInput
): Record<string, never> | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (currentQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  }
  const currentQuestion = currentQuiz.questions.find(
    (question) => question.questionId === questionId
  );

  if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
  } else if (currentQuestion === undefined) {
    throw HTTPError(400, { error: 'Question ID does not refer to a valid question in this quiz' });
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
      (accumulator, currentItem) => accumulator + currentItem.duration,
      0
    ) +
      questionBody.duration >
    MAXDURATION
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
  }

  const newAnswers: Answer[] = questionBody.answers.map((answer, index) => {
    const numbers = [0, 1, 2, 3, 4, 5];
    const randomIndex = Math.floor(Math.random() * numbers.length);

    // Remove the picked number from the array
    numbers.splice(randomIndex, 1);

    const colour = Object.values(Colours)[randomIndex];
    return {
      answerId: index,
      answer: answer.answer,
      colour: colour,
      correct: answer.correct
    };
  });

  currentQuestion.questionId = questionId;
  currentQuestion.question = questionBody.question;
  currentQuestion.duration = questionBody.duration;
  currentQuestion.points = questionBody.points;
  currentQuestion.answers = newAnswers;
  // Update the timeLastEdited for the quiz and duration
  currentQuiz.duration = currentQuiz.questions.reduce(
    (total, question) => total + question.duration,
    0
  );
  currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  setData(data);

  return {};
}

/**
 * This function deletes a specified question
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {number} questionId
 *
 * @returns {}
 *
 */
function adminQuizQuestionDelete(
  authUserId: number,
  quizId: number,
  questionId: number
): Record<string, never> | ErrorObject {
  const data = getData();

  const user = data.users.find((user) => user.authUserId === authUserId);
  const currentQuiz = data.quizzes.find((quiz) => quiz.quizId === quizId);

  if (user === undefined) {
    throw HTTPError(400, { error: 'AuthUserId is not a valid user' });
  } else if (currentQuiz === undefined) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a valid quiz' });
  }
  const currentQuestion = currentQuiz.questions.find(
    (question) => question.questionId === questionId
  );

  if (!user.quizIds.some((quiz) => quiz.quizId === quizId)) {
    throw HTTPError(400, { error: 'Quiz ID does not refer to a quiz that this user owns' });
  } else if (currentQuestion === undefined) {
    throw HTTPError(400, { error: 'Question ID does not refer to a valid question in this quiz' });
  }

  const indexQuestion = currentQuiz.questions.findIndex(
    (id) => id.questionId === questionId
  );
  currentQuiz.questions.splice(indexQuestion, 1);

  // update quiz properties after removing the question
  currentQuiz.timeLastEdited = Math.floor(Date.now() / 1000);

  currentQuiz.duration = currentQuiz.questions.reduce(
    (total, question) => total + question.duration,
    0
  );

  currentQuiz.numQuestions--;

  setData(data);
  return {};
}

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizQuestion,
  adminQuizTransfer,
  adminQuizQuestionMove,
  adminQuizQuestionDuplicate,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizTrashEmpty,
  adminQuizQuestionUpdate,
  adminQuizQuestionDelete,
};