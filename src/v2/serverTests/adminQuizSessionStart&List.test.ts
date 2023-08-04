import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizQuestionDelete,
  requestAdminQuizSessionList,
  requestAdminQuizSessionUpdate,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR
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
  thumbnailUrl:
    'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
let quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
let quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);

describe('/////// TESTING v1/admin/quiz/{quizid}/session/start ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/start success', () => {
    test('CASE: Successful sessionStart with 1 quiz 1 user with autoStartNum 3', () => {
      const result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });

    test('CASE: Successful 3rd quiz owned by 2nd user with autoStartNum 10', () => {
      const person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      const quiz2 = requestAdminQuizCreate(`${person2.body.token}`, 'second quiz', 'second quiz being tested');
      requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);
      const quiz3 = requestAdminQuizCreate(`${person2.body.token}`, 'third quiz', 'third quiz being tested');
      requestAdminQuizQuestion(`${quiz3.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);

      const result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz3.body.quizId}`, 50);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });
  });
  describe('/////// Testing v1/admin/quiz/{quizid}/session/start errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizSessionStart(`${parseInt(sessionId) - 1}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizSessionStart('hi!!!', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizSessionStart('a1aaa', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      const result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      const person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      const result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): autoStartNum is a number greater than 50', () => {
      const result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 51);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): The quiz does not have any questions in it', () => {
      requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      const result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });

  test('CASE: ADMINQUIZSESSIONLIST SUCCESS CASE', () => {
    const session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 1);
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'END');

    const session2 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 1);

    const result2 = requestAdminQuizSessionList(`${person1.body.token}`, `${quiz1.body.quizId}`);

    expect(result2.body).toStrictEqual({
      activeSessions: [
        session2.body.sessionId
      ],
      inactiveSessions: [
        session1.body.sessionId
      ]
    });
    expect(result2.status).toStrictEqual(OK);
  });
});
