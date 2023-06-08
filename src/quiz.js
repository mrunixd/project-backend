/**
 * This function provides a list of all the quizzes owned by the currently
 * logged in user.
 * 
 * @param {integer} authUserId 
 * 
 * @returns {
 *  quizzes: [
 *      {
 *          quizId: integer,
 *          name: string,
 *      }
 *  ]
 * }
*/
function adminQuizList(authUserId) {
    return {
        quizzes: [
            {
                quizId: 1,
                name: 'My Quiz',
            }
        ]
    }
}

/**
 * This function is given a particular quiz and then permanently removes
 * and deletes the quiz.
 * 
 * @param {integer} authUserId
 * @param {integer} quizId
 * 
 * @returns {} 
 */
function adminQuizRemove(authUserId, quizId) {
    //code to remove quiz
    return {}
}

/**
 * This function returns all the relevant information 
 * about the given quiz.
 * 
 * @param {integer} authUserId
 * @param {integer} quizId
 * 
 * @returns {
 *  quizId: integer,
 *  name: string,
 *  timeCreated: integer,
 *  timeLastEdited: integer,
 *  description: string,
 * }
*/
function adminQuizInfo(authUserId, quizId) {
   //add code
   return {
       quizId: 1,
       name: 'My Quiz',
       timeCreated: 1683125870,
       timeLastEdited: 1683125871,
       description: 'This is my quiz',
     }
}

/**
 * Function to update the name of the given quiz.
 * 
 * @param {integer} authUserId
 * @param {integer} quizId
 * @param {string} name
 * 
 * @returns {}
 */
function adminQuizNameUpdate(authUserId, quizId, name) {
    //update name 
    return {}
}

/**
 * This function updates the description of the relevant quiz.
 * 
 * @param {integer} authUserId 
 * @param {integer} quizId
 * @param {string} description
 * 
 * @returns {}
 * 
*/
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    return {}
}