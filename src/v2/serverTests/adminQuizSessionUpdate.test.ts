import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  requestAdminQuizSessionStatus,
  requestAdminQuizInfo,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
  sleepSync
} from '../helper';

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

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
let quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
let session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
let info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid} ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
    info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} success', () => {
    test('CASE: success 1 quiz 1 session, question automatically closes', () => {
      const result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      sleepSync(quizQuestion1Body.duration * 1000 + 2000);

      const result2 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result2.body).toStrictEqual({
        state: 'QUESTION_CLOSE',
        atQuestion: 1,
        players: [],
        metadata: info1.body
      });
    });

    test('CASE: change state of 2nd quiz 2nd person, full cycle', () => {
      const person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      requestAdminQuizCreate(`${person2.body.token}`, 'second quiz', 'second quiz being tested');
      const quiz3 = requestAdminQuizCreate(`${person2.body.token}`, 'third quiz', 'third quiz being tested');
      requestAdminQuizQuestion(`${quiz3.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);
      requestAdminQuizQuestion(`${quiz3.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);

      session1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz3.body.quizId}`, 10);
      info1 = requestAdminQuizInfo(`${quiz3.body.quizId}`, `${person2.body.token}`);

      requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      sleepSync(quizQuestion1Body.duration * 1000 + 2000);
      requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
      requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');

      const result1 = requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`, 'END');
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      sleepSync(quizQuestion1Body.duration * 1000 + 2000);
      const result2 = requestAdminQuizSessionStatus(`${person2.body.token}`, `${quiz3.body.quizId}`, `${session1.body.sessionId}`);
      expect(result2.body).toStrictEqual({
        state: 'END',
        atQuestion: 2,
        players: [],
        metadata: info1.body
      });
    });
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const result1 = requestAdminQuizSessionUpdate(`${parseInt(person1.body.token) - 1}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizSessionUpdate('hi!!!', `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizSessionUpdate('a1aaa', `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      const result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      const person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      const result1 = requestAdminQuizSessionUpdate(`${person2.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session ID does not refer to a valid quiz', () => {
      const newSessionId = parseInt(session1.body.sessionId) + 1;
      const result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${newSessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Action provided is not a valid Action enum', () => {
      const result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'fake');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Action enum cannot be applied in the current state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      const result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
