/**
 * This function resets the state of the application back to the start
 * 
 * @param {}
 * 
 * @returns {}
 * 
*/
import { setData } from "./dataStore.js";

function clear() {
    const clear_data = {
        users: [],

        quizzes: []
    }
    setData(clear_data);
    return {}
}

export { clear };