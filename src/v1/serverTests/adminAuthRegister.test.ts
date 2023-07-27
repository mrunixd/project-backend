import {
  requestAdminAuthRegister,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
});

describe('////////TESTING v1/admin/auth/register////////', () => {
  describe('Testing v1/admin/auth/register success', () => {
    test('Successful adminAuthRegister 1 person', () => {
      result1 = requestAdminAuthRegister(
        'vincent@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing v1/admin/auth/register errors', () => {
    test('CASE: Email address is already in use - same email in caps', () => {
      requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      result2 = requestAdminAuthRegister(
        'Vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: Email address is already in use - same email exactly', () => {
      requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      result2 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: Email address is invalid', () => {
      result1 = requestAdminAuthRegister(
        'vincent123',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is is invalid', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        '!!!',
        'xian'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'v',
        'xian'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is is invalid', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpasswor1',
        'vincent',
        '!!!'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'x'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is less than 8 characters', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'pass',
        'vincent',
        'xian'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password does not contain at least one number and at least one letter', () => {
      result1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password',
        'vincent',
        'xian'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
