import { getData, setData, ErrorObject, Message, STATE } from './dataStore';
import { SessionResultsReturn } from './quiz';
import HTTPError from 'http-errors';

interface Status {
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
 * @returns {number} playerId
 *
 */
function playerJoin(sessionId: number, name: string): {playerId: number} | ErrorObject {
  if (name === '') {
    name = createName();
  }

  const data = getData();
  const session = data.sessions.find(session => session.sessionId === sessionId);
  if (session === undefined) {
    throw HTTPError(400, { error: 'SessionId does not exist' });
  } else if (session?.sessionState !== STATE.LOBBY) {
    throw HTTPError(400, { error: 'Session has already started' });
  } else if (session.players.find(user => user.name === name)) {
    throw HTTPError(400, { error: 'Name is already in use' });
  }

  const player = { name: name, score: 0, playerId: session.players.length + 1 };
  session.players.push(player);

  session.players.sort((a, b) => a.name.localeCompare(b.name));
  setData(data);
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
function playerStatus(playerId: number): Status | ErrorObject {
  const data = getData();
  const session = data.sessions.find(session => session.players.find(player => player.playerId === playerId));
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  }
  const status = {
    state: session.sessionState,
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
function playerResults(playerId: number): SessionResultsReturn | ErrorObject {
  const data = getData();

  let player;
  let currentSession;

  for (const session of data.sessions) {
    player = session.players.find((player) => player.playerId === playerId);
    if (player) {
      currentSession = session;
      break;
    }
  }

  // Error-checking block
  if (player === undefined) {
    throw HTTPError(400, { error: 'Player ID does not refer to a valid player' });
  } else if (currentSession.sessionState !== 'FINAL_RESULTS') {
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
  const data = getData();

  if (message.length < 2 || message.length > 100) {
    throw HTTPError(400, { error: 'Message is either less than 1 character or more than 100 characters' });
  }

  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerId));

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

  setData(data);

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
  const data = getData();
  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerId));

  if (!session) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  const sessionMessages: Message[] | Message = { message: [] };

  for (const currentMessage of session.messages) {
    sessionMessages.message.push(currentMessage);
  }

  return sessionMessages;
}

export { playerJoin, playerStatus, playerResults, playerSendMessage, playerViewMessages };
