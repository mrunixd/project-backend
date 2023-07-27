/**
 * This function resets the state of the application back to the start
 *
 * @param {}
 *
 * @returns {}
 *
 */
import { setData, getData, DataStore } from './dataStore';

function clear() {
  const clearData: DataStore = {
    users: [],
    quizzes: [],
    tokens: [],
    unclaimedQuestionId: 0,
    quizCounter: 0,
  };
  setData(clearData);
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

export { clear, sessionIdtoUserId, checkValidToken };
