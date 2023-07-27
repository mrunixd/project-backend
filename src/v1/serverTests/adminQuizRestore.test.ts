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

describe('////////Testing v1/admin/quiz/:quizid/restore////////', () => {
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
  });
  describe('Testing v1/admin/quiz/:quizid/restore success cases', () => {
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
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    });
    test('Testing successful restoration of 1 quiz', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizRestore(
        `${quiz1.body.quizId}`,
        `${sessionId}`
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
    });
    test('Testing successful restoration of 2 quiz', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz2.body.quizId}`, `${sessionId}`);
      const result1 = requestAdminQuizRestore(
        `${quiz1.body.quizId}`,
        `${sessionId}`
      );
      const result2 = requestAdminQuizRestore(
        `${quiz2.body.quizId}`,
        `${sessionId}`
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({});
      expect(result2.status).toStrictEqual(OK);
    });
    test('Testing successful restoration of 2 quiz', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz3.body.quizId}`, `${sessionId}`);
      requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);

      const result1 = requestAdminQuizRestore(
        `${quiz3.body.quizId}`,
        `${sessionId}`
      );
      const result2 = requestAdminQuizTrashList(`${sessionId}`);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({ quizzes: [] });
      expect(result2.status).toStrictEqual(OK);
    });
  });
  describe('Testing v1/admin/quiz/:quizid/restore error cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    });
    test('CASE (400): Quiz id does not refer to a valid quiz', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizRestore(
        `${quiz1.body.quizId + 1}`,
        `${sessionId}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id does not refer to a valid quiz that this user owns', () => {
      const result1 = requestAdminQuizRestore(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id refers to a quiz that is not currently in trash', () => {
      quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
      const result1 = requestAdminQuizRestore(
        `${quiz2.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (401): Token is not a valid structure', () => {
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, 'let!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (403): Provided token is a valid structure but not for logged in session', () => {
      const result1 = requestAdminQuizRestore(
        `${quiz1.body.quizId}`,
        `${parseInt(person1.body.token) - 1}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});
