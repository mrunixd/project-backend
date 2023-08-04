import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizList,
  deleteRequest,
  OK,
  UNAUTHORISED,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister(
  'aarnavsample@gmail.com',
  'Abcd12345',
  'aarnav',
  'sheth'
);
describe('////////TESTING v2/admin/quiz/list////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'aarnavsample@gmail.com',
      'Abcd12345',
      'aarnav',
      'sheth'
    );
  });

  describe('SUCCESS CASES', () => {
    test('Successful adminQuizList 1 quiz', () => {
      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizList(`${person1.body.token}`);

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

    test('Successful empty display', () => {
      const result1 = requestAdminQuizList(`${person1.body.token}`);
      expect(result1.body).toStrictEqual({ quizzes: [] });
      expect(result1.status).toBe(OK);
    });

    test('Successful Multiple quiz display', () => {
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
      const quiz3 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'third quiz',
        'third quiz being tested'
      );

      const result1 = requestAdminQuizList(`${person1.body.token}`);
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
  });

  describe('ERROR CASES', () => {
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      const result1 = requestAdminQuizList('let!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
  });
});
