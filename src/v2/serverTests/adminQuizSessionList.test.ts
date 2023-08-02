import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  deleteRequest,
  OK,
  requestAdminQuizSessionList
} from '../helper';

let result1: any;
let person1: any;
let quiz1: any;
let session1: any;
let session2: any;
const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 0.1,
  points: 5,
  answers: [
    {
      answer: 'Prince Charles',
      correct: false,
    },
    {
      answer: 'King Charles',
      correct: true,
    },
  ],
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};

deleteRequest('/v1/clear', {});
result1 = undefined;
person1 = undefined;
quiz1 = undefined;
session1 = undefined;
session2 = undefined;

test('CASE: success results 1 session 1 player 0 answers', () => {
  person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
  quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
  requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 1);
  requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'END');

  session2 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 1);

  result1 = requestAdminQuizSessionList(`${person1.body.token}`, `${quiz1.body.quizId}`);

  expect(result1.body).toStrictEqual({
    activeSessions: [
      session2.body.sessionId
    ],
    inactiveSessions: [
      session1.body.sessionId
    ]
  });
  expect(result1.status).toStrictEqual(OK);
});
