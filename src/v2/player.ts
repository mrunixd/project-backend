import { ErrorObject, STATE, getSession, setSession, Message, Question } from './dataStore';
import { SessionResultsReturn, createTimeout } from './quiz';
import HTTPError from 'http-errors';

export interface Status {
  state: string;
  numQuestions: number;
  atQuestion: number;
}

/**
 * Given a session ID and a name, this allows a player to join a game.
 *
 * @param {number} playerId
 * @param {string} name
 *
 * @returns {{playerId: number}}
 *
 */
function playerJoin(sessionId: number, name: string): {playerId: number} | ErrorObject {
  if (name === '') {
    name = createName();
  }

  const sessionData = getSession();

  const session = sessionData.sessions.find((session) => session.sessionId === sessionId);
  if (session === undefined) {
    throw HTTPError(400, { error: 'SessionId does not exist' });
  } else if (session?.state !== STATE.LOBBY) {
    throw HTTPError(400, { error: 'Session has already started' });
  } else if (session.players.find((user) => user.name === name)) {
    throw HTTPError(400, { error: 'Name is already in use' });
  }

  // Generates a unique 5 digit number for the new sessionId
  let uniqueNumberFlag = false;
  let uniqueId = (Math.floor(Math.random() * 90000) + 10000);
  while (uniqueNumberFlag === false) {
    // If the generated uniqueId already exists, generate a new one
    if (session.players.find(player => player.playerId === uniqueId)) {
      uniqueId = (Math.floor(Math.random() * 90000) + 10000);
    } else {
      uniqueNumberFlag = true;
    }
  }

  const player = { name: name, score: 0, playerId: uniqueId };
  session.players.push(player);

  session.players.sort((a, b) => a.name.localeCompare(b.name));
  setSession(sessionData);
  if (session.players.length === session.autoStartNum) {
    session.state = 'QUESTION_COUNTDOWN';
    session.atQuestion++;
    setSession(sessionData);
    createTimeout(sessionId);
  }
  return { playerId: uniqueId };
}

/**
 * This function retrieves the status of a given player
 *
 * @param {number} playerId
 *
 * @returns {Status}
 *
 */
function playerStatus(playerId: number): Status {
  const sessionData = getSession();
  const session = sessionData.sessions.find((session) =>
    session.players.find((player) => player.playerId === playerId)
  );
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  }
  const status: Status = {
    state: session.state,
    numQuestions: session.metadata.numQuestions,
    atQuestion: session.atQuestion,
  };
  return status;
}

/**
 * Generates a random name.
 *
 * @returns {string}
 *
 */
function createName(): string {
  let letters = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let name = '';

  // Randomises a string of five different alphabet characters.
  for (let i = 0; i < 5; i++) {
    const randomLetterIndex = Math.floor(Math.random() * letters.length);
    name += letters[randomLetterIndex];
    letters = letters.slice(0, randomLetterIndex) + letters.slice(randomLetterIndex + 1);
  }

  // Randomises a string of three different numeric characters.
  for (let i = 0; i < 3; i++) {
    const randomNumberIndex = Math.floor(Math.random() * numbers.length);
    name += numbers[randomNumberIndex];
    numbers = numbers.slice(0, randomNumberIndex) + numbers.slice(randomNumberIndex + 1);
  }

  return name;
}

/**
 * This function retrieves the final results for a session
 *
 * @param {number} playerId
 *
 * @returns {SessionResultsReturn}
 *
 */
function playerResults(playerId: number): SessionResultsReturn | ErrorObject {
  const sessionData = getSession();
  let player;
  let currentSession;

  for (const session of sessionData.sessions) {
    player = session.players.find((player) => player.playerId === playerId);
    if (player) {
      currentSession = session;
      break;
    }
  }

  // Error-checking block
  if (player === undefined) {
    throw HTTPError(400, { error: 'Player ID does not refer to a valid player' });
  } else if (currentSession.state !== 'FINAL_RESULTS') {
    throw HTTPError(400, { error: 'Session is not in FINAL_RESULTS state' });
  }

  const userRank = currentSession.players.map((player) => {
    const { name, score } = player;
    return { name, score };
  });
  userRank.sort((a, b) => b.score - a.score);

  const questionResults = currentSession.questionResults.map((result) => {
    const { questionId, questionCorrectBreakdown, averageAnswerTime, percentCorrect } = result;
    return { questionId, questionCorrectBreakdown, averageAnswerTime, percentCorrect };
  });
  return {
    usersRankedByScore: userRank,
    questionResults: questionResults,
  };
}

/**
 * Given a playerId, allows a player to send a message to the session chatroom.
 *
 * @param {number} playerId
 * @param {string} message
 *
 * @returns {}
 *
 */
function playerSendMessage(playerId: number, message: string): Record<string, never> | ErrorObject {
  const sessionData = getSession();

  if (message.length < 2 || message.length > 100) {
    throw HTTPError(400, {
      error: 'Message is either less than 1 character or more than 100 characters',
    });
  }

  const session = sessionData.sessions.find((session) =>
    session.players.some((player) => player.playerId === playerId)
  );

  if (!session) {
    throw HTTPError(400, { error: 'Player ID does not exist' });
  }

  const player = session.players.find((player) => player.playerId === playerId);

  session.messages.push({
    messageBody: message,
    playerId: playerId,
    name: `${player.name}`,
    timeSent: Math.floor(Date.now() / 1000),
  });

  setSession(sessionData);
  return {};
}

/**
 * Given a playerId, allows a player to view the session's chatroom.
 *
 * @param {number} playerId
 *
 * @returns {Message[]}
 *
 */
function playerViewMessages(playerId: number): Message[] | ErrorObject {
  const sessionData = getSession();
  const session = sessionData.sessions.find(session => session.players.some(player => player.playerId === playerId));

  if (!session) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  const sessionMessages: Messages = { message: [] };

  for (const currentMessage of session.messages) {
    sessionMessages.message.push(currentMessage);
  }

  return sessionMessages;
}

/**
 * This function provides information about the selected player
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} imgUrl
 *
 * @returns {
 * "questionId": number,
 * "question": string,
 * "duration": number,
 * "thumbnailUrl": string,
 * "points": 5,
 * "answers": [
 *    {
 *      "answerId": number,
 *      "answer": "Prince Charles",
 *      "colour": "red"
 *    }
 *  ]
 * }
 *
 */
function playerQuestionInfo(playerId: number, questionPosition: number) {
  const sessionData = getSession();
  const session = sessionData.sessions.find((session) =>
    session.players.find((player) => player.playerId === playerId)
  );
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  } else if (session.state === STATE.LOBBY || session.state === STATE.END) {
    throw HTTPError(400, { error: 'Session has not started or has already finished' });
  } else if (questionPosition > session.metadata.numQuestions) {
    throw HTTPError(400, { error: 'Question position is not valid for this current session' });
  } else if (questionPosition !== session.atQuestion) {
    throw HTTPError(400, { error: 'Session is not currently at this question' });
  } else {
    return session.metadata.questions[questionPosition - 1];
  }
}

/**
 * function that handles player answering quiz questions
 *
 * @param {number} playerId
 * @param {number} questionPosition
 * @param {number[]} answerIds
 *
 * @returns {}
 *
 */
function playerQuestionAnswer(playerId: number, questionPosition: number, answerIds: number[]) {
  const sessionData = getSession();
  const session = sessionData.sessions.find((session) => session.players.find((player) => player.playerId === playerId));
  if (session === undefined) {
    throw HTTPError(400, { error: 'PlayerId does not exist' });
  } else if (session.state !== 'QUESTION_OPEN') {
    throw HTTPError(400, { error: 'Session status is not question open' });
  } else if (questionPosition > session.metadata.numQuestions) {
    throw HTTPError(400, { error: 'Question position is not valid for this current session' });
  } else if (questionPosition !== session.atQuestion) {
    throw HTTPError(400, { error: 'Session is not currently at this question' });
  } else if (answerIds.length < 1) {
    throw HTTPError(400, { error: 'Less than 1 answer ID was submitted' });
  } else if (hasDuplicates(answerIds)) {
    throw HTTPError(400, { error: 'There are duplicate answer IDs submitted' });
  }

  // For every answer they submitted: if submitted ID doesn't match any question answer, return error
  const question = session.metadata.questions[questionPosition - 1];
  for (const id of answerIds) {
    if (!question.answers.find((answer) => answer.answerId === id)) {
      throw HTTPError(400, { error: 'answerIds are not valid for this particular question' });
    }
  }
  const correctAnswers = question.answers.filter((answer) => answer.correct === true);
  const correctAnswerIds = (correctAnswers.map((answer) => answer.answerId));
  const answersGiven = answerIds.sort();
  const questionResult = session.questionResults[questionPosition - 1];

  // set numPlayerAnswers
  questionResult.numPlayerAnswers++;

  // set average time taken
  const timeTaken = Math.floor(Date.now() / 1000) - session.currentQuestionOpenTime;
  questionResult.averageAnswerTime = (questionResult.averageAnswerTime * (questionResult.numPlayerAnswers - 1) + timeTaken) / questionResult.numPlayerAnswers;

  // If player got all of the answers correct, increase score & numPlayersCorrect
  const player = session.players.find((player) => player.playerId === playerId);
  let allAnswersCorrect = true;
  for (const id of answerIds) {
    if (!correctAnswerIds.find((correctId) => correctId === id)) {
      allAnswersCorrect = false;
    }
  }

  if (allAnswersCorrect) {
    const scalingFactor = 1 / questionResult.numPlayerAnswers;
    player.score = player.score + session.metadata.questions[questionPosition - 1].points * scalingFactor;
    questionResult.numPlayersCorrect++;
  }

  // For every correctAnswer, check if any of the submitted answers match -> add player to playerCorrect
  for (const correctAnswer of questionResult.questionCorrectBreakdown) {
    if (answersGiven.find((givenAnswer) => givenAnswer === correctAnswer.answerId)) {
      correctAnswer.playersCorrect.push(player.name);
    }
  }

  // calculate percent correct
  questionResult.percentCorrect = Math.round((questionResult.numPlayersCorrect / questionResult.numPlayerAnswers) * 100);
  setSession(sessionData);
  return {};
}

/** function checks a given array of numbers for duplicates
 *
 * @params {number[]} array
 *
 * @returns {SetConstructor}
 *
 */
function hasDuplicates(arr: number[]) {
  return new Set(arr).size !== arr.length;
}
export {
  playerJoin,
  playerStatus,
  playerResults,
  playerSendMessage,
  playerQuestionInfo,
  playerQuestionAnswer,
  playerViewMessages
};
