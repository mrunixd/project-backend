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