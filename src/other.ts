/**
 * This function resets the state of the application back to the start
 *
 * @param {}
 *
 * @returns {}
 *
*/
import { setData, getData, DataStore, SessionId, ErrorObject } from './dataStore';

function clear() {
  const clearData: DataStore = {
    users: [],

    quizzes: [],
    tokens: []
  };
  setData(clearData);
  return {};
}

function sessionIdtoUserId(sessionId: string): number {
  const data = getData();
  const selectedToken = data.tokens.find((token) => token.sessionId === sessionId);

  if (selectedToken === undefined) {
    return -1;
  }
  return selectedToken.authUserId;
}

export { clear, sessionIdtoUserId };
