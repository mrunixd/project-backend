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
    let data = getData();
    const user = data.users.find(user => user.authUserId === authUserId);
    if (!user) {
        return { error: 'AuthUserId is not a valid user' };
    }

    if (user.quizIds) {
        return { quizzes: user.quizIds.map(quiz => quiz) }
    }

    else {
    return {
        quizzes: []
    }}
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
        return { error: 'AuthUserId is not a valid user' };

    } else if (!acceptedCharacters.test(name)) {
        return { error: 'Name contains invalid characters' };

    } else if (name.length > 30 || name.length < 3) {
        return { error: 'Name is less than 3 or more than 30 characters' };
    
    //checks if the quizIds array exists as an array and that it has the 'name' of the quiz present
    } else if(user.quizIds && Array.isArray(user.quizIds) && user.quizIds.some(quiz => quiz.name === name)) {
        return { error: 'Name is already used for another quiz' };

    } else if ( 100 < description.length ) {
        return { error: 'Description is more than 100 characters' };
    }

    const quizId = data.quizzes.length;
    const currentTime = new Date();

    //adds this quiz to the quizIds array in this user's object
    user.quizIds.push({
        quizId: quizId,
        name: name,
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
    let data = getData();
    const user = data.users.find(user => user.authUserId === authUserId);

    if (!data.users.some(user => user.authUserId === authUserId)) {
        return { error: 'AuthUserId is not a valid user' };
    }
    else if (!data.quizzes.some(quizzes => quizzes.quizId === quizId)){
        return { error: 'Quiz ID does not refer to a valid quiz'};
    }
    else if (!user.quizIds.some((id) => id.quizId === quizId)) {
        return { error: 'Quiz ID does not refer to a valid quiz that this user owns'};
    } else {
        const index = user.quizIds.find((id) => id.quizId === quizId);
        user.quizIds.splice(index, 1);
        
        const index_quiz = data.quizzes.find((id) => id.quizId === quizId);
        data.quizzes.splice(index_quiz,1);
        return {};
    }
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
    let data = getData();
    const user = data.users.find(user => user.authUserId === authUserId);

    if (!data.users.some(user => user.authUserId === authUserId)) {
        return { error: 'AuthUserId is not a valid user' };

    } else if (!(data.quizzes.some(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a valid quiz' };

    } else if (!(user.quizIds.some(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a quiz that this user owns' };
    }

    const selected = data.quizzes.find(quiz => quiz.quizId === quizId);

    return {
        quizId: selected.quizId,
        name: selected.name,
        timeCreated: selected.timeCreated,
        timeLastEdited: selected.timeLastEdited,
        description: selected.description,
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
    let data = getData();
    const user = data.users.find(user => user.authUserId === authUserId);

    const acceptedCharacters = /^[a-zA-Z0-9 ]+$/;

    if (!user) {
        return { error: 'AuthUserId is not a valid user' };

    } else if (!acceptedCharacters.test(name)) {
        return { error: 'Name contains any characters that are not alphanumeric or are spaces' };

    } else if (name.length < 3 || name.length > 30) {
        return { error: 'Name is either less than 3 characters long or more than 30 characters long' };

    } else if (!(data.quizzes.find(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a valid quiz' };

    } else if (!(user.quizIds.find(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a quiz that this user owns' };

    } else if ((user.quizIds.find(quiz => quiz.name === name))) {
        return { error: 'Name is already used by the current logged in user for another quiz' };
    }

    const selected = data.quizzes.find(quiz => quiz.quizId === quizId);
    selected.name = name;

    setData(data);

    return {};
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
    let data = getData();
    const user = data.users.find(user => user.authUserId === authUserId);
    if (!data.users.some(user => user.authUserId === authUserId)) {
        return {error: 'AuthUserId is not a valid user'};

    } else if (!(data.quizzes.some(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a valid quiz' };

    } else if (!(user.quizIds.some(quiz => quiz.quizId === quizId))) {
        return { error: 'Quiz Id does not refer to a quiz that this user owns' };

    } else if (description.length > 100) {
        return { error: 'Description is more than 100 characters in length' };
    }

    const selected = data.quizzes.find(quiz => quiz.quizId === quizId);
    selected.description = description;

    setData(data);

    return {};
}


export { adminQuizCreate, adminQuizList, adminQuizInfo, 
    adminQuizDescriptionUpdate, adminQuizNameUpdate, adminQuizRemove };