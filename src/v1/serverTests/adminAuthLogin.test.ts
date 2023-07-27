import {
  requestAdminAuthRegister,
  requestAdminAuthLogin,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

let result1: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
});

describe('////////TESTING v1/admin/auth/login////////', () => {
  describe('Testing v1/admin/auth/login success', () => {
    beforeEach(() => {
      requestAdminAuthRegister(
        'manan.j2450@gmail.com',
        'Abcd12345',
        'Manan',
        'Jaiswal'
      );
    });

    test('Successful adminAuthLogin 2 people', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'Abcd12345');
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });

    test('testing whether email address is case sensitive', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'Abcd12345');
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });

    test('testing successful increment of logins', () => {
      requestAdminAuthLogin('manan.j2450@gmail.com', 'Abcd12345');
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'Abcd12345');
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });

    test('testing succesful increments of incorrect passwords', () => {
      requestAdminAuthLogin('manan.j2450@gmail.com', 'incorrectPw1234');
      requestAdminAuthLogin('manan.j2450@gmail.com', 'incorrectPw1234');
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'Abcd12345');
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing v1/admin/auth/login errors', () => {
    beforeEach(() => {
      requestAdminAuthRegister(
        'manan.j2450@gmail.com',
        'Abcd12345',
        'Manan',
        'Jaiswal'
      );
    });
    test('CASE (400): Email address does not exist', () => {
      result1 = requestAdminAuthLogin(
        'unregisteredemail@gmail.com',
        'incorrectpW1234'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'abcd12345');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing password', () => {
      result1 = requestAdminAuthLogin(
        'manan.j2450@gmail.com',
        'incorrectpW1234'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = requestAdminAuthLogin(
        'manan.j2450@gmail.com',
        'incorrectpW1234'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
