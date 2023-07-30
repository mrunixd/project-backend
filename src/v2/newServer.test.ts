import request from 'sync-request';
import config from './config.json';
import { IncomingHttpHeaders } from 'http';

export const OK = 200;
export const INPUT_ERROR = 400;
export const UNAUTHORISED = 401;
export const FORBIDDEN = 403;
export const port = config.port;
export const url = config.url;
export const SERVER_URL = `${url}:${port}`;

function postRequest(route: string, json: any, headers: IncomingHttpHeaders = {}) {
  const res = request('POST', `${SERVER_URL}${route}`, { json: json, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

function deleteRequest(route: string, qs: any, headers: IncomingHttpHeaders = {}) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

function putRequest(route: string, json: any, headers: IncomingHttpHeaders = {}) {
  const res = request('PUT', `${SERVER_URL}${route}`, { json: json, headers: headers });
  console.log(res.body);

  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

function getRequest(route: string, qs: any, headers: IncomingHttpHeaders = {}) {
  const res = request('GET', `${SERVER_URL}${route}`, { qs: qs, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const response = postRequest('/v1/admin/auth/register', { email, password, nameFirst, nameLast });
  return response;
}

export function requestAdminAuthLogin(email: string, password: string) {
  const response = postRequest('/v1/admin/auth/login', { email, password });
  return response;
}

export function requestAdminUserDetails(token: string) {
  const response = getRequest('/v2/admin/user/details', {}, { token });
  return response;
}

export function requestAdminAuthLogout(token: string) {
  const response = postRequest('/v2/admin/auth/logout', {}, { token });
  return response;
}

export function requestAdminAuthUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string) {
  const response = putRequest('/v2/admin/user/details', { email, nameFirst, nameLast }, { token });
  return response;
}

export function requestAdminAuthUpdatePassword(token: string, oldPassword: string, newPassword: string) {
  const response = putRequest('/v2/admin/user/password', { oldPassword, newPassword }, { token });
  return response;
}

export function requestAdminQuizCreate(token: string, name: string, description: string) {
  const response = postRequest('/v2/admin/quiz', { name, description }, { token });
  return response;
}

export function requestAdminQuizList(token: string) {
  const response = getRequest('/v2/admin/quiz/list', {}, { token });
  return response;
}

export function requestAdminQuizDelete(quizId: string, token: string) {
  const response = deleteRequest(`/v2/admin/quiz/${quizId}`, {}, { token });
  return response;
}

export function requestAdminQuizInfo(quizId: string, token: string) {
  const response = getRequest(`/v2/admin/quiz/${quizId}`, {}, { token });
  return response;
}

export function requestAdminQuizNameUpdate(quizId: string, token: string, name: string) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/name`, { name }, { token });
  return response;
}

export function requestAdminQuizDescriptionUpdate(quizId: string, token: string, description: string) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/description`, { description }, { token });
  return response;
}

export function requestAdminQuizTrashList(token: string) {
  const response = getRequest('/v2/admin/quiz/trash', {}, { token });
  return response;
}

export function requestAdminQuizRestore(quizId: string, token: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/restore`, {}, { token });
  return response;
}

export function requestAdminQuizTrashEmpty(token: string, quizIds: string) {
  const response = deleteRequest('/v2/admin/quiz/trash/empty', { quizIds }, { token });
  return response;
}

export function requestAdminQuizTransfer(quizId: string, token: string, userEmail: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/transfer`, { userEmail }, { token });
  return response;
}

export function requestAdminQuizQuestion(quizId: string, token: string, questionBody: any) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/question`, { questionBody }, { token });
  return response;
}

export function requestAdminQuizQuestionUpdate(quizId: string, questionId: string, token: string, questionBody: any) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/question/${questionId}`, { questionBody }, { token });
  return response;
}

export function requestAdminQuizQuestionMove(quizId: string, questionId: string, token: string, newPosition: number) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition }, { token });
  return response;
}

export function requestAdminQuizQuestionDuplicate(quizId: string, questionId: string, token: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token });
  return response;
}

export function requestAdminQuizQuestionDelete(quizId: string, questionId: string, token: string) {
  const response = deleteRequest(`/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token });
  return response;
}

export function requestAdminQuizSessionStart(token: string, quizId: string, autoStartNum: number) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, { token });
  return response;
}

export function requestAdminQuizSessionUpdate(token: string, quizId: string, sessionId: string, action: string) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/session/${sessionId}`, { action }, { token });
  return response;
}

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
let session1: any;
let session2: any;
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
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
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
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/PI_Analytics_Instagram_Competitors_Report.png'
};

/// /////////////////////////////////////////////////////////
/// /EVERYTHING ABOVE NEEDS TO BE PORTED TO A HELPER FILE////
/// /////////////////////////////////////////////////////////

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
  session1 = undefined;
  session2 = undefined;
});
describe('////////TESTING v1/clear////////', () => {
  test('test clear() returns {}', () => {
    result1 = deleteRequest('/v1/clear', {});
    expect(result1.body).toStrictEqual({});
  });
});

describe('////////TESTING v1/admin/auth/register////////', () => {
  describe('Testing v1/admin/auth/register success', () => {
    test('Successful adminAuthRegister 1 person', () => {
      result1 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      expect(result1.body).toStrictEqual({
        token: expect.any(String),
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing v1/admin/auth/register errors', () => {
    test('CASE: Email address is already in use - same email in caps', () => {
      requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
      result2 = requestAdminAuthRegister('Vincentxian@gmail.com', 'vincentpassword1', 'vincent', 'xian');
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: Email address is already in use - same email exactly', () => {
      requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpassword1', 'vincent', 'xian');
      result2 = requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpassword1', 'vincent', 'xian');
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: Email address is invalid', () => {
      result1 = requestAdminAuthRegister('vincent123', 'vincentpassword1', 'vincent', 'xian');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is is invalid', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpassword1', '!!!', 'xian');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpassword1', 'v', 'xian');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is is invalid', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpasswor1', 'vincent', '!!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'vincentpassword1', 'vincent', 'x');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is less than 8 characters', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'pass', 'vincent', 'xian');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password does not contain at least one number and at least one letter', () => {
      result1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password', 'vincent', 'xian');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////TESTING v1/admin/auth/login////////', () => {
  describe('Testing v1/admin/auth/login success', () => {
    beforeEach(() => {
      requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
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
      requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
    });
    test('CASE (400): Email address does not exist', () => {
      result1 = requestAdminAuthLogin('unregisteredemail@gmail.com', 'incorrectpW1234');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'abcd12345');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing password', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'incorrectpW1234');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Password is incorrect: Differing cases', () => {
      result1 = requestAdminAuthLogin('manan.j2450@gmail.com', 'incorrectpW1234');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////TESTING /v2/admin/user/details////////', () => {
  describe('Testing /v2/admin/user/details success', () => {
    test('CASE: Successful self check', () => {
      person1 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
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
      requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'abcd1234', 'Manan', 'Jaiswal');
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
        person1 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
        const sessionId = parseInt(person1.body.token) + 1;
        result1 = requestAdminUserDetails(`${sessionId}`);
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(FORBIDDEN);
      });
    });
  });
});

describe('////////TESTING v2/admin/quiz/list////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
  });

  describe('SUCCESS CASES', () => {
    test('Successful adminQuizList 1 quiz', () => {
      const quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizList(`${person1.body.token}`);

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
      result1 = requestAdminQuizList(`${person1.body.token}`);
      expect(result1.body).toStrictEqual({ quizzes: [] });
      expect(result1.status).toBe(OK);
    });

    test('Successful Multiple quiz display', () => {
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      quiz3 = requestAdminQuizCreate(`${person1.body.token}`, 'third quiz', 'third quiz being tested');

      result1 = requestAdminQuizList(`${person1.body.token}`);
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
      result1 = requestAdminQuizList(`${1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizList('let!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizList(`${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('//////// Testing v2/admin/quiz/ create////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
  });

  describe('Testing /v2/admin/quiz success cases', () => {
    test('Successful adminQuizCreate 1 quiz', () => {
      result1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ quizId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/ error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizCreate('1', 'first quiz', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizCreate('let!!', 'first quiz', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizCreate(`${sessionId}`, 'first quiz', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: not alpahnumeric name', () => {
      result1 = requestAdminQuizCreate(`${person1.body.token}`, '*not^lph+', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is less than 3 or more than 30 characters', () => {
      result1 = requestAdminQuizCreate(`${person1.body.token}`, 'as', 'first quiz being tested');
      result2 = requestAdminQuizCreate(`${person1.body.token}`, 'this is going to be a lot more than 30 characters', 'first quiz being tested');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is already used for a quiz by user', () => {
      requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      result1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested again');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: description is more than 100 characters', () => {
      result1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('///////Testing /v2/admin/quiz/delete////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
  });
  describe('Testing /v2/admin/quiz/ delete success cases', () => {
    test('Successful deletion of quiz', () => {
      const quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      const result2 = requestAdminQuizList(`${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      expect(result2.body).toStrictEqual({ quizzes: [] });
    });

    test('Successful deletion of quiz amongst quizzes', () => {
      const quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      const quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      const result2 = requestAdminQuizList(`${sessionId}`);
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
  describe('Testing /v2/admin/quiz/ delete error cases', () => {
    beforeEach(() => {
      person2 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
      result2 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    });
    test('CASE (400): Quiz Id does not refer to a valid quiz', () => {
      const result1 = requestAdminQuizDelete(`${result2.body.quizId - 1}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE (400): Quiz Id does not refer to a valid quiz that a user owns', () => {
      const result1 = requestAdminQuizDelete(`${result2.body.quizId}`, `${person2.body.token}`);
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });

    test('CASE(401): Token is not valid structure', () => {
      const result1 = requestAdminQuizDelete(`${result2.body.quizId}`, 'hello1234');
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });

    test('CASE(403): Provided token is of valid structure but no logged session', () => {
      const result1 = requestAdminQuizDelete(`${result2.body.quizId}`, '12345');
      expect(result1.body).toStrictEqual({
        error: expect.any(String),
      });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});

describe('///////Testing /v2/admin/quiz/ info////////', () => {
  describe('Testing /v2/admin/quiz/ info success cases', () => {
    test('Success info 1 person 1 quiz 0 questions', () => {
      person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
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
        thumbnailUrl: ''
      });
    });

    test('Success info 1 person 1 quiz 2 questions', () => {
      person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
      quizQuestion2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);

      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 6,
        thumbnailUrl: ''
      });
    });
  });
  describe('Testing /v2/admin/quiz/ info error cases', () => {
    beforeEach(() => {
      person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    });

    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, 'lett!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId + 1}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person2.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('/////// TESTING v2/admin/quiz/name ///////', () => {
  describe('/////// Testing v2/admin/quiz/name success', () => {
    test('CASE: Successful adminQuizNameUpdate', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'newQuizName');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizList(`${person1.body.token}`);

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

  describe('/////// Testing v2/admin/quiz/name error', () => {
    test('CASE: quizId does not refer to a valid quiz', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId + 1}`, `${person1.body.token}`, 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quizId does not refer to a quiz that this user owns', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      person2 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person2.body.token}`, 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name contains invalid characters', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, '%!@#!%');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is less than 3 characters long', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'ne');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is more than 30 characters long', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Name is already used in the current logged in user for another quiz', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'existingQuiz', 'A pre-existing quiz with the name "existingQuiz".');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'existingQuiz');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Token is not a valid structure - too short', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${1}`, 'newName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - non-numeric characters', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, 'let!!', 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - too long', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${12121322}`, 'NewQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizNameUpdate(`${quiz1.body.quizId}`, `${12345}`, 'NewQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('/////// TESTING v2/admin/quiz/description ///////', () => {
  describe('//////// Testing v2/admin/quiz/description success ////////', () => {
    test('CASE: Successful adminQuizDescriptionUpdate', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'newDescriptionToBeChangedTo');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

      expect(result2.body).toMatchObject({
        description: 'newDescriptionToBeChangedTo',
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing v2/admin/quiz/description error(s)', () => {
    // Status 401
    test('CASE: Token is not a valid structure - too short', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, '1424', 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - too long', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, '142324', 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE: Token is not a valid structure - special characters', () => {
      person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

      result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, 'd@421', 'newQuizName');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });
  });

  // Status 403
  test('CASE: Provided token is valid structure, but is not for a currently logged in session', () => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

    result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, '12345', 'newDescription');

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(FORBIDDEN);
  });

  // Status 400
  test('CASE: quizId does not refer to a valid quiz', () => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

    result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId + 1}`, `${person1.body.token}`, 'newDescription');

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: quizId does not refer to a quiz that this user owns', () => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

    person2 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');

    result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, `${person2.body.token}`, 'newDescription');

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: Description is longer than 100 characters', () => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

    result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, 'zhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhzh');

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });

  test('CASE: More than 100 empty spaces', () => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');

    result1 = requestAdminQuizDescriptionUpdate(`${quiz1.body.quizId}`, `${person1.body.token}`, '                                                                                                      ');

    expect(result1.body).toStrictEqual({ error: expect.any(String) });
    expect(result1.status).toBe(INPUT_ERROR);
  });
});

describe('/////// /v2/admin/auth/logout ///////', () => {
  describe('/////// /v2/admin/auth/logout successful ///////', () => {
    test('CASE: Logout successful', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });

    test('CASE: Login, logout, login, logout success', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
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
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthLogout('1234');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - too long', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthLogout('123456');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token has invalid structure - non-numeric characters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthLogout('SP!@#');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): The token is for a user who has already logged out', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthLogout(person1.body.token);
      result2 = requestAdminAuthLogout(person1.body.token);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});

describe('/////// /v2/admin/user/details //////', () => {
  describe('////// adminAuthUpdateDetails runs ///////', () => {
    test('CASE(200): Updated details successfully', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'newEmail@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminUserDetails(person1.body.token);
      expect(result2.body).toMatchObject({
        user: {
          name: 'Vincent Xian',
          email: 'newEmail@gmail.com',
          numFailedPasswordsSinceLastLogin: expect.any(Number),
          numSuccessfulLogins: expect.any(Number),
          userId: expect.any(Number)
        }
      });
      expect(result2.status).toBe(OK);
    });

    test('CASE(200): Email is unchanged, other details change', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      person2 = requestAdminAuthRegister('vincentxian@gmail.com', 'Abcd12345', 'Vincent', 'Xian');

      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'zhizhao@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminUserDetails(person1.body.token);

      expect(result2.body).toMatchObject({
        user: {
          name: 'Vincent Xian',
          email: 'zhizhao@gmail.com',
          numFailedPasswordsSinceLastLogin: expect.any(Number),
          numSuccessfulLogins: expect.any(Number),
          userId: expect.any(Number)
        }
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('////// adminAuthUpdateDetails errors ///////', () => {
    test('CASE(400): Email is currently used for another user', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      person2 = requestAdminAuthRegister('vincentxian@gmail.com', 'Abcd12345', 'Vincent', 'Xian');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'Zhi', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Email is invalid', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'invalidemail', 'Zhi', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name contains forbidden characters - numbers', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', '12345', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name contains forbidden characters - special characters/symbols', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', '!@#$%', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name is either less than 2 characters or more than 20 characters long - too short', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'V', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): First name is either less than 2 characters or more than 20 characters long - too long', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'VincentVincentVincent', 'Zhao');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name contains forbidden characters - numbers', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'Zhi', '12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name contains forbidden characters - special characters/symbols', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'Zhi', '!@#$%');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name is either less than 2 characters or more than 20 characters long - too short', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'Zhi', 'Z');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): Last name is either less than 2 characters or more than 20 characters long - too long', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails(`${person1.body.token}`, 'vincentxian@gmail.com', 'Zhi', 'ZhaoZhaoZhaoZhaoZhaoZ');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(401): Token is invalid structure - too short', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails('1234', 'vincentxian@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is invalid structure - too long', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails('123456', 'vincentxian@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is invalid structure - special characters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails('!@#$%', 'vincentxian@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): Provided token is valid structure, but is not for a currently logged in session', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdateDetails('12345', 'vincentxian@gmail.com', 'Vincent', 'Xian');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('/////// /v2/admin/user/password ///////', () => {
  describe('/////// /v2/admin/user/password runs ///////', () => {
    test('CASE(200): adminAuthUpdatePassword runs successfully', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'Bcde12345');
      result2 = requestAdminAuthLogout(person1.body.token);
      result3 = requestAdminAuthLogin('zhizhao@gmail.com', 'Bcde12345');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({});
      expect(result2.status).toBe(OK);

      expect(result3.body).toStrictEqual({ token: expect.any(String) });
      expect(result3.status).toBe(OK);
    });
  });

  describe('/////// /v2/admin/user/password error ///////', () => {
    test('CASE(400): New password is not the correct old password', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'Abcd12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password has already been used before by this user - initial password', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'Bcde12345');
      result2 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Bcde12345', 'Abcd12345');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password has already been used before by this user - update password repeatedly', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'Bcde12345');
      result2 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Bcde12345', 'Cdef12345');
      result3 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Cdef12345', 'Bcde12345');

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({});
      expect(result2.status).toBe(OK);

      expect(result3.body).toStrictEqual({ error: expect.any(String) });
      expect(result3.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password is less than 8 characters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'Bcde123');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all letters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', 'aBcDeFgHi');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - all numbers', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', '123456789');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(400): New password does not contain at least one number and at least one letter - non-alphanumeric characters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword(`${person1.body.token}`, 'Abcd12345', '!@#$%^&*(');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE(401): Token is not a valid structure - too short', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword('1234', 'Abcd12345', 'Bcde12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - too long', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword('123456', 'Abcd12345', 'Bcde12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(401): Token is not a valid structure - special characters', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword('!@#$%', 'Abcd12345', 'Bcde12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE(403): Provided token is valid structure, but it not for a currently logged in session', () => {
      person1 = requestAdminAuthRegister('zhizhao@gmail.com', 'Abcd12345', 'Zhi', 'Zhao');
      result1 = requestAdminAuthUpdatePassword('12345', 'Abcd12345', 'Bcde12345');

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });
  });
});

describe('////////Testing v2/admin/quiz/trash////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
  });

  describe('Testing v2/admin/quiz/trash success cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      quiz3 = requestAdminQuizCreate(`${person1.body.token}`, 'third quiz', 'second quiz being tested');
    });
    test('successfully removing 1 quiz and viewing in trash', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      result1 = requestAdminQuizTrashList(`${sessionId}`);
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
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${sessionId}`);
      requestAdminQuizDelete(`${quiz2.body.quizId}`, `${sessionId}`);
      requestAdminQuizDelete(`${quiz3.body.quizId}`, `${sessionId}`);
      result1 = requestAdminQuizTrashList(`${sessionId}`);
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
      result1 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({
        quizzes: [],
      });
      expect(result1.status).toBe(OK);
    });
  });
  describe('Testing v2/admin/quiz/trash error cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    });
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      result1 = requestAdminQuizTrashList(`${parseInt(sessionId) - 1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizTrashList('hi!!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizTrashList('a1aaa');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
  });
});

describe('////////Testing v2/admin/quiz/:quizid/restore////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
    person2 = requestAdminAuthRegister('test@gmail.com', 'Abcd12345', 'Fake', 'Name');
  });
  describe('Testing v2/admin/quiz/:quizid/restore success cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      quiz3 = requestAdminQuizCreate(`${person1.body.token}`, 'third quiz', 'second quiz being tested');
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    });
    test('Testing successful restoration of 1 quiz', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
    });
    test('Testing successful restoration of 2 quiz', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz2.body.quizId}`, `${sessionId}`);
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);
      const result2 = requestAdminQuizRestore(`${quiz2.body.quizId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({});
      expect(result2.status).toStrictEqual(OK);
    });
    test('Testing successful restoration of 2 quiz', () => {
      const sessionId = person1.body.token;
      requestAdminQuizDelete(`${quiz3.body.quizId}`, `${sessionId}`);
      requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);

      const result1 = requestAdminQuizRestore(`${quiz3.body.quizId}`, `${sessionId}`);
      const result2 = requestAdminQuizTrashList(`${sessionId}`);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({ quizzes: [] });
      expect(result2.status).toStrictEqual(OK);
    });
  });
  describe('Testing v2/admin/quiz/:quizid/restore error cases', () => {
    beforeEach(() => {
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    });
    test('CASE (400): Quiz id does not refer to a valid quiz', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId + 1}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id does not refer to a valid quiz that this user owns', () => {
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, `${person2.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz id refers to a quiz that is not currently in trash', () => {
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      const result1 = requestAdminQuizRestore(`${quiz2.body.quizId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (401): Token is not a valid structure', () => {
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, 'let!!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (403): Provided token is a valid structure but not for logged in session', () => {
      const result1 = requestAdminQuizRestore(`${quiz1.body.quizId}`, `${parseInt(person1.body.token) - 1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});

describe('////////Testing /v2/admin/quiz/trash/empty', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
    person2 = requestAdminAuthRegister('test@gmail.com', 'Abcd12345', 'Fake', 'Name');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
    quiz3 = requestAdminQuizCreate(`${person1.body.token}`, 'third quiz', 'second quiz being tested');
    requestAdminQuizDelete(`${quiz1.body.quizId}`, `${person1.body.token}`);
    requestAdminQuizDelete(`${quiz2.body.quizId}`, `${person1.body.token}`);
    requestAdminQuizDelete(`${quiz3.body.quizId}`, `${person1.body.token}`);
  });
  describe('Testing /v2/admin/quiz/trash/empty success cases', () => {
    test('testing successful deletion of 1 quiz in trash', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizTrashEmpty(`${sessionId}`, `[${quiz1.body.quizId}]`);
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result2.body).toStrictEqual({
        quizzes: [
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
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
    });
    test('testing successful deletion of 2 quiz in trash', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizTrashEmpty(`${sessionId}`, `[${quiz1.body.quizId},${quiz2.body.quizId}]`);
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toStrictEqual(OK);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: quiz3.body.quizId,
            name: 'third quiz',
          },
        ],
      });
    });
  });
  describe('Testing /v2/admin/quiz/trash/empty error cases', () => {
    test('CASE (400): One or more of the QuizIDs is not a valid quiz', () => {
      const sessionId = person1.body.token;
      const result1 = requestAdminQuizTrashEmpty(`${sessionId}`, `[${quiz1.body.quizId - 15},${quiz2.body.quizId}]`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): One or more of the QuizIDs refers to a quiz that this current user does not own', () => {
      const result1 = requestAdminQuizTrashEmpty(`${person2.body.token}`, `[${quiz1.body.quizId},${quiz2.body.quizId}]`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): One or more of the QuizIDs is not currently in trash', () => {
      const sessionId = person1.body.token;

      requestAdminQuizRestore(`${quiz1.body.quizId}`, `${sessionId}`);
      const result1 = requestAdminQuizTrashEmpty(`${person2.body.token}`, `[${quiz1.body.quizId}]`);
      const result2 = requestAdminQuizTrashList(`${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
      expect(result2.body).toStrictEqual({
        quizzes: [
          {
            quizId: 1,
            name: 'second quiz',
          },
          {
            quizId: 2,
            name: 'third quiz',
          },
        ],
      });
    });
    test('CASE (401): Token is not a valid structure', () => {
      const result1 = requestAdminQuizTrashEmpty('111a1', `[${quiz1.body.quizId},${quiz2.body.quizId}]`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (403): Provided token is a valid structure, but is not for a currently logged in session', () => {
      const result1 = requestAdminQuizTrashEmpty(`${person1.body.token - 1}`, `[${quiz1.body.quizId},${quiz2.body.quizId}]`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
  });
});

describe('///////Testing /v2/admin/quiz/transfer////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    person2 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('Testing /v2/admin/quiz/question/transfer success cases', () => {
    test('move quiz to 2nd person who already has a quiz', () => {
      quiz2 = requestAdminQuizCreate(`${person2.body.token}`, 'second quiz', 'second quiz being tested');
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person1.body.token}`, 'aarnavsample@gmail.com');

      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person2.body.token}`);
      const result3 = requestAdminQuizInfo(`${quiz2.body.quizId}`, `${person2.body.token}`);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
          },
        ],
        duration: 4,
        thumbnailUrl: ''
      });
      expect(result3.body).toStrictEqual({
        quizId: quiz2.body.quizId,
        name: 'second quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: ''
      });
    });

    test('duplicate 1st question after transfer to 2nd person', () => {
      quizQuestion2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);

      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person1.body.token}`, 'aarnavsample@gmail.com');

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person2.body.token}`);
      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person2.body.token}`);
      const result3 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 10,
        thumbnailUrl: ''
      });
    });
  });
  describe('Testing /v2/admin/quiz/transfer error cases', () => {
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${'le1!!'}`, 'aarnavsample@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Provided token is valid structure, but is not for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${sessionId}`, 'aarnavsample@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId + 1}`, `${person1.body.token}`, 'aarnavsample@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person2.body.token}`, 'manan.j2450@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is not a real user', () => {
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person1.body.token}`, 'fakeEmail');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is the current logged in user', () => {
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person1.body.token}`, 'vincentxian@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      quiz2 = requestAdminQuizCreate(`${person2.body.token}`, 'first quiz', 'second quiz being tested');
      result1 = requestAdminQuizTransfer(`${quiz1.body.quizId}`, `${person1.body.token}`, 'aarnavsample@gmail.com');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////Testing v2/admin/quiz/{quizid}/question//////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
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

  describe('Testing /v2/admin/quiz/{quizid}/question success cases', () => {
    test('Successful adminQuizQuestionCreate 1 quiz question', () => {
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ questionId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/{quizid}/question error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, '1', quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, 'let!!', quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${sessionId}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: quiz does not exist', () => {
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId + 1}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      person2 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person2.body.token}`, quizQuestion1);
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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);

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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      };
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      };
      result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////Testing v2/admin/quiz/{quizid}/question/update //////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('Testing /v2/admin/quiz/{quizid}/question/{questionid} success cases', () => {
    test('Successful adminQuizCreate 1 quiz question update', () => {
      const quizQuestion3Body = {
        question: 'Who was the Monarch of England?',
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who was the Monarch of England?',
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
          },
        ],
        duration: 4,
        thumbnailUrl: ''
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/{quizid}/question error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, '1', quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, 'let!!', quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${sessionId}`, quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: quiz does not exist', () => {
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId + 1}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      person2 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person2.body.token}`, quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz question does not exist for quiz', () => {
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId + 1}`, `${person1.body.token}`, quizQuestion1Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      const quizQuestion3Body = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duration is not a positive number', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: total duration is more than 3 minutes', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: points awarded are more than 10 or less than 1', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: answer strings are less than 1 or greater than 30', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duplicate answers', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: no correct answers', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Hompage_Integrations-Grid@x2.png'
      };
      result1 = requestAdminQuizQuestionUpdate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('////////TESTING ADMINQUIZQUESTIONDELETE////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('Success cases', () => {
    test('CASE: Successful delete 1 quiz question', () => {
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: ''
      });
    });

    test('CASE: Successful delete 1 out of 2 questions', () => {
      const quizQuestion2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 2,
        thumbnailUrl: ''
      });
    });
  });

  describe('Error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${11_11}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: Quiz ID does not exist', () => {
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId + 1}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person2.body.token}`);

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Question ID does not refer to a valid quesion within this quiz', () => {
      result1 = requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId + 1}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('///////Testing /v2/admin/quiz/question/move////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('Testing /v2/admin/quiz/question/move success cases', () => {
    test('Success move 1st question in middle of 3 question', () => {
      quizQuestion2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion2.body.questionId}`, `${person1.body.token}`);

      const expectedTime = Math.floor(Date.now() / 1000);
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, 1);
      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 8,
        thumbnailUrl: ''
      });
    });
  });
  describe('Testing /v2/admin/quiz/question/move error cases', () => {
    beforeEach(() => {
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
    });
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${'1'}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${'le1!!'}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${sessionId}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId + 1}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person2.body.token}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quizQuestion2 = requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);

      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion2.body.questionId}`, `${person1.body.token}`, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is less than 0', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, -1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is greater than n-1 where n is the number of questions', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, 2);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is the position of the current question', () => {
      result1 = requestAdminQuizQuestionMove(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`, 0);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('///////Testing /v2/admin/quiz/question/duplicate////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('Testing /v2/admin/quiz/question/duplicate success cases', () => {
    test('Success duplicating 1st question with 1 quiz 2 question', () => {
      quizQuestion2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      result2 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 10,
        thumbnailUrl: ''
      });
    });
    test('Success duplicating 1st question of 2nd quiz with 1 question', () => {
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      quizQuestion2 = requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);
      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(`${quiz2.body.quizId}`, `${quizQuestion2.body.questionId}`, `${person1.body.token}`);
      result2 = requestAdminQuizInfo(`${quiz2.body.quizId}`, `${person1.body.token}`);
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl
          },
        ],
        duration: 4,
        thumbnailUrl: ''
      });
    });
  });

  describe('Testing /v2/admin/quiz/question/duplicate error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${'let!!'}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId + 1}`, `${quizQuestion1.body.questionId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId + 1}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');

      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person2.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quiz2 = requestAdminQuizCreate(`${person1.body.token}`, 'second quiz', 'second quiz being tested');
      quizQuestion2 = requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);

      result1 = requestAdminQuizQuestionDuplicate(`${quiz1.body.quizId}`, `${quizQuestion2.body.questionId}`, `${person1.body.token}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/start ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/start success', () => {
    test('CASE: Successful sessionStart with 1 quiz 1 user with autoStartNum 3', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });

    test('CASE: Successful 3rd quiz owned by 2nd user with autoStartNum 10', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');
      quiz2 = requestAdminQuizCreate(`${person2.body.token}`, 'second quiz', 'second quiz being tested');
      requestAdminQuizQuestion(`${quiz2.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);
      quiz3 = requestAdminQuizCreate(`${person2.body.token}`, 'third quiz', 'third quiz being tested');
      requestAdminQuizQuestion(`${quiz3.body.quizId}`, `${person2.body.token}`, quizQuestion1Body);

      result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz3.body.quizId}`, 50);
      expect(result1.body).toStrictEqual({ sessionId: result1.body.sessionId });
      expect(result1.status).toBe(OK);
    });
  });
  describe('/////// Testing v1/admin/quiz/{quizid}/session/start errors', () => {
    test('CASE (403): provided token is a valid structure, but is not for a currently logged on session', () => {
      const sessionId = person1.body.token;
      result1 = requestAdminQuizSessionStart(`${parseInt(sessionId) - 1}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(FORBIDDEN);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStart('hi!!!', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (401): token is not valid structure', () => {
      result1 = requestAdminQuizSessionStart('a1aaa', `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(UNAUTHORISED);
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId + 1}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister('manan.j2450@gmail.com', 'Abcd12345', 'Manan', 'Jaiswal');

      result1 = requestAdminQuizSessionStart(`${person2.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): autoStartNum is a number greater than 50', () => {
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 51);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    /// /////////////////////////////////////////////////////////
    /// /more than 10 sessions not in END state currently exist//
    /// /////////////////////////////////////////////////////////
    test('CASE (400): The quiz does not have any questions in it', () => {
      requestAdminQuizQuestionDelete(`${quiz1.body.quizId}`, `${quizQuestion1.body.questionId}`, `${person1.body.token}`);
      result1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});

describe.only('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid} ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
  });

  describe('/////// Testing v1/admin/quiz/{quizid}/session/{sessionid} success', () => {
    test('CASE: success 1 quiz 1 session, single change', () => {
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });
    test('CASE: success 1 quiz 1 session, question automatically closes', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      result1 = requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'FINISH_COUNTDOWN');
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });
    ////////////////////////////////////////////////////////////
    ////more tests for when info is complete to check state/////
    ////////////////////////////////////////////////////////////
  });
});