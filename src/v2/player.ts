import { ErrorObject, Message, STATE, getSession, setSession } from './dataStore';
import { SessionResultsReturn } from './quiz';
import HTTPError from 'http-errors';

interface Status {
  state: string;
  numQuestions: number;
  atQuestion: number;
}

interface Messages {
  message: Message[]
}

/**
 * Given a session ID and a name, this allows a player to join a game.
 *
 * @param {number} playerId
 * @param {string} name
 *
 * @returns {number} playerId
 *
 */
function playerJoin(sessionId: number, name: string): {playerId: number} | ErrorObject {
  if (name === '') {
    name = createName();
  }

  const sessionData = getSession();

  const session = sessionData.sessions.find(session => session.sessionId === sessionId);
  if (session === undefined) {
    throw HTTPError(400, { error: 'SessionId does not exist' });
  } else if (session?.state !== STATE.LOBBY) {
    throw HTTPError(400, { error: 'Session has already started' });
  } else if (session.players.find(user => user.name === name)) {
    throw HTTPError(400, { error: 'Name is already in use' });
  }

  const player = { name: name, score: 0, playerId: session.players.length + 1 };
  session.players.push(player);

  session.players.sort((a, b) => a.name.localeCompare(b.name));
  setSession(sessionData);
  return { playerId: session.players.length };
}

/**
 * This function retrieves the status of a given player
 *
 * @param {number} playerId
 *
 * @returns {Status}
 *
 */
function playerStatus(playerId: number) {
  const sessionData = getSession();
  const session = sessionData.sessions.find(session => session.players.find(player => player.playerId === playerId));
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  }
  const status: Status = {
    state: session.state,
    numQuestions: session.metadata.numQuestions,
    atQuestion: session.atQuestion
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
function playerResults(
  playerId: number
): SessionResultsReturn | ErrorObject {
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

  return {
    usersRankedByScore: userRank,
    questionResults: currentSession.questionResults
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
    throw HTTPError(400, { error: 'Message is either less than 1 character or more than 100 characters' });
  }

  const session = sessionData.sessions.find(session => session.players.some(player => player.playerId === playerId));

  if (!session) {
    throw HTTPError(400, { error: 'Player ID does not exist' });
  }

  const player = session.players.find(player => player.playerId === playerId);

  session.messages.push({
    messageBody: message,
    playerId: playerId,
    name: `${player.name}`,
    timeSent: Math.floor(Date.now() / 1000)
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
  const data = getSession();
  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerId));

  if (!session) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  const sessionMessages: Messages = { message: [] };

  for (const currentMessage of session.messages) {
    sessionMessages.message.push(currentMessage);
  }

  return sessionMessages;
}

function playerQuestionInfo(playerId: number, questionPosition: number) {
  const sessiondata = getSession();
  const session = sessiondata.sessions.find((session) =>
    session.players.find((player) => player.playerId === playerId)
  );
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  } else if (
    session.state === STATE.LOBBY ||
    session.state === STATE.END
  ) {
    throw HTTPError(400, { error: 'Session has not started or has already finished' });
  } else if (questionPosition > session.metadata.numQuestions) {
    throw HTTPError(400, { error: 'Question position is not valid for this current session' });
  } else if (questionPosition !== session.atQuestion) {
    throw HTTPError(400, { error: 'Session is not currently at this question' });
  } else {
    return session.metadata.questions[questionPosition - 1];
  }
}

export { playerJoin, playerStatus, playerResults, playerSendMessage, playerViewMessages, playerQuestionInfo };
