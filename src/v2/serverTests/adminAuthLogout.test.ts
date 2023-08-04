import {
  requestAdminAuthRegister,
  requestAdminAuthLogin,
  requestAdminAuthLogout,
  deleteRequest,
  OK,
  UNAUTHORISED,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

describe('/////// /v2/admin/auth/logout ///////', () => {
  describe('/////// /v2/admin/auth/logout successful ///////', () => {
    test('CASE: Logout successful', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });

    test('CASE: Login, logout, login, logout success', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout(person1.body.token);
      const result2 = requestAdminAuthLogin('zhizhao@gmail.com', 'Abcd12345');
      const result3 = requestAdminAuthLogout(result2.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ token: expect.any(String) });
      expect(result2.status).toBe(OK);

      expect(result3.body).toStrictEqual({});
      expect(result3.status).toBe(OK);
    });
  });

  describe('/////// /v2/admin/auth/logout error occurred ///////', () => {
    test('CASE(401): Token has invalid structure - too short', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout('1234');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - too long', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout('123456');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - non-numeric characters', () => {
      requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout('SP!@#');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): The token is for a user who has already logged out', () => {
      const person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      const result1 = requestAdminAuthLogout(person1.body.token);
      const result2 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});
