import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  requestAdminQuizSessionResults,
  requestPlayerJoin,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let person1: any;
let person2: any;
let quiz1: any;
let session1: any;
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
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  session1 = undefined;
});
// afterEach(() => deleteRequest('/v1/clear', {}));

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid}/results ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
    requestPlayerJoin(session1.body.sessionId, 'Vincent Xian');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'FINISH_COUNTDOWN');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid}/results success', () => {
    test('CASE: success results 1 session 1 player 0 answers', () => {
      result1 = requestAdminQuizSessionResults(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);

      expect(result1.body).toStrictEqual({
        usersRankedByScore: [{
          name: 'Vincent Xian',
          score: 0
        }],
        questionResults: []
      });
      expect(result1.status).toStrictEqual(OK);
    });
    /// /////////////////////////////////////////////////////////
    /// /more tests for when PLAYERS is complete to check state/////
    /// /////////////////////////////////////////////////////////
  });
  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid}/results errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      result1 = requestAdminQuizSessionResults(`${parseInt(person1.body.token) - 1}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionResults('hi!!!', `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionResults('a1aaa', `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizSessionResults(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      result1 = requestAdminQuizSessionResults(`${person2.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session ID does not refer to a valid quiz', () => {
      const newSessionId = parseInt(session1.body.sessionId) + 1;
      result1 = requestAdminQuizSessionResults(`${person1.body.token}`, `${quiz1.body.quizId}`, `${newSessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session is not in FINAL_RESULTS state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'END');
      result1 = requestAdminQuizSessionResults(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
