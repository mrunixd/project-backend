import {
  requestAdminAuthRegister,
  requestAdminQuizDelete,
  requestAdminQuizCreate,
  requestAdminQuizTrashList,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister(
  'manan.j2450@gmail.com',
  'Abcd12345',
  'Manan',
  'Jaiswal'
);
let quiz1 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'first quiz',
  'first quiz being tested'
);
let quiz2 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'second quiz',
  'second quiz being tested'
);
let quiz3 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'third quiz',
  'second quiz being tested'
);

describe('////////Testing v2/admin/quiz/trash////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'manan.j2450@gmail.com',
      'Abcd12345',
      'Manan',
      'Jaiswal'
    );
  });

  describe('Testing v2/admin/quiz/trash success cases', () => {
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
      const result1 = requestAdminQuizTrashList(`${sessionId}`);
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
      const result1 = requestAdminQuizTrashList(`${sessionId}`);
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
      const result1 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({
        quizzes: [],
      });
      expect(result1.status).toBe(OK);
    });
  });
  describe('Testing v2/admin/quiz/trash error cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
    });
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizTrashList(`${parseInt(sessionId) - 1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizTrashList('hi!!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      const result1 = requestAdminQuizTrashList('a1aaa');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
  });
});
