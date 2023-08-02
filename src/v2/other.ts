import { setData, getData, DataStore, getSession, setSession, SessionDataStore } from './dataStore';
import HTTPError from 'http-errors';
import fs from 'fs';
import path from 'path';

/**
 * This function resets the state of the application back to the start
 *
 * @param {}
 *
 * @returns {}
 *
 */
function clear() {
  const sessionData = getSession();

  if (sessionData.timers.length !== 0) {
    for (const timer of sessionData.timers) {
      clearTimeout(timer.timeoutId);
    }
  }
  const newSessionData: SessionDataStore = {
    sessions: [],
    timers: []
  };

  const clearData: DataStore = {
    users: [],
    quizzes: [],
    tokens: [],
    unclaimedQuestionId: 0,
    quizCounter: 0,
  };
  setData(clearData);
  setSession(newSessionData);
  const imagesDirectory = path.join(__dirname, '../../images');
  fs.readdirSync(imagesDirectory).forEach((file) => {
    const filePath = path.join(imagesDirectory, file);
    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.jpg' || fileExtension === '.png' || fileExtension === '.csv') {
      fs.unlinkSync(filePath);
    }
  });
  return {};
}

function sessionIdtoUserId(sessionId: string): number {
  const data = getData();
  const selectedToken = data.tokens.find(
    (token) => token.sessionId === sessionId
  );

  if (selectedToken === undefined) {
    return -1;
  }
  return selectedToken.authUserId;
}

function checkValidToken(token: string): boolean {
  if (token.length !== 5 || /^\d+$/.test(token) === false) {
    return false;
  }
  return true;
}

function fullTokenCheck(token: string): number {
  if (!checkValidToken(token)) {
    throw HTTPError(401, { error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    throw HTTPError(403, { error: 'Provided token is valid structure, but is not for a currently logged in session' });
  }
  return userId;
}

export { clear, sessionIdtoUserId, checkValidToken, fullTokenCheck };
