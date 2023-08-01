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

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  session1 = undefined;
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid} INFO///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} INFO success', () => {
    test('CASE: success 1 quiz 1 session 0 players lobby status', () => {
      const info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
      result1 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({
        state: result1.body.state,
        atQuestion: 0,
        players: [],
        metadata: info1.body
      });
      expect(result1.status).toBe(OK);
    });

    test('CASE: success 1 quiz 1 session, info correct after status update', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');

      const info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
      result1 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({
        state: 'QUESTION_COUNTDOWN',
        atQuestion: 0,
        players: [],
        metadata: info1.body
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} INFO errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      result1 = requestAdminQuizSessionStatus(`${parseInt(person1.body.token) - 1}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStatus('hi!!!', `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStatus('a1aaa', `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      result1 = requestAdminQuizSessionStatus(`${person2.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session ID does not refer to a valid quiz', () => {
      const newSessionId = parseInt(session1.body.sessionId) + 1;
      result1 = requestAdminQuizSessionStatus(`${person1.body.token}`, `${quiz1.body.quizId}`, `${newSessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
