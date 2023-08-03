import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizNameUpdate,
  requestAdminQuizList,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let person1: any;
let person2: any;
let quiz1: any;
let quiz2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
});

describe('/////// TESTING v2/admin/quiz/name ///////', () => {
  describe('/////// Testing v2/admin/quiz/name success', () => {
    test('CASE: Successful adminQuizNameUpdate', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizList(`${person1.body.token}`);

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
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId + 1}`,
        `${person1.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quizId does not refer to a quiz that this user owns', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      person2 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`,
        'newQuizName'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name contains invalid characters', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        '%!@#!%'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is less than 3 characters long', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'ne'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is more than 30 characters long', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      result1 = requestAdminQuizNameUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is already used in the current logged in user for another quiz', () => {
      person1 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'existingQuiz',
        'A pre-existing quiz with the name "existingQuiz".'
      );

      result1 = requestAdminQuizNameUpdate(
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
