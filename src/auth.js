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
 * @returns {{authUserId: integer}}
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1
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
 * @returns {{authUserId: integer}}
 */
function adminAuthLogin(email, password) {
    return {
        authUserId: 1
    }
}

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 * 
 * @param {integer} authUserId 
 * 
 * @returns {{ user:
 *  { 
 *      userId: integer,
 *      email: string,
 *      numSuccessfulLogins: integer,
 *      numFailedPasswordsSinceLastLogin: integer
 *  }
 * }}
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