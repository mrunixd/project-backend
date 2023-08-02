import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizThumbnailUpdate,
  requestAdminQuizInfo,
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

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
});

describe('/////// TESTING v2/admin/quiz/thumbnail ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
  });
  describe('/////// Testing v2/admin/quiz/thumbnail success', () => {
    test('CASE: Successful adminQuizThumbnailUpdate', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${person1.body.token}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: expect.any(String),
      });
      expect(result2.status).toBe(OK);
    });
    test('CASE: Successful adminQuizThumbnailUpdate x 2', () => {
      requestAdminQuizThumbnailUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );
      result1 = requestAdminQuizThumbnailUpdate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: expect.any(String),
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v2/admin/quiz/name error', () => {
    test('CASE: quizId does not refer to a valid quiz', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId + 1}`,
          `${person1.body.token}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quizId does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );

      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${person2.body.token}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${1}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - non-numeric characters', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          'let!!',
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - too long', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${12121322}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${12345}`,
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: invalid url', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${person1.body.token}`,
          'https://www.wix.com/'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: valid url but not a jpeg or png', () => {
      result1 = requestAdminQuizThumbnailUpdate(
          `${quiz1.body.quizId}`,
          `${person1.body.token}`,
          'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
