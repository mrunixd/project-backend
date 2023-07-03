/**
 * This function resets the state of the application back to the start
 *
 * @param {}
 *
 * @returns {}
 *
*/
import { setData } from './dataStore.ts';

function clear() {
  const clearData = {
    users: [],

    quizzes: []
  };
  setData(clearData);
  return {};
}

export { clear };
