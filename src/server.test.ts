import request from 'sync-request';
import config from './config.json';
import { adminAuthRegister } from './auth';
import { resourceLimits } from 'worker_threads';
import { getNameOfDeclaration } from 'typescript';
const OK = 200;
const INPUT_ERROR = 400;
const UNAUTHORISED = 401;
const FORBIDDEN = 403;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

function postRequest(route: string, json: any) {
  const res = request('POST', `${SERVER_URL}${route}`, { json: json });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

function deleteRequest(route: string, qs: any) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

function putRequest(route: string, json: any) {
  const res = request('PUT', `${SERVER_URL}${route}`, { json: json });

  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

function getRequest(route: string, qs: any) {
  const res = request('GET', `${SERVER_URL}${route}`, { qs: qs });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

let result1: any;
let result2: any;
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
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
  quizQuestion1 = undefined;
  quizQuestion2 = undefined;
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
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
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
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
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
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: Email address is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincent123',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: '!!!',
        nameLast: 'xian',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'v',
        nameLast: 'xian',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is is invalid', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: '!!!',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'vincentpassword1',
        nameFirst: 'vincent',
        nameLast: 'x',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is less than 8 characters', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'pass',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password does not contain at least one number and at least one letter', () => {
      result1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
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
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });

    test('testing whether email address is case sensitive', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'MANAN.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
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
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
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
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
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
    test('CASE (400): Email address does not exist', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'unregisteredemail@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'abcd12345',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing password', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////TESTING v1/clear////////', () => {
  test('test clear() returns {}', () => {
    result1 = deleteRequest('/v1/clear', {});
    expect(result1.body).toStrictEqual({});
  });
  // will continue to do more test as more functions are produced.
});

describe('////////TESTING /v1/admin/user/details////////', () => {
  describe('Testing /v1/admin/user/details success', () => {
    test('CASE: Successful self check', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'vincent@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      result1 = getRequest(
        `/v1/admin/user/details?token=${person1.body.token}`,
        {}
      );
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
      postRequest('/v1/admin/auth/register', {
        email: 'vincent@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'abcd1234',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
      result1 = getRequest(
        `/v1/admin/user/details?token=${person2.body.token}`,
        {}
      );
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
    describe('Testing /v1/admin/user/details errors', () => {
      test('CASE (401): Token is not a valid structure - too short', () => {
        result1 = getRequest('/v1/admin/user/details?token=1', {});
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(UNAUTHORISED);
      });
      test('CASE (401): Token is not a valid structure - special symbols', () => {
        result1 = getRequest('/v1/admin/user/details?token=lett!', {});
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(UNAUTHORISED);
      });
      test('CASE (403): Token is not valid for a currently logged in session', () => {
        person1 = postRequest('/v1/admin/auth/register', {
          email: 'vincent@gmail.com',
          password: 'password1',
          nameFirst: 'vincent',
          nameLast: 'xian',
        });
        const sessionId = parseInt(person1.body.token) + 1;
        result1 = getRequest(`/v1/admin/user/details?token=${sessionId}`, {});
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(FORBIDDEN);
      });
    });
  });
});

describe('//////// Testing v1/admin/quiz/ ////////', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });
  });

  describe('Testing /v1/admin/quiz success cases', () => {
    test('Successful adminQuizCreate 1 quiz', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ quizId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v1/admin/quiz/ error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: '1',
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: 'let!!',
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = postRequest('/v1/admin/quiz', {
        token: `${sessionId}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: not alpahnumeric name', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: '*not^lph+',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is less than 3 or more than 30 characters', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'as',
        description: 'first quiz being tested',
      });
      result2 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'this is going to be a lot more than 30 characters',
        description: 'first quiz being tested',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is already used for a quiz by user', () => {
      postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      result1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested again',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: description is more than 100 characters', () => {
      result1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'as',
        description:
          'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('TESTING v1/admin/quiz/list', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });
  });

  describe('SUCCESS CASES', () => {
    test('Successful adminQuizList 1 quiz', () => {
      const quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = getRequest(
        `/v1/admin/quiz/list?token=${person1.body.token}`,
        {}
      );

      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });

    test('Successful empty display', () => {
      result1 = getRequest(
        `/v1/admin/quiz/list?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({ quizzes: [] });
      expect(result1.status).toBe(OK);
    });

    test('Successful Multiple quiz display', () => {
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      quiz2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      quiz3 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'third quiz',
        description: 'third quiz being tested',
      });

      result1 = getRequest(
        `/v1/admin/quiz/list?token=${person1.body.token}`,
        {}
      );

      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
          {
            quizId: quiz2.body.quizId,
            name: 'second quiz',
          },
          {
            quizId: quiz3.body.quizId,
            name: 'third quiz',
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('ERROR CASES', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = getRequest('/v1/admin/quiz/list?token=1', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = getRequest('/v1/admin/quiz/list?token=let!!', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = getRequest(`/v1/admin/quiz/list?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('///////Testing /v1/admin/quiz/delete////////', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'manan.j2450@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'Manan',
      nameLast: 'Jaiswal',
    });
  });
  describe('Testing /v1/admin/quiz/ delete success cases', () => {
    test('Successful deletion of quiz', () => {
      const quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      const sessionId = person1.body.token;
      const result1 = deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${sessionId}`,
        {}
      );
      const result2 = getRequest(`/v1/admin/quiz/list?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(result2.body).toStrictEqual({ quizzes: [] });
    });

    test('Successful deletion of quiz amongst quizzes', () => {
      const quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      const quiz2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      const sessionId = person1.body.token;
      const result1 = deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${sessionId}`,
        {}
      );
      const result2 = getRequest(`/v1/admin/quiz/list?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz2.body.quizId,
            name: 'second quiz',
          },
        ],
      });
    });
  });
  describe('Testing /v1/admin/quiz/ delete error cases', () => {
    beforeEach(() => {
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });
      result2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
    });
    test('CASE (400): Quiz Id does not refer to a valid quiz', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/${result2.body.quizId - 1}?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE (400): Quiz Id does not refer to a valid quiz', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/${result2.body.quizId + 2}?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE (400): Quiz Id does not refer to a valid quiz that a user owns', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/${result2.body.quizId}?token=${person2.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE(401): Token is not valid structure', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/${result2.body.quizId}?token=hello1234`,
        {}
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });

    test('CASE(403): Provided token is of valid structure but no logged session', () => {
      const result1 = deleteRequest(
        `/v1/admin/quiz/${result2.body.quizId}?token=12345`,
        {}
      );
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});

describe('///////Testing /v1/admin/quiz/ info////////', () => {
  const quizQuestion1Body = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: false,
      },
      {
        answer: 'King Charles',
        correct: true,
      },
    ],
  };
  const quizQuestion2Body = {
    question: 'second question?',
    duration: 2,
    points: 3,
    answers: [
      {
        answer: 'second answer',
        correct: false,
      },
      {
        answer: 'second real answer',
        correct: true,
      },
    ],
  };
  describe('Testing /v1/admin/quiz/ info success cases', () => {
    test('Success info 1 person 1 quiz 0 questions', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(result1.status).toBe(OK);
      expect(result1.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
      });
    });

    test('Success info 1 person 1 quiz 2 questions', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      quizQuestion1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion1Body,
        }
      );
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );

      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(result1.status).toBe(OK);
      expect(result1.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 2,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 6,
      });
    });
  });
  describe('Testing /v1/admin/quiz/ info error cases', () => {
    beforeEach(() => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'vincentxian@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
    });

    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${1}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${'let!!'}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${sessionId}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });
      result1 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person2.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////Testing v1/admin/quiz/{quizid}/question//////////', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });
    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });
    quizQuestion1 = {
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: false,
        },
        {
          answer: 'King Charles',
          correct: true,
        },
      ],
    };
  });

  describe('Testing /v1/admin/quiz/{quizid}/question success cases', () => {
    test('Successful adminQuizCreate 1 quiz question', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ questionId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v1/admin/quiz/{quizid}/question error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: '1',
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: 'let!!',
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${sessionId}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: quiz does not exist', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'vincent@gmail.com',
        password: 'password1',
        nameFirst: 'vincent',
        nameLast: 'xian',
      });
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person2.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: question string is less than 5 or more than 50 characters', () => {
      quizQuestion1 = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      quizQuestion1 = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duration is not a positive number', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: -1,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: total duration is more than 3 minutes', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 181,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: points awarded are more than 10 or less than 1', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 11,
        answers: [
          {
            answer: 'Prince Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: answer strings are less than 1 or greater than 30', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 9,
        answers: [
          {
            answer:
              'this is meant to be more than 30 characters long and i think it is',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duplicate answers', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 8,
        answers: [
          {
            answer: 'King Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: no correct answers', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 8,
        answers: [
          {
            answer: 'King Charless',
            correct: false,
          },
          {
            answer: 'Prince Charles',
            correct: false,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('/////// TESTING v1/admin/quiz/name ///////', () => {
  describe('/////// Testing v1/admin/quiz/name success', () => {
    test('CASE: Successful adminQuizNameUpdate', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: `${person1.body.token}`,
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = getRequest('/v1/admin/quiz/list', {
        token: `${person1.body.token}`,
      });

      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'newQuizName',
          },
        ],
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v1/admin/quiz/name error', () => {
    test('CASE: quizId does not refer to a valid quiz', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId + 1}/name`, {
        token: `${person1.body.token}`,
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quizId does not refer to a quiz that this user owns', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      person2 = postRequest('/v1/admin/auth/register', {
        email: 'zhizhao@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Zhi',
        nameLast: 'Zhao',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: `${person2.body.token}`,
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name contains invalid characters', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: `${person1.body.token}`,
        name: '%!@#!%',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is less than 3 characters long', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: `${person1.body.token}`,
        name: 'zh',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is more than 30 characters long', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: `${person1.body.token}`,
        name: 'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is already used in the current logged in user for another quiz', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'existingQuiz',
        description: 'A pre-existing quiz with the name "existingQuiz".',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizid}/name`, {
        token: `${person1.body.token}`,
        name: 'existingQuiz',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Token is not a valid structure - too short', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: '1424',
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - non-numeric characters', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: 'SP@!$',
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - too long', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: '142423',
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/name`, {
        token: '12345',
        name: 'newQuizName',
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('/////// TESTING v1/admin/quiz/description ///////', () => {
  describe('//////// Testing v1/admin/quiz/description success ////////', () => {
    test('CASE: Successful adminQuizDescriptionUpdate', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
        token: `${person1.body.token}`,
        description: 'newDescriptionToBeChangedTo'
      });

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = getRequest(`/v1/admin/quiz/${quiz1.body.quizId}`, {
        token: `${person1.body.token}`
      });

      expect(result2.body).toMatchObject({
        description: 'newDescriptionToBeChangedTo'
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v1/admin/quiz/description error(s)', () => {
    // Status 401
    test('CASE: Token is not a valid structure - too short', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
        token: '1424',
        name: 'newQuizName'
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - too long', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
        token: '142324',
        name: 'newQuizName'
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - special characters', () => {
      person1 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      quiz1 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'first quiz',
        description: 'first quiz being tested',
      });

      result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
        token: 'd@421',
        name: 'newQuizName'
      });

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
  });

  // Status 403
  test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });

    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });

    result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
      token: '12345',
      description: 'newDescription'
    });

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(FORBIDDEN);
  });

  // Status 400
  test('CASE: quizId does not refer to a valid quiz', () => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth'
    });

    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });

    result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId + 1}/description`, {
      token: `${person1.body.token}`,
      description: 'newDescription'
    });

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: quizId does not refer to a quiz that this user owns', () => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth'
    });

    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });

    person2 = postRequest('/v1/admin/auth/register', {
      email: 'zhizhao@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'Zhi',
      nameLast: 'Zhao',
    });

    result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
      token: `${person2.body.token}`,
      description: 'newDescription',
    });

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: Description is longer than 100 characters', () => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });

    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });

    result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
      token: `${person1.body.token}`,
      description: 'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh'
    });

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: More than 100 empty spaces', () => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });

    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });

    result1 = putRequest(`/v1/admin/quiz/${quiz1.body.quizId}/description`, {
      token: `${person1.body.token}`,
      description: '                                                                                                      '
    });

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });
});

describe('////////Testing v1/admin/quiz/trash////////', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'manan.j2450@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'Manan',
      nameLast: 'Jaiswal',
    });
  });

  describe('Testing v1/admin/quiz/trash success cases', () => {
    beforeEach(() => {
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      quiz2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      quiz3 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'third quiz',
        description: 'second quiz being tested',
      });
    });
    test('successfully removing 1 quiz and viewing in trash', () => {
      const sessionId = person1.body.token;
      deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${sessionId}`,
        {}
      );
      result1 = getRequest(`/v1/admin/quiz/trash?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });
    test('successfully removing all quizzes and viewing in trash', () => {
      const sessionId = person1.body.token;
      deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${sessionId}`,
        {}
      );
      deleteRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}?token=${sessionId}`,
        {}
      );
      deleteRequest(
        `/v1/admin/quiz/${quiz3.body.quizId}?token=${sessionId}`,
        {}
      );
      result1 = getRequest(`/v1/admin/quiz/trash?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.body.quizId,
            name: 'first quiz',
          },
          {
            quizId: quiz2.body.quizId,
            name: 'second quiz',
          },
          {
            quizId: quiz3.body.quizId,
            name: 'third quiz',
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });
    test('checking successful empty trash', () => {
      const sessionId = person1.body.token;
      result1 = getRequest(`/v1/admin/quiz/trash?token=${sessionId}`, {});
      expect(result1.body).toStrictEqual({
        quizzes: [],
      });
      expect(result1.status).toBe(OK);
    });
  });
  describe('Testing v1/admin/quiz/trash error cases', () => {
    beforeEach(() => {
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
    });
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      result1 = getRequest(
        `/v1/admin/quiz/trash?token=${parseInt(sessionId) - 1}`,
        {}
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = getRequest('/v1/admin/quiz/trash?token=hi!!!', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = getRequest('/v1/admin/quiz/trash?token=a1aaa', {});
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
  });
});

describe('///////Testing /v1/admin/quiz/transfer////////', () => {
  const quizQuestion1Body = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: false,
      },
      {
        answer: 'King Charles',
        correct: true,
      },
    ],
  };
  const quizQuestion2Body = {
    question: 'second question?',
    duration: 2,
    points: 3,
    answers: [
      {
        answer: 'second answer',
        correct: false,
      },
      {
        answer: 'second real answer',
        correct: true,
      },
    ],
  };

  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'vincentxian@gmail.com',
      password: 'password1',
      nameFirst: 'vincent',
      nameLast: 'xian',
    });
    person2 = postRequest('/v1/admin/auth/register', {
      email: 'aarnavsample@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'aarnav',
      nameLast: 'sheth',
    });
    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });
    quizQuestion1 = postRequest(
      `/v1/admin/quiz/${quiz1.body.quizId}/question`,
      {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1Body,
      }
    );
  });

  describe('Testing /v1/admin/quiz/question/move success cases', () => {
    test('move quiz to 2nd person who already has a quiz', () => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person2.body.token}`,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );

      result2 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person2.body.token}`,
        {}
      );
      const result3 = getRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}?token=${person2.body.token}`,
        {}
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
        questions: [{
          questionId: quizQuestion1.body.questionId,
          question: 'Who is the Monarch of England?',
          duration: 4,
          points: 5,
          answers: [
            {
              answer: 'Prince Charles',
              answerId: expect.any(Number),
              colour: expect.any(String),
              correct: false,
            },
            {
              answer: 'King Charles',
              answerId: expect.any(Number),
              colour: expect.any(String),
              correct: true,
            },
          ],
        }],
        duration: 4
      });
      expect(result3.body).toStrictEqual({
        quizId: quiz2.body.quizId,
        name: 'second quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0
      });
    });

    test('duplicate 1st question after transfer to 2nd person', () => {
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );

      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/duplicate`,
        {
          token: `${person2.body.token}`,
        }
      );
      result2 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person2.body.token}`,
        {}
      );
      const result3 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result3.status).toBe(INPUT_ERROR);

      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 3,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          }, {
            questionId: quizQuestion3.body.newQuestionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          }, {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 10,
      });
    });
  });
  describe('Testing /v1/admin/quiz/transfer error cases', () => {
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${'le1!!'}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Provided token is valid structure, but is not for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${sessionId}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      const person3 = postRequest('/v1/admin/auth/register', {
        email: 'manan.j2450@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'Manan',
        nameLast: 'Jaiswal',
      });
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person2.body.token}`,
          userEmail: 'manan.j2450@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is not a real user', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'fakeEmail',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is the current logged in user', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'vincentxian@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person2.body.token}`,
        name: 'first quiz',
        description: 'second quiz being tested',
      });
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/transfer`,
        {
          token: `${person1.body.token}`,
          userEmail: 'aarnavsample@gmail.com',
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('///////Testing /v1/admin/quiz/question/move////////', () => {
  const quizQuestion1Body = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: false,
      },
      {
        answer: 'King Charles',
        correct: true,
      },
    ],
  };
  const quizQuestion2Body = {
    question: 'second question?',
    duration: 2,
    points: 3,
    answers: [
      {
        answer: 'second answer',
        correct: false,
      },
      {
        answer: 'second real answer',
        correct: true,
      },
    ],
  };

  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'vincentxian@gmail.com',
      password: 'password1',
      nameFirst: 'vincent',
      nameLast: 'xian',
    });
    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });
    quizQuestion1 = postRequest(
      `/v1/admin/quiz/${quiz1.body.quizId}/question`,
      {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1Body,
      }
    );
  });

  describe('Testing /v1/admin/quiz/question/move success cases', () => {
    test('Success move 1st question in middle of 3 question', () => {
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );
      const quizQuestion3 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion2.body.questionId}/duplicate`,
        {
          token: `${person1.body.token}`,
        }
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${person1.body.token}`,
          newPosition: 1,
        }
      );
      result2 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 3,
        questions: [
          {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion3.body.newQuestionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 8,
      });
    });
  });
  describe('Testing /v1/admin/quiz/question/move error cases', () => {
    beforeEach(() => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
    });
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${'1'}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${'le1!!'}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${sessionId}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/question/${
          quizQuestion1.body.questionId
        }/move`,
        {
          token: `${person1.body.token}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${person2.body.token}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );

      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion2.body.questionId}/move`,
        {
          token: `${person1.body.token}`,
          newPosition: 1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is less than 0', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${person1.body.token}`,
          newPosition: -1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is greater than n-1 where n is the number of questions', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${person1.body.token}`,
          newPosition: 2,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is the position of the current question', () => {
      result1 = putRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/move`,
        {
          token: `${person1.body.token}`,
          newPosition: 0,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('///////Testing /v1/admin/quiz/question/duplicate////////', () => {
  const quizQuestion1Body = {
    question: 'Who is the Monarch of England?',
    duration: 4,
    points: 5,
    answers: [
      {
        answer: 'Prince Charles',
        correct: false,
      },
      {
        answer: 'King Charles',
        correct: true,
      },
    ],
  };
  const quizQuestion2Body = {
    question: 'second question?',
    duration: 2,
    points: 3,
    answers: [
      {
        answer: 'second answer',
        correct: false,
      },
      {
        answer: 'second real answer',
        correct: true,
      },
    ],
  };

  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'vincentxian@gmail.com',
      password: 'password1',
      nameFirst: 'vincent',
      nameLast: 'xian',
    });
    quiz1 = postRequest('/v1/admin/quiz', {
      token: `${person1.body.token}`,
      name: 'first quiz',
      description: 'first quiz being tested',
    });
    quizQuestion1 = postRequest(
      `/v1/admin/quiz/${quiz1.body.quizId}/question`,
      {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1Body,
      }
    );
  });

  describe('Testing /v1/admin/quiz/question/duplicate success cases', () => {
    test('Success duplicating 1st question with 1 quiz 2 question', () => {
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/duplicate`,
        {
          token: `${person1.body.token}`,
        }
      );
      result2 = getRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(quizQuestion3.body).toStrictEqual({
        newQuestionId: expect.any(Number),
      });
      expect(quizQuestion3.status).toBe(OK);

      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 3,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion3.body.newQuestionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 10,
      });
    });
    test('Success duplicating 1st question of 2nd quiz with 1 question', () => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );
      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/question/${quizQuestion2.body.questionId}/duplicate`,
        {
          token: `${person1.body.token}`,
        }
      );
      result2 = getRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}?token=${person1.body.token}`,
        {}
      );
      expect(quizQuestion3.body).toStrictEqual({
        newQuestionId: expect.any(Number),
      });
      expect(quizQuestion3.status).toBe(OK);
      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz2.body.quizId,
        name: 'second quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz being tested',
        numQuestions: 2,
        questions: [
          {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion3.body.newQuestionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 4,
      });
    });
  });

  describe('Testing /v1/admin/quiz/question/duplicate error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/duplicate`,
        {
          token: `${'1'}`,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/duplicate`,
        {
          token: `${'let!!'}`,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${sessionId}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/question/${
          quizQuestion1.body.questionId
        }/duplicate`,
        {
          token: `${person1.body.token}`,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = postRequest('/v1/admin/auth/register', {
        email: 'aarnavsample@gmail.com',
        password: 'Abcd12345',
        nameFirst: 'aarnav',
        nameLast: 'sheth',
      });

      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion1.body.questionId}/duplicate`,
        {
          token: `${person2.body.token}`,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: `${person1.body.token}`,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      quizQuestion2 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion2Body,
        }
      );

      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/question/${quizQuestion2.body.questionId}/duplicate`,
        {
          token: `${person1.body.token}`,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////Testing v1/admin/quiz/:quizid/restore////////', () => {
  beforeEach(() => {
    person1 = postRequest('/v1/admin/auth/register', {
      email: 'manan.j2450@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'Manan',
      nameLast: 'Jaiswal',
    });
    person2 = postRequest('/v1/admin/auth/register', {
      email: 'test@gmail.com',
      password: 'Abcd12345',
      nameFirst: 'Fake',
      nameLast: 'Name',
    });
  });
  describe('Testing v1/admin/quiz/:quizid/restore success cases', () => {
    beforeEach(() => {
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      quiz2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      quiz3 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'third quiz',
        description: 'second quiz being tested',
      });
      deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
    });
    test('Testing successful restoration of 1 quiz', () => {
      const sessionId = person1.body.token;
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/restore`,
        { token: sessionId }
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
    });
    test('Testing successful restoration of 2 quiz', () => {
      const sessionId = person1.body.token;
      deleteRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}?token=${sessionId}`,
        {}
      );
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/restore`,
        { token: sessionId }
      );
      const result2 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/restore`,
        { token: sessionId }
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({});
      expect(result2.status).toStrictEqual(OK);
    });
  });
  describe('Testing v1/admin/quiz/:quizid/restore error cases', () => {
    beforeEach(() => {
      quiz1 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'first quiz',
        description: 'first quiz being tested',
      });
      deleteRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}?token=${person1.body.token}`,
        {}
      );
    });
    test('CASE (400): Quiz id does not refer to a valid quiz', () => {
      const sessionId = person1.body.token;
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/restore`,
        { token: sessionId }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id does not refer to a valid quiz that this user owns', () => {
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/restore`,
        { token: person2.body.token }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id refers to a quiz that is not currently in trash', () => {
      quiz2 = postRequest('/v1/admin/quiz', {
        token: person1.body.token,
        name: 'second quiz',
        description: 'second quiz being tested',
      });
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz2.body.quizId}/restore`,
        { token: person1.body.token }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (401): Token is not a valid structure', () => {
      const result1 = postRequest('/v1/admin/quiz/1111/restore', {
        token: '1234_',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (403): Provided token is a valid structure but not for logged in session', () => {
      const result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId}/restore`,
        { token: `${parseInt(person1.body.token) - 1}` }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});
