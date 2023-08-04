import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizNameUpdate,
  requestAdminQuizList,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

describe('/////// TESTING v2/admin/quiz/name ///////', () => {
  describe('/////// Testing v2/admin/quiz/name success', () => {
    test('CASE: Successful adminQuizNameUpdate', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      const result2 = requestAdminQuizList(`${person1.body.token}`);

      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'newQuizName',
          },
        ],
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v2/admin/quiz/name error', () => {
    test('CASE: quizId does not refer to a valid quiz', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId + 1}`,
        `${person1.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quizId does not refer to a quiz that this user owns', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const person2 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name contains invalid characters', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        '%!@#!%'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is less than 3 characters long', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'ne'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is more than 30 characters long', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is already used in the current logged in user for another quiz', () => {
      const person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'existingQuiz',
        'A pre-existing quiz with the name "existingQuiz".'
      );

      const result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'existingQuiz'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
      expect(quiz2.status).toBe(OK);
    });
  });
});
