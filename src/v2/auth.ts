import validator from 'validator';
import { getData, setData, ErrorObject } from './dataStore';
import HTTPError from 'http-errors';
import { hashPassword } from './other';
import { GetDetailsReturn } from './dataStore';
const MAXNAMELENGTH = 20;
const MINNAMELENGTH = 2;
const MINPASSWORD = 8;

interface TokenReturn {
  token: string;
}

/**
 * This function registers a new user into Toohak: requires an email password
 * and first & last name to create a valid user, will then generate and return
 * a new userId.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} nameFirst
 * @param {string} nameLast
 *
 * @returns {token: string}
 */
function adminAuthRegister(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): TokenReturn | ErrorObject {
  const data = getData();
  // These regexes are needed to check for valid characters in names & password
  const acceptedCharacters = /^[a-zA-Z0-9' -]+$/;
  const numbers = /\d/;
  const letters = /[a-zA-Z]/;

  // Error checking block
  for (const user of data.users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      throw HTTPError(400, { error: 'Email address is already in use' });
    }
  }
  if (!validator.isEmail(email)) {
    throw HTTPError(400, { error: 'Email address is not valid' });
  } else if (acceptedCharacters.test(nameFirst) === false) {
    throw HTTPError(400, { error: 'First name is invalid' });
  } else if (nameFirst.length < MINNAMELENGTH || nameFirst.length > MAXNAMELENGTH) {
    throw HTTPError(400, { error: 'First name is less than 2 characters or more than 20 characters' });
  } else if (acceptedCharacters.test(nameLast) === false) {
    throw HTTPError(400, { error: 'Last name is invalid' });
  } else if (nameLast.length < MINNAMELENGTH || nameLast.length > MAXNAMELENGTH) {
    throw HTTPError(400, { error: 'Last name is less than 2 characters or more than 20 characters' });
  } else if (password.length < MINPASSWORD) {
    throw HTTPError(400, { error: 'Password is less than 8 characters' });
  } else if (
    numbers.test(password) === false ||
    letters.test(password) === false
  ) {
    throw HTTPError(400, { error: 'Password does not contain at least one number and at least one letter' });
  }

  // All inputs are valid, thus add user info into dataStore.js
  const authUserId = data.users.length;
  const name = nameFirst.concat(' ', nameLast);
  data.users.push({
    email: email,
    password: hashPassword(password),
    pastPasswords: [],
    name: name,
    authUserId: authUserId,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizIds: [],
    trash: [],
  });

  // Generates a unique 5 digit number for the new sessionId
  const sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();

  data.tokens.push({
    sessionId: sessionId,
    authUserId: authUserId,
  });
  setData(data);

  return {
    token: sessionId,
  };
}

/**
 * This function authorises the input of the username and password when signing
 * into Toohak. If the email and password match the system, it will allow the
 * user to sign in.
 *
 * @param {string} email
 * @param {string} password
 *
 * @returns {token: string}
 */
function adminAuthLogin(
  email: string,
  password: string
): TokenReturn | ErrorObject {
  const data = getData();
  password = hashPassword(password);
  const selectedUser = data.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (selectedUser === undefined) {
    throw HTTPError(400, { error: 'Email address does not exist' });
  }
  if (selectedUser.password !== password) {
    selectedUser.numFailedPasswordsSinceLastLogin++;
    throw HTTPError(400, { error: 'Password is incorrect' });
  }

  // Increment numSuccesfulLogins && reset numFailedPasswordsSinceLastLogin
  selectedUser.numSuccessfulLogins++;
  selectedUser.numFailedPasswordsSinceLastLogin = 0;

  // Generates a unique 5 digit number for the new sessionId
  const sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();

  data.tokens.push({
    sessionId: sessionId,
    authUserId: selectedUser.authUserId,
  });
  setData(data);

  return {
    token: sessionId,
  };
}

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 *
 * @param {number} authUserId
 *
 * @returns { user:
 *  {
 *      userId: number,
 *      name: string,
 *      email: string,
 *      numSuccessfulLogins: number,
 *      numFailedPasswordsSinceLastLogin: number
 *  }
 * }
 */
function adminUserDetails(authUserId: number): GetDetailsReturn {
  const data = getData();
  // Save required user and return relevant information
  const user = data.users.find((users) => users.authUserId === authUserId);
  return {
    user: {
      userId: user.authUserId,
      name: user.name,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    },
  };
}

/**
 * This function intakes a token and logs out the corresponding user, then
 * resets their sessionId to undefined.
 *
 * @param {number} token
 *
 * @returns {}
 */
function adminAuthLogout(authUserId: number): Record<string, never> | ErrorObject {
  const data = getData();

  // If the sessionId does not exist, the function sessionIdtoUserId returns -1.
  if (authUserId === -1) {
    throw HTTPError(400, { error: 'This token is for a user who has already logged out.' });
  }

  // Finds the relevant token.
  const userToken = data.tokens.find(
    (token) => token.authUserId === authUserId
  );

  // Resets the sessionId to undefined, where calling adminAuthLogin will generate
  // another randomised sessionId.
  userToken.sessionId = undefined;
  setData(data);

  return {};
}

/** This function updates the non-password details of an existing user.
 *
 * @param {number} userId
 * @param {string} email
 * @param {string} nameFirst
 * @param {string} nameLast
 *
 * @returns {}
 */

function adminAuthUpdateDetails(userId: number, email: string, nameFirst: string, nameLast: string): Record<string, never> | ErrorObject {
  const data = getData();

  // This regex is used to test the validity of the first and last name.
  const acceptedCharacters = /^[a-zA-Z' -]+$/;

  // Checks if the selected user's email is the same as the email to be changed to.
  const selected = data.users.find((users) => users.authUserId === userId);
  if (selected.email !== email) {
    if (data.users.find((user) => user.email === email)) {
      throw HTTPError(400, { error: 'Email is currently used by another user (excluding the current authorised user)' });
    }
  }

  if (validator.isEmail(email) === false) {
    throw HTTPError(400, { error: 'Email address is not valid' });
  } else if (acceptedCharacters.test(nameFirst) === false) {
    throw HTTPError(400, { error: 'First name is invalid' });
  } else if (nameFirst.length < MINNAMELENGTH || nameFirst.length > MAXNAMELENGTH) {
    throw HTTPError(400, { error: 'First name is less than 2 characters or more than 20 characters' });
  } else if (acceptedCharacters.test(nameLast) === false) {
    throw HTTPError(400, { error: 'Last name is invalid' });
  } else if (nameLast.length < MINNAMELENGTH || nameLast.length > MAXNAMELENGTH) {
    throw HTTPError(400, { error: 'Last name is less than 2 characters or more than 20 characters' });
  }

  selected.email = email;
  selected.name = nameFirst.concat(' ', nameLast);

  setData(data);
  return {};
}

/** Given a userId, the correct password, and a new password, this function updates the password of that
 * specific user.
 *
 * @param {number} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 *
 * @returns {}
 */
function adminAuthUpdatePassword(userId: number, oldPassword: string, newPassword: string): Record<string, never> | ErrorObject {
  const data = getData();
  const user = data.users.find(user => user.authUserId === userId);
  if (user.password !== hashPassword(oldPassword)) {
    throw HTTPError(400, { error: 'Incorrect old password' });
  }

  if (newPassword === oldPassword) {
    throw HTTPError(400, { error: 'New password must not be the correct old password' });
  }

  for (const password of user.pastPasswords) {
    if (hashPassword(newPassword) === password) {
      throw HTTPError(400, { error: 'New password has already been used before by this user' });
    }
  }

  if (newPassword.length < MINPASSWORD) {
    throw HTTPError(400, { error: 'New password is less than 8 characters' });
  }

  if (/\d/.test(newPassword) === false || /[a-zA-Z]/.test(newPassword) === false) {
    throw HTTPError(400, { error: 'New password does not contain at least one number and at least one letter' });
  }
  user.pastPasswords.push(hashPassword(oldPassword));

  user.password = hashPassword(newPassword);
  setData(data);
  return {};
}

export { adminAuthRegister, adminAuthLogin, adminAuthLogout, adminUserDetails, adminAuthUpdateDetails, adminAuthUpdatePassword };
