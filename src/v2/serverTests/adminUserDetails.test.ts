import {
  requestAdminAuthRegister,
  requestAdminUserDetails,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
} from '../helper';

let result1: any;
let person1: any;
let person2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
});

describe('////////TESTING /v2/admin/user/details////////', () => {
  describe('Testing /v2/admin/user/details success', () => {
    test('CASE: Successful self check', () => {
      person1 = requestAdminAuthRegister(
        'vincent@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      result1 = requestAdminUserDetails(person1.body.token);
      expect(result1.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'vincent xian',
          email: 'vincent@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        },
      });
      expect(result1.status).toBe(OK);
    });

    test('CASE: Successful check on 2nd person', () => {
      requestAdminAuthRegister(
        'vincent@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      person2 = requestAdminAuthRegister(
        'manan.j2450@gmail.com',
        'abcd1234',
        'Manan',
        'Jaiswal'
      );
      result1 = requestAdminUserDetails(person2.body.token);
      expect(result1.body).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Manan Jaiswal',
          email: 'manan.j2450@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        },
      });
      expect(result1.status).toBe(OK);
    });
    describe('Testing /v2/admin/user/details errors', () => {
      test('CASE (401): Token is not a valid structure - too short', () => {
        result1 = requestAdminUserDetails('1');
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(UNAUTHORISED);
      });
      test('CASE (401): Token is not a valid structure - special symbols', () => {
        result1 = requestAdminUserDetails('lett!');
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(UNAUTHORISED);
      });
      test('CASE (403): Token is not valid for a currently logged in session', () => {
        person1 = requestAdminAuthRegister(
          'vincent@gmail.com',
          'password1',
          'vincent',
          'xian'
        );
        const sessionId = parseInt(person1.body.token) + 1;
        result1 = requestAdminUserDetails(`${sessionId}`);
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(FORBIDDEN);
      });
    });
  });
});
