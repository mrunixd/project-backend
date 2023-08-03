import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizDescriptionUpdate,
  requestAdminQuizInfo,
  deleteRequest,
  OK,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let person1: any;
let person2: any;
let quiz1: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
});

describe('/////// TESTING v2/admin/quiz/description ///////', () => {
  describe('//////// Testing v2/admin/quiz/description success ////////', () => {
    test('CASE: Successful adminQuizDescriptionUpdate', () => {
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

      result1 = requestAdminQuizDescriptionUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'newDescriptionToBeChangedTo'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );

      expect(result2.body).toMatchObject({
        description: 'newDescriptionToBeChangedTo',
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v2/admin/quiz/description error(s)', () => {
  // Status 403
    test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
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

      result1 = requestAdminQuizDescriptionUpdate(
      `${quiz1.body.quizId}`,
      '12345',
      'newDescription'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    // Status 400
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

      result1 = requestAdminQuizDescriptionUpdate(
      `${quiz1.body.quizId + 1}`,
      `${person1.body.token}`,
      'newDescription'
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

      result1 = requestAdminQuizDescriptionUpdate(
      `${quiz1.body.quizId}`,
      `${person2.body.token}`,
      'newDescription'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Description is longer than 100 characters', () => {
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

      result1 = requestAdminQuizDescriptionUpdate(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: More than 100 empty spaces', () => {
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

      result1 = requestAdminQuizDescriptionUpdate(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      '                                                                                                      '
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
