import validator from "validator";
import { getData, setData } from "./dataStore.js";

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
function adminAuthRegister(email, password, nameFirst, nameLast) {
    let data = getData();
    //These regexes are needed to check for valid characters in names & password
    const acceptedCharacters = /^[a-zA-Z0-9' -]+$/;
    const numbers = /\d/;
    const letters = /[a-zA-Z]/;

    //Error checking block
    for (const user of data.users) {
        if (user.email === email) {
            return { error: 'Email address is already in use' };
        }
    }
    if (validator.isEmail(email) === false) {
        return { error: 'Email address is not valid' };

    } else if (acceptedCharacters.test(nameFirst) === false) {
        return { error: 'First name is invalid' };

    } else if (nameFirst.length < 2 || nameFirst.length > 20) {
        return { error: 'First name is less than 2 characters or more than 20 characters' };

    } else if (acceptedCharacters.test(nameLast) === false) {
        return { error: 'Last name is invalid' };

    } else if (nameLast.length < 2 || nameLast.length > 20) {
        return { error: 'Last name is less than 2 characters or more than 20 characters' };

    } else if (password.length < 8) {
        return { error: 'Password is less than 8 characters' };

    } else if (numbers.test(password) === false || letters.test(password) === false) {
        return { error: 'Password does not contain at least one number and at least one letter' };
    }

    //All inputs are valid, thus add user info into dataStore.js
    const authUserId = data.users.length;
    const name = nameFirst.concat(" ", nameLast);

    data.users.push({
        email: email,
        password: password,
        name: name,
        authUserId: authUserId,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
        QuizIds: [],
    });
    setData(data);

    return {
        authUserId: authUserId
    }
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
function adminAuthLogin(email, password) {
    const data = getData();
    if (!data.users.some(users => users.email === email.toLowerCase())) {
        return {
            error: 'Email address does not exist.'
        };
    };

    if (!data.users.some(users => users.email === email.toLowerCase() && users.password === password )) {
        return {
            error: 'Password is incorrect.'
        };
    }; 
    
    // Find index of user to return their respective authUserId
    const user = data.users.find(users => users.email === email.toLowerCase() && users.password === password);

    return {
        authUserId: user.authUserId
    }
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
function adminUserDetails(authUserId) {
    return {
        user:
        {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
    }
}

export { adminAuthRegister, adminAuthLogin, adminUserDetails };