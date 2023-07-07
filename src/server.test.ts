import request from 'sync-request';
import config from './config.json';
import { adminAuthRegister } from './auth';
import { resourceLimits } from 'worker_threads';
import { getNameOfDeclaration } from 'typescript';
const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

function postRequest(route: string, json: any) {
  const res = request('POST', `${SERVER_URL}${route}`, { json: json });
  // return JSON.parse(res.body.toString());
  return JSON.parse(res.body.toString());
}

function deleteRequest(route: string, qs: any) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs });
  return JSON.parse(res.body.toString());
}

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

describe('////////TESTING v1/admin/auth/register////////', () => {
  describe('Testing v1/admin/auth/register success', () => {
    test('Successful adminAuthRegister 1 person', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincent@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({
        sessionId: expect.any(Number),
        authUserId: expect.any(Number)
      });
      // expect(result1.statusCode).toBe(OK);
    });
  });

  describe('Testing v1/admin/auth/register errors', () => {
    test('CASE: Email address is already in use - same email in caps', () => {
      postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      result2 = postRequest('/v1/admin/auth/register', {
        email: 'Vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result2).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Email address is already in use - same email exactly', () => {
      postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      result2 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result2).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Email address is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincent123',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: First name is is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: '!!!',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'v',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Last name is is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: '!!!',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'x',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Password is less than 8 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'pass',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Password does not contain at least one number and at least one letter', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('////////TESTING v1/admin/auth/login////////', () => {
  describe('Testing v1/admin/auth/login success', () => {
    beforeEach(() => {
      postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
    });

    test('Successful adminAuthLogin 2 people', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({
        sessionId: expect.any(Number),
        authUserId: expect.any(Number)
      });
    });

    test('testing whether email address is case sensitive', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'MANAN.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({
        sessionId: expect.any(Number),
        authUserId: expect.any(Number)
      });
    });

    test('testing successful increment of logins', () => {
      postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({
        sessionId: expect.any(Number),
        authUserId: expect.any(Number)
      });
    });

    test('testing succesful increments of incorrect passwords', () => {
      postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectPw1234',
      });
      postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectPw1234',
      });
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({
        sessionId: expect.any(Number),
        authUserId: expect.any(Number)
      });
    });
  });

  describe('Testing v1/admin/auth/login errors', () => {
    beforeEach(() => {
      postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
    });
    test('CASE: Email address does not exist', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'unregisteredemail@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Password is incorrect: Differing cases', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'abcd12345',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Password is incorrect: Differing password', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Password is incorrect: Differing cases', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('////////TESTING v1/clear////////', () => {
  test('test clear() returns {}', () => {
    result1 = deleteRequest('/v1/clear', {});
    expect(result1).toStrictEqual({});
  });
  // will continue to do more test as more functions are produced.
});
