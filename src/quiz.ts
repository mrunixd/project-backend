import { getData, setData, QuizIds, Quiz } from './dataStore';

interface ErrorObject {
  error: string;
}

interface QuizId {
  quizId: number;
}

interface EmptyQuizList {
  quizzes: []
}

interface QuizList {
  quizzes: QuizIds[]
}

// interface QuizInfo {
//   quizId: number;
//   name: string;
//   timeCreated: number;
//   timeLastEdited: number;
//   description: string;
// }

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
function adminQuizList(authUserId: number): EmptyQuizList | QuizList | ErrorObject {
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
function adminQuizCreate(authUserId: number, name: string, description: string): QuizId | ErrorObject {
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
function adminQuizRemove(authUserId: number, quizId: number): Record<string, never> | ErrorObject {
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
    user.quizIds.splice(index, 1);

    const indexQuiz = data.quizzes.findIndex((id) => id.quizId === quizId);
    data.quizzes.splice(indexQuiz, 1);
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
function adminQuizNameUpdate(authUserId: number, quizId: number, name: string): Record<string, never> | ErrorObject {
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
function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string): Record<string, never> | ErrorObject {
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

export {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizNameUpdate,
  adminQuizRemove,
};
