import { adminAuthRegister, adminAuthLogin, adminUserDetails } from './auth.js';
import { clear } from './other.ts';

beforeEach(() => {
  clear();
});

describe('////////TESTING ADMINAUTHREGISTER////////', () => {
  describe('Testing adminAuthRegister success', () => {
    test('CASE: Successful register', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });
  });
  
  describe('Testing adminAuthRegister errors', () => {
    test('CASE: Email address is already in use - same email in caps', () => {
      adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const result2 = adminAuthRegister(
        'Vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result2).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Email address is already in use - same email exactly', () => {
      adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const result2 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result2).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Email address is invalid', () => {
      const result = adminAuthRegister(
        'vincent123',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: First name is invalid', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        '!!!',
        'xian'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'v',
        'xian'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Last name is invalid', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        '!!!'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'x'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Password is less than 8 characters', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'pass',
        'vincent',
        'xian'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  
    test('CASE: Password does not contain at least one number and at least one letter', () => {
      const result = adminAuthRegister(
        'vincentxian@gmail.com',
        'password',
        'vincent',
        'xian'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  });
});


describe('////////TESTING ADMINAUTHLOGIN////////', () => {
  describe('Testing adminAuthLogin success', () => {
    test('CASE: Email and password are exact same', () => {
      adminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      expect(adminAuthLogin('manan.j2450@gmail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  });
  
  describe('Testing adminAuthLogin errors', () => {
    test('CASE: Email address does not exist', () => {
      expect(adminAuthLogin('manan.j2450@gmail.com', 'hello1')).toStrictEqual({
        error: expect.any(String),
      });
    });
  
    test('CASE: Password is incorrect - differing case', () => {
      adminAuthRegister('manan1111@gmail.com', 'ABCD1234', 'Manan', 'Jaiswal');
      expect(adminAuthLogin('manan1111@gmail.com', 'hello2')).toStrictEqual({
        error: expect.any(String),
      });
    });
  
    test('CASE: Password is incorrect - differing password', () => {
      adminAuthRegister(
        'manan2222@gmail.com',
        'incorrectpw1',
        'Manan',
        'Jaiswal'
      );
      expect(adminAuthLogin('manan2222@gmail.com', 'hello3')).toStrictEqual({
        error: expect.any(String),
      });
    });
  });
  
  describe('email addresses case sensitivity', () => {
    test('CASE: test case sensitivity of email address letters', () => {
      adminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      expect(adminAuthLogin('Manan.j2450@gmail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  
    test('CASE: test case sensitivity of email address letters', () => {
      adminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      expect(adminAuthLogin('manan.j2450@gMail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  
    test('CASE: test of email address letters - registered with capital letters', () => {
      adminAuthRegister('MANAN.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      expect(adminAuthLogin('manan.j2450@gMail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  });
  
  describe('increment numSuccesfulLogins & numFailedPasswords', () => {
    test('CASE: 2 successful logins in a row', () => {
      adminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      adminAuthLogin('manan.j2450@gmail.com', 'abcd1234');
      adminAuthLogin('manan.j2450@gmail.com', 'abcd1234');
      expect(adminAuthLogin('manan.j2450@gmail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  
    test('CASE: 2 incorrect passwords in a row', () => {
      adminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
      adminAuthLogin('manan.j2450@gmail.com', 'abcd1234');
      adminAuthLogin('manan.j2450@gmail.com', 'incorrectpw1');
      adminAuthLogin('manan.j2450@gmail.com', 'incorrectpw2');
      expect(adminAuthLogin('manan.j2450@gmail.com', 'abcd1234')).toStrictEqual({
        authUserId: expect.any(Number),
      });
    });
  });
});

describe('////////TESTING ADMINUSERDETAILS////////', () => {
  describe('Testing adminUserDetails success', () => {
    test('CASE: Successful self check', () => {
      const person = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const result = adminUserDetails(person.authUserId);
      expect(result).toStrictEqual({
        user: {
          userId: person.authUserId,
          name: 'vincent xian',
          email: 'vincentxian@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        },
      });
    });
  
    test('CASE: Successful check on 2nd person', () => {
      adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const person2 = adminAuthRegister(
        'manan.j2450@gmail.com',
        'abcd1234',
        'Manan',
        'Jaiswal'
      );
  
      const result = adminUserDetails(person2.authUserId);
      expect(result).toStrictEqual({
        user: {
          userId: person2.authUserId,
          name: 'Manan Jaiswal',
          email: 'manan.j2450@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        },
      });
    });
  });
  
  describe('Testing adminUserDetails errors', () => {
    test('CASE: AuthUserId is not a valid user', () => {
      const person = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const result = adminUserDetails(person.authUserId + 1);
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  });  
});
