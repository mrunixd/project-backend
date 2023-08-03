import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizDelete,
  requestAdminQuizList,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result2: any;
let person1: any;
let person2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
});

describe('///////Testing /v2/admin/quiz/delete////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'manan.j2450@gmail.com',
      'Abcd12345',
      'Manan',
      'Jaiswal'
    );
  });
  describe('Testing /v2/admin/quiz/ delete success cases', () => {
    test('Successful deletion of quiz', () => {
      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizDelete(
        `${quiz1.body.quizId}`,
        `${sessionId}`
      );
      const result2 = requestAdminQuizList(`${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(result2.body).toStrictEqual({ quizzes: [] });
    });

    test('Successful deletion of quiz amongst quizzes', () => {
      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      const quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizDelete(
        `${quiz1.body.quizId}`,
        `${sessionId}`
      );
      const result2 = requestAdminQuizList(`${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz2.body.quizId,
            name: 'second quiz',
          },
        ],
      });
    });
  });
  describe('Testing /v2/admin/quiz/ delete error cases', () => {
    beforeEach(() => {
      person2 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );
      result2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
    });
    test('CASE (400): Quiz Id does not refer to a valid quiz', () => {
      const result1 = requestAdminQuizDelete(
        `${result2.body.quizId - 1}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE (400): Quiz Id does not refer to a valid quiz that a user owns', () => {
      const result1 = requestAdminQuizDelete(
        `${result2.body.quizId}`,
        `${person2.body.token}`
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
