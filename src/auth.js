/**
 * This function authorises the input of the username and password when signing
 * into Toohak. If the email and password match the system, it will allow the 
 * user to sign in. 
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {{authUserId: number}}
 */
function adminAuthLogin(email, password) {
    return {
        authUserId: 1
    }
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
 * @returns {{authUserId: number}}
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1
    }
}