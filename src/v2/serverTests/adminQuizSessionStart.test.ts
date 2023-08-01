import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizQuestionDelete,
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
let quiz2: any;
let quiz3: any;
let quizQuestion1: any;
const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 1,
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
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
  quizQuestion1 = undefined;
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/start ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/start success', () => {
    test('CASE: Successful sessionStart with 1 quiz 1 user with autoStartNum 3', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });

    test('CASE: Successful 3rd quiz owned by 2nd user with autoStartNum 10', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      quiz2 = requestAdminQuizCreate(`${person2.body.token}`, 'second quiz', 'second quiz being tested');
      requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);
      quiz3 = requestAdminQuizCreate(`${person2.body.token}`, 'third quiz', 'third quiz being tested');
      requestAdminQuizQuestion(`${quiz3.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);

      result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz3.body.quizId}`, 50);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });
  });
  describe('/////// Testing v1/admin/quiz/{quizid}/session/start errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      result1 = requestAdminQuizSessionStart(`${parseInt(sessionId) - 1}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStart('hi!!!', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStart('a1aaa', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): autoStartNum is a number greater than 50', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 51);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    /// /////////////////////////////////////////////////////////
    /// /more than 10 sessions not in END state currently exist//
    /// /////////////////////////////////////////////////////////
    test('CASE (400): The quiz does not have any questions in it', () => {
      requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
