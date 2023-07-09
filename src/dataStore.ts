
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
  questions: Answer[];
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
}

export interface SessionId {
  token: number;
}
export interface ErrorObject {
  error: string;
}

export interface Token {
  sessionId: number;
  authUserId: number;
}

let data: DataStore = {
  users: [],
  quizzes: [],
  tokens: []
};

function getData(): DataStore {
  return data;
}

function setData(newData: DataStore) {
  data = newData;
}

export { getData, setData };
