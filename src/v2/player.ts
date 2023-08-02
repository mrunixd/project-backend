import { getData, setData, ErrorObject, STATE } from './dataStore';
import { SessionResultsReturn } from './quiz';
import HTTPError from 'http-errors';

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
  // session.players.push({ name: name, playerId: session.usersRankedByScore.length });
  session.players.sort((a, b) => a.name.localeCompare(b.name));
  setData(data);
  return { playerId: session.players.length };
}

function playerStatus(playerId: number) {
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

function createName(): string {
  let letters = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let name = '';

  // create  random 5 digit alphabet
  for (let i = 0; i < 5; i++) {
    const randomLetterIndex = Math.floor(Math.random() * letters.length);
    name += letters[randomLetterIndex];
    letters = letters.slice(0, randomLetterIndex) + letters.slice(randomLetterIndex + 1);
  }

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

export { playerJoin, playerStatus, playerResults, playerSendMessage };
