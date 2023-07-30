import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR
} from '../helper';

let result1: any;
let person1: any;
let person2: any;
let quiz1: any;
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
  thumbnailUrl:
      'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
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
  session1 = undefined;
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid} ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} success', () => {
    test('CASE: success 1 quiz 1 session, single change', () => {
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });
    test('CASE: success 1 quiz 1 session, question automatically closes', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'FINISH_COUNTDOWN');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });
    /// /////////////////////////////////////////////////////////
    /// /more tests for when info is complete to check state/////
    /// /////////////////////////////////////////////////////////
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      result1 = requestAdminQuizSessionUpdate(`${parseInt(person1.body.token) - 1}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionUpdate('hi!!!', `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionUpdate('a1aaa', `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      result1 = requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session ID does not refer to a valid quiz', () => {
      const newSessionId = parseInt(session1.body.sessionId) + 1;
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${newSessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Action provided is not a valid Action enum', () => {
      sleepSync(2 * 1000);
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'fake');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Action enum cannot be applied in the current state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
