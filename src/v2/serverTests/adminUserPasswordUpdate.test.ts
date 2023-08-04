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

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

describe('/////// /v2/admin/user/password ///////', () => {
  describe('/////// /v2/admin/user/password runs ///////', () => {
    test('CASE(200): adminAuthUpdatePassword runs successfully', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      const result2 = requestAdminAuthLogout(person1.body.token);
      const result3 = requestAdminAuthLogin('zhizhao@gmail.com', 'Bcde12345');

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
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Abcd12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password has already been used before by this user - initial password', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      const result2 = requestAdminAuthUpdatePassword(
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
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde12345'
      );
      const result2 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Bcde12345',
        'Cdef12345'
      );
      const result3 = requestAdminAuthUpdatePassword(
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
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'Bcde123'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all letters', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        'aBcDeFgHi'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all numbers', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        '123456789'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - non-alphanumeric characters', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        `${person1.body.token}`,
        'Abcd12345',
        '!@#$%^&*('
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(401): Token is not a valid structure - too short', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        '1234',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - too long', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        '123456',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - special characters', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        '!@#$%',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): Provided token is valid structure, but it not for a currently logged in session', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthUpdatePassword(
        '12345',
        'Abcd12345',
        'Bcde12345'
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});
