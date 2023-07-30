import {
  requestAdminAuthRegister,
  requestAdminAuthUpdatePassword,
  requestAdminAuthLogin,
  requestAdminAuthLogout,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let result3: any;
let person1: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  result3 = undefined;
  person1 = undefined;
});

describe('/////// /v2/admin/user/password ///////', () => {
  describe('/////// /v2/admin/user/password runs ///////', () => {
    test('CASE(200): adminAuthUpdatePassword runs successfully', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      result2 = requestAdminAuthLogout(person1.body.token);
      result3 = requestAdminAuthLogin('zhizhao@gmail.com', 'Bcde12345');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({});
      expect(result2.status).toBe(OK);

      expect(result3.body).toStrictEqual({ token: expect.any(String) });
      expect(result3.status).toBe(OK);
    });
  });

  describe('/////// /v2/admin/user/password error ///////', () => {
    test('CASE(400): New password is not the correct old password', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Abcd12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password has already been used before by this user - initial password', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      result2 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Bcde12345',
        'Abcd12345'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password has already been used before by this user - update password repeatedly', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      result2 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Bcde12345',
        'Cdef12345'
      );
      result3 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Cdef12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({});
      expect(result2.status).toBe(OK);

      expect(result3.body).toStrictEqual({ error: expect.any(String) });
      expect(result3.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password is less than 8 characters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde123'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all letters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'aBcDeFgHi'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all numbers', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        '123456789'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - non-alphanumeric characters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        '!@#$%^&*('
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(401): Token is not a valid structure - too short', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        '1234',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - too long', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        '123456',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - special characters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        '!@#$%',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): Provided token is valid structure, but it not for a currently logged in session', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthUpdatePassword(
        '12345',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});
