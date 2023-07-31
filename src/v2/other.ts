import { setData, getData, DataStore } from './dataStore';
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
  const clearData: DataStore = {
    users: [],
    quizzes: [],
    tokens: [],
    sessions: [],
    unclaimedQuestionId: 0,
    quizCounter: 0,
  };
  setData(clearData);
  const imagesDirectory = path.join(__dirname, '../../images');
  fs.readdirSync(imagesDirectory).forEach((file) => {
    const filePath = path.join(imagesDirectory, file);
    fs.unlinkSync(filePath);
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

// Function to clear all files in the 'images' directory
// function clearImagesDirectory() {
//   const imagesDirectory = path.join(__dirname, '../../images');

//   fs.readdirSync(imagesDirectory).forEach((file) => {
//     const filePath = path.join(imagesDirectory, file);
//     fs.unlinkSync(filePath);
//   });
// }

export { clear, sessionIdtoUserId, checkValidToken, fullTokenCheck, clearImagesDirectory };
