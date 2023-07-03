
export interface QuizId {
  quizId: number;
  name: string;
}
export interface User {
  email: string;
  password: string;
  name: string;
  authUserId: number;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  quizIds:  QuizId[];
} 

export interface Quiz {
  quizId: number;
  name: string;
  timeCreate: number;
  timeLastEdited: number;
  description: string;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
}

let data: DataStore = {
  users: [],
  quizzes: []
}

function getData(): DataStore {
  return data;
}

function setData(newData: DataStore) {
  data = newData;
}

export { getData, setData };
