import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  requestAdminQuizSessionStatus,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
  requestAdminQuizInfo
} from '../helper';

let result1: any;
let person1: any;
let person2: any;
let quiz1: any;
let quizQuestion1: any;
let session1: any;
const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 4,
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

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ
  }
}

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quizQuestion1 = undefined;
  session1 = undefined;
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid} INFO///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} INFO success', () => {
    test('CASE: success 1 quiz 1 session 0 players lobby status', () => {
      const info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
      result1 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({
        state: result1.body.state, //CHANGE LATER
        atQuestion: 0,
        players: [],
        metadata: info1.body
          // quizId: quiz1.body.quizId,
          // name: 'first quiz',
          // timeCreated: expect.any(Number),
          // timeLastEdited: expect.any(Number),
          // description: 'first quiz being tested',
          // numQuestions: 1,
          // questions: [
          //   {
          //     questionId: quizQuestion1.body.questionId,
          //     question: 'Who is the Monarch of England?',
          //     duration: 4,
          //     points: 5,
          //     answers: [
          //       {
          //         answer: 'Prince Charles',
          //         answerId: expect.any(Number),
          //         colour: expect.any(String),
          //         correct: false,
          //       },
          //       {
          //         answer: 'King Charles',
          //         answerId: expect.any(Number),
          //         colour: expect.any(String),
          //         correct: true,
          //       },
          //     ],
          //     thumbnailUrl: quizQuestion1Body.thumbnailUrl,
          //   }
          // ],
          // duration: 4,
          // thumbnailUrl: '',
      });
      expect(result1.status).toBe(OK);
    });
  });
});