import { getData, setData } from "./dataStore.js";
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
 * This function creates a quiz given a basic description for the logged in
 * user, thus creating a new quix for an individual.
 * 
 * @param {number} authUserId 
 * @param {string} name
 * @param {string} description 
 * 
 * @returns {{quizId: number}}
 */

function adminQuizCreate(authUserId, name, description) {
    let data = getData();

    const user = data.users.find(user => user.authUserId === authUserId);
    const acceptedCharacters = /^[a-zA-Z0-9 ]+$/;
    
    //checks if all inputs are valid
    if (!user) {
        return { error: 'User is invalid' };

    } else if (!acceptedCharacters.test(name)) {
        return { error: 'Name contains invalid characters' };

    } else if (name.length > 30 || name.length < 3) {
        return { error: 'Name is less than 3 or more than 30 characters' };
    
    //checks if the quizIds array exists as an array and that it has the 'name' of the quiz present
    } else if(user.QuizIds && Array.isArray(user.QuizIds) && user.QuizIds.some(quiz => quiz.quizName === name)) {
        return { error: 'Name is already used for another quiz' };

    } else if ( 100 < description.length ) {
        return { error: 'Description is more than 100 characters' };
    }

    const quizId = data.quizzes.length;
    const currentTime = new Date();

    //adds this quiz to the quizIds array in this user's object
    user.QuizIds.push({
        quizId: quizId,
        quizName: name,
    });
    
    data.quizzes.push({
        quizId: quizId,
        name: name,
        timeCreated: currentTime,
        timeLastEdited: currentTime,
        description: description,
    });

    setData(data);
    
    return {
        quizId: quizId
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

export { adminQuizCreate, adminQuizList, adminQuizInfo, 
    adminQuizDescriptionUpdate, adminQuizNameUpdate, adminQuizRemove };