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
  return JSON.parse(res.body.toString());
}

function deleteRequest(route: string, json: any) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { json: json });
  return JSON.parse(res.body.toString());
}

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

describe('TESTING v1/admin/auth/register', () => {
  describe('SUCCESS CASES', () => {
    test('Successful adminAuthRegister 1 person', () => {
      const result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincent@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1).toStrictEqual({ authUserId: expect.any(Number) });
      // expect(result1.statusCode).toBe(OK);
    });
  });
});

describe('TESTING v1/admin/auth/login', () => {
  describe('SUCCESS CASES', () => {
    beforeEach(() => {
      postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
    });

    test('Successful adminAuthLogin 1 person', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({ authUserId: expect.any(Number) });
    });

    test('testing whether email address is case sensitive', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'MANAN.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({ authUserId: expect.any(Number) });
    });

    test('testing successful increment of logins', () => {
      postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({ authUserId: expect.any(Number) });
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
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1).toStrictEqual({ authUserId: expect.any(Number) });
    });
  });
  describe('Testing v1/admin/auth/login Errors', () => {
    beforeEach(() => {
      postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
    });
    test('Email address does not exist', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'unregisteredemail@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('Password is incorrect: Differing cases', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'abcd12345',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('Password is incorrect: Differing password', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('Password is incorrect: Differing cases', () => {
      const result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('TESTING v1/clear', () => {
  test('test clear() returns {}', () => {
    const result1 = deleteRequest('/v1/clear', {});
    expect(result1).toStrictEqual({});
  });
  // will continue to do more test as more functions are produced.
});
