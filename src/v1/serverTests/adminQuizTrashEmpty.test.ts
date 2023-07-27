import {
  requestAdminAuthRegister,
  requestAdminQuizDelete,
  requestAdminQuizCreate,
  requestAdminQuizTrashList,
  requestAdminQuizRestore,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let person1: any;
let person2: any;
let quiz1: any;
let quiz2: any;
let quiz3: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
});

describe('////////Testing /v1/admin/quiz/trash/empty', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'manan.j2450@gmail.com',
      'Abcd12345',
      'Manan',
      'Jaiswal'
    );
    person2 = requestAdminAuthRegister(
      'test@gmail.com',
      'Abcd12345',
      'Fake',
      'Name'
    );
    quiz1 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'first quiz',
      'first quiz being tested'
    );
    quiz2 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'second quiz',
      'second quiz being tested'
    );
    quiz3 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'third quiz',
      'second quiz being tested'
    );
    requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    requestAdminQuizDelete(`${quiz2.body.quizId}`, `${person1.body.token}`);
    requestAdminQuizDelete(`${quiz3.body.quizId}`, `${person1.body.token}`);
  });
  describe('Testing /v1/admin/quiz/trash/empty success cases', () => {
    test('testing successful deletion of 1 quiz in trash', () => {
      const sessionId = person1.body.token;
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${sessionId}&quizIds=[${quiz1.body.quizId}]`,
        {}
      );
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz2.body.quizId,
            name: 'second quiz',
          },
          {
            quizId: quiz3.body.quizId,
            name: 'third quiz',
          },
        ],
      });
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
    });
    test('testing successful deletion of 2 quiz in trash', () => {
      const sessionId = person1.body.token;
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${sessionId}&quizIds=[${quiz1.body.quizId},${quiz2.body.quizId}]`,
        {}
      );
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz3.body.quizId,
            name: 'third quiz',
          },
        ],
      });
    });
  });
  describe('Testing /v1/admin/quiz/trash/empty error cases', () => {
    test('CASE (400): One or more of the QuizIDs is not a valid quiz', () => {
      const sessionId = person1.body.token;
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${sessionId}&quizIds=[${
          quiz1.body.quizId - 15
        },${quiz2.body.quizId}]`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): One or more of the QuizIDs refers to a quiz that this current user does not own', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${person2.body.token}&quizIds=[${quiz1.body.quizId},${quiz2.body.quizId}]`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): One or more of the QuizIDs is not currently in trash', () => {
      const sessionId = person1.body.token;

      requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${person2.body.token}&quizIds=[${quiz1.body.quizId}]`,
        {}
      );
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: 1,
            name: 'second quiz',
          },
          {
            quizId: 2,
            name: 'third quiz',
          },
        ],
      });
    });
    test('CASE (401): Token is not a valid structure', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=111a1&quizIds=[${quiz1.body.quizId},${quiz2.body.quizId}]`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (403): Provided token is a valid structure, but is not for a currently logged in session', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/trash/empty?token=${
          parseInt(person1.body.token) - 1
        }&quizIds=[${quiz1.body.quizId},${quiz2.body.quizId}]`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});
