import { getData, setData, ErrorObject, STATE, getSession, setSession } from './dataStore';
import HTTPError from 'http-errors';

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

function playerStatus(playerId: number) {
  const sessionData = getSession();
  const session = sessionData.sessions.find(session => session.players.find(player => player.playerId === playerId));
  if (session === undefined) {
    throw HTTPError(400, { error: 'Player ID does not exit' });
  }
  const status = {
    state: session.state,
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
export { playerJoin, playerStatus };
