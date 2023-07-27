import {
  requestAdminAuthRegister,
  requestAdminAuthUpdateDetails,
  requestAdminUserDetails,
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

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
});

describe('/////// /v1/admin/user/details //////', () => {
  describe('////// adminAuthUpdateDetails runs ///////', () => {
    test('CASE(200): Updated details successfully', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'newEmail@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminUserDetails(person1.body.token);
      expect(result2.body).toMatchObject({
        user: {
          name: 'Vincent Xian',
          email: 'newEmail@gmail.com',
          numFailedPasswordsSinceLastLogin: expect.any(Number),
          numSuccessfulLogins: expect.any(Number),
          userId: expect.any(Number),
        },
      });
      expect(result2.status).toBe(OK);
    });

    test('CASE(200): Email is unchanged, other details change', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      person2 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'Abcd12345',
        'Vincent',
        'Xian'
      );

      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'zhizhao@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(person2.status).toBe(OK);

      result2 = requestAdminUserDetails(person1.body.token);

      expect(result2.body).toMatchObject({
        user: {
          name: 'Vincent Xian',
          email: 'zhizhao@gmail.com',
          numFailedPasswordsSinceLastLogin: expect.any(Number),
          numSuccessfulLogins: expect.any(Number),
          userId: expect.any(Number),
        },
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('////// adminAuthUpdateDetails errors ///////', () => {
    test('CASE(400): Email is currently used for another user', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      person2 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'Abcd12345',
        'Vincent',
        'Xian'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'Zhi',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
      expect(person2.status).toBe(OK);
    });

    test('CASE(400): Email is invalid', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'invalidemail',
        'Zhi',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name contains forbidden characters - numbers', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        '12345',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name contains forbidden characters - special characters/symbols', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        '!@#$%',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name is either less than 2 characters or more than 20 characters long - too short', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'V',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name is either less than 2 characters or more than 20 characters long - too long', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'VincentVincentVincent',
        'Zhao'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name contains forbidden characters - numbers', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'Zhi',
        '12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name contains forbidden characters - special characters/symbols', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'Zhi',
        '!@#$%'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name is either less than 2 characters or more than 20 characters long - too short', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'Zhi',
        'Z'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name is either less than 2 characters or more than 20 characters long - too long', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        `${person1.body.token}`,
        'vincentxian@gmail.com',
        'Zhi',
        'ZhaoZhaoZhaoZhaoZhaoZ'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(401): Token is invalid structure - too short', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        '1234',
        'vincentxian@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is invalid structure - too long', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        '123456',
        'vincentxian@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is invalid structure - special characters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        '!@#$%',
        'vincentxian@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): Provided token is valid structure, but is not for a currently logged in session', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdateDetails(
        '12345',
        'vincentxian@gmail.com',
        'Vincent',
        'Xian'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});
