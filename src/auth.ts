import validator from 'validator';
import { getData, setData, SessionId, ErrorObject } from './dataStore';

interface User {
  user: {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
  },
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
 * @returns {authUserId: integer}
 */
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): SessionId | ErrorObject {
  const data = getData();
  // These regexes are needed to check for valid characters in names & password
  const acceptedCharacters = /^[a-zA-Z0-9' -]+$/;
  const numbers = /\d/;
  const letters = /[a-zA-Z]/;

  // Error checking block
  for (const user of data.users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return { error: 'Email address is already in use' };
    }
  }
  if (validator.isEmail(email) === false) {
    return { error: 'Email address is not valid' };
  } else if (acceptedCharacters.test(nameFirst) === false) {
    return { error: 'First name is invalid' };
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'First name is less than 2 characters or more than 20 characters',
    };
  } else if (acceptedCharacters.test(nameLast) === false) {
    return { error: 'Last name is invalid' };
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Last name is less than 2 characters or more than 20 characters',
    };
  } else if (password.length < 8) {
    return { error: 'Password is less than 8 characters' };
  } else if (
    numbers.test(password) === false ||
    letters.test(password) === false
  ) {
    return {
      error:
        'Password does not contain at least one number and at least one letter',
    };
  }

  // All inputs are valid, thus add user info into dataStore.js
  const authUserId = data.users.length;
  const name = nameFirst.concat(' ', nameLast);
  data.users.push({
    email: email,
    password: password,
    name: name,
    authUserId: authUserId,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizIds: [],
    trash: []
  });

  // Generates a unique 5 digit number for the new sessionId
  let uniqueNumberFlag = false;
  let sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();
  while (uniqueNumberFlag === false) {
    // If the generated sessionId already exists, generate a new one
    if (data.tokens.some((token) => token.sessionId === sessionId)) {
      sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();
    } else {
      uniqueNumberFlag = true;
    }
  }

  data.tokens.push({
    sessionId: sessionId,
    authUserId: authUserId
  });
  setData(data);

  return {
    token: sessionId
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
 * @returns {authUserId: integer}
 */
function adminAuthLogin(email: string, password: string): SessionId | ErrorObject {
  const data = getData();

  // Error in finding user with matching email; returns error if email not found
  if (
    !data.users.some(
      (users) => users.email.toLowerCase() === email.toLowerCase()
    )
  ) {
    return {
      error: 'Email address does not exist',
    };
  }

  const userEmail = data.users.find(
    (users) => users.email.toLowerCase() === email.toLowerCase()
  );
  if (userEmail === undefined) {
    // Increment numFailedPasswordsSinceLastLogin if password & email incorrect
    return {
      error: 'Password is incorrect',
    };
  }
  userEmail.numFailedPasswordsSinceLastLogin++;

  // By this point, inputs must be valid
  // Find index of user to return their respective authUserId
  const user = data.users.find(
    (users) =>
      users.email.toLowerCase() === email.toLowerCase() &&
      users.password === password
  );

  if (user === undefined) {
    // Increment numFailedPasswordsSinceLastLogin if password & email incorrect
    return {
      error: 'Email Address does not exist.',
    };
  }
  // Increment numSuccesfulLogins && reset numFailedPasswordsSinceLastLogin
  user.numSuccessfulLogins++;
  user.numFailedPasswordsSinceLastLogin = 0;

  // Generates a unique 5 digit number for the new sessionId
  let uniqueNumberFlag = false;
  let sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();
  while (uniqueNumberFlag === false) {
    // If the generated sessionId already exists, generate a new one
    if (data.tokens.some((token) => token.sessionId === sessionId)) {
      sessionId = (Math.floor(Math.random() * 90000) + 10000).toString();
    } else {
      uniqueNumberFlag = true;
    }
  }

  data.tokens.push({
    sessionId: sessionId,
    authUserId: user.authUserId
  });
  setData(data);

  return {
    token: sessionId
  };
}

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 *
 * @param {integer} authUserId
 *
 * @returns { user:
 *  {
 *      userId: integer,
 *      name: string,
 *      email: string,
 *      numSuccessfulLogins: integer,
 *      numFailedPasswordsSinceLastLogin: integer
 *  }
 * }
 */
function adminUserDetails(authUserId: number): User | ErrorObject {
  const data = getData();

  // Find user with matching UserId; returns error if userId not found
  if (!data.users.some((users) => users.authUserId === authUserId)) {
    return { error: 'AuthUserId is not a valid user' };
  }

  // Save required user and return relevant information
  const user = data.users.find((users) => users.authUserId === authUserId);
  if (user === undefined) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }
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

export { adminAuthRegister, adminAuthLogin, adminUserDetails };
