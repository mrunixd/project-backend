/**
 * This function resets the state of the application back to the start
 *
 * @param {}
 *
 * @returns {}
 *
*/
import { setData, DataStore } from './dataStore';

function clear() {
  const clearData: DataStore = {
    users: [],

    quizzes: []
  };
  setData(clearData);
  return {};
}

export { clear };
