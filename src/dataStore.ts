import fs from 'fs';

export interface QuizIds {
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
  quizIds: QuizIds[];
}

export interface Answer {
  answerId: number;
  answer: string;
  colour: string;
  correct: boolean;
}

export interface Question {
  questionId: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
}

export interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[];
  duration: number;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
  trash: Quiz[];
}

export interface SessionId {
  token: string;
}
export interface ErrorObject {
  error: string;
}

export interface Token {
  sessionId: string;
  authUserId: number;
}

let data: DataStore = {
  users: [],
  quizzes: [],
  tokens: [],
  trash: []
};

// function getData(): DataStore {
//   return data;
// }


// function setData(newData: DataStore) {
//   data = newData;
// }
function setData(data: DataStore) {
  fs.writeFileSync('./dbStore.json', JSON.stringify(data));
}

function getData(): DataStore {
  const dataString = fs.readFileSync('./dbStore.json');
  return JSON.parse(String(dataString));
}

export { getData, setData };
