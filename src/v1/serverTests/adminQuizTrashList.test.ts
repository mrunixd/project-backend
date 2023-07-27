import {
  requestAdminAuthRegister,
  requestAdminQuizDelete,
  requestAdminQuizCreate,
  requestAdminQuizTrashList,
  getRequest,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
} from '../helper';

let result1: any;
let person1: any;
let quiz1: any;
let quiz2: any;
let quiz3: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
});

describe('////////Testing v1/admin/quiz/trash////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'manan.j2450@gmail.com',
      'Abcd12345',
      'Manan',
      'Jaiswal'
    );
  });

  describe('Testing v1/admin/quiz/trash success cases', () => {
    beforeEach(() => {
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
    });
    test('successfully removing 1 quiz and viewing in trash', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      result1 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });
    test('successfully removing all quizzes and viewing in trash', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      requestAdminQuizDelete(`${quiz2.body.quizId}`, `${sessionId}`);
      requestAdminQuizDelete(`${quiz3.body.quizId}`, `${sessionId}`);
      result1 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
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
      expect(result1.status).toBe(OK);
    });
    test('checking successful empty trash', () => {
      const sessionId = person1.body.token;
      result1 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({
        quizzes: [],
      });
      expect(result1.status).toBe(OK);
    });
  });
  describe('Testing v1/admin/quiz/trash error cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
    });
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      result1 = getRequest(
        `/v1/admin/quiz/trash?token=${parseInt(sessionId) - 1}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = getRequest('/v1/admin/quiz/trash?token=hi!!!', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = getRequest('/v1/admin/quiz/trash?token=a1aaa', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
  });
});
