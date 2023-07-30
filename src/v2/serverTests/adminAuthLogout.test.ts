import {
  requestAdminAuthRegister,
  requestAdminAuthLogin,
  requestAdminAuthLogout,
  deleteRequest,
  OK,
  UNAUTHORISED,
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

describe('/////// /v2/admin/auth/logout ///////', () => {
  describe('/////// /v2/admin/auth/logout successful ///////', () => {
    test('CASE: Logout successful', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });

    test('CASE: Login, logout, login, logout success', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout(person1.body.token);
      result2 = requestAdminAuthLogin('zhizhao@gmail.com', 'Abcd12345');
      result3 = requestAdminAuthLogout(result2.body.token);

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
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout('1234');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - too long', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout('123456');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - non-numeric characters', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout('SP!@#');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): The token is for a user who has already logged out', () => {
      person1 = requestAdminAuthRegister(
        'zhizhao@gmail.com',
        'Abcd12345',
        'Zhi',
        'Zhao'
      );
      result1 = requestAdminAuthLogout(person1.body.token);
      result2 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});
