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