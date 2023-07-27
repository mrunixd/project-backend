import {
  requestAdminAuthRegister,
  requestAdminAuthLogin,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let result3: any;
let person1: any;
let person2: any;
let quiz1: any;
let quiz2: any;
let quiz3: any;
let quizQuestion1: any;
let quizQuestion2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  result3 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
  quizQuestion1 = undefined;
  quizQuestion2 = undefined;
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
