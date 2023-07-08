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
  // return JSON.parse(res.body.toString());
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

function deleteRequest(route: string, qs: any) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs });
  // return JSON.parse(res.body.toString());
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

let result1: any;
let result2: any;
let person1: any;
let person2: any;

function getRequest(route: string, qs: any) {
  const res = request('GET', `${SERVER_URL}${route}`, { qs: qs });
  // return JSON.parse(res.body.toString());
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

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
      expect(result1.body).toStrictEqual({
        token: expect.any(String)
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
        token: expect.any(String)
      });
      expect(result1.status).toBe(OK);
    });

    test('testing whether email address is case sensitive', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'MANAN.j2450@gmail.com',
        password: 'Abcd12345',
      });
      expect(result1.body).toStrictEqual({
        token: expect.any(String)
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
        token: expect.any(String)
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
        token: expect.any(String)
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
    test('CASE: Email address does not exist', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'unregisteredemail@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is incorrect: Differing cases', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'abcd12345',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is incorrect: Differing password', () => {
      result1 = postRequest('/v1/admin/auth/login', {
        email: 'manan.j2450@gmail.com',
        password: 'incorrectpW1234',
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Password is incorrect: Differing cases', () => {
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
      result1 = getRequest('/v1/admin/user/details', { sessionId: person1.body.token });
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
      result1 = getRequest('/v1/admin/user/details', { sessionId: person2.body.token });
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
        result1 = getRequest('/v1/admin/user/details', { sessionId: 1});
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(UNAUTHORISED);
      });
      test('CASE (401): Token is not a valid structure - special symbols', () => {
        result1 = getRequest('/v1/admin/user/details', { sessionId: 'lett!'});
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
        result1 = getRequest('/v1/admin/user/details', { sessionId: sessionId + 1});
        expect(result1.body).toStrictEqual({ error: expect.any(String) });
        expect(result1.status).toBe(FORBIDDEN);
      });
    });

  });
});
// //IDK WHAT IM DOING
// describe('TESTING v1/admin/quiz', () => {

//   beforeEach(() => {
//       person1 = postRequest('/v1/admin/auth/register', {
//       email: 'aarnavsample@gmail.com',
//       password: 'Abcd12345',
//       nameFirst: 'aarnav',
//       nameLast: 'sheth',
//     });
//   });

//   describe('SUCCESS CASES', () => {
//     test('Successful adminQuizCreate 1 quiz', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       expect(result1.body).toStrictEqual({ quizId: expect.any(Number) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });

//   describe('ERROR CASES', () => {
//     test('CASE: AuthUserId is not a valid user', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId + 1, //not sure if this is right
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       expect(result1.body).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: not alpahnumeric name', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: '*not^lph+',
//         description: 'first quiz being tested',
//       });
//       expect(result1.body).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
    
//     test('CASE: name is less than 3 or more than 30 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'first quiz being tested',
//       });
//       expect(result1.body).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: name is already used for a quiz by user', () => {
//       postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz', 
//         description: 'first quiz being tested',
//       });
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz', 
//         description: 'first quiz being tested again',
//       });
//       expect(result1.body).toStrictEqual({ error: expect.any(String) });
//     });

//     test('CASE: description is more than 100 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV',
//       });
//       expect(result1.body).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });
// });

// describe('TESTING v1/admin/quiz', () => {

//   beforeEach(() => {
//       person1 = postRequest('/v1/admin/auth/register', {
//       email: 'aarnavsample@gmail.com',
//       password: 'Abcd12345',
//       nameFirst: 'aarnav',
//       nameLast: 'sheth',
//     });
//   });

//   describe('SUCCESS CASES', () => {
//     test('Successful adminQuizCreate 1 quiz', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ quizId: expect.any(Number) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });

//   describe('ERROR CASES', () => {
//     test('CASE: AuthUserId is not a valid user', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId + 1, //not sure if this is right
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: not alpahnumeric name', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: '*not^lph+',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
    
//     test('CASE: name is less than 3 or more than 30 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: name is already used for a quiz by user', () => {
//       postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz', 
//         description: 'first quiz being tested again',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: description is more than 100 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });
// });

// describe('TESTING v1/admin/quiz/list', () => {

//   beforeEach(() => {
//       person1 = postRequest('/v1/admin/auth/register', {
//       email: 'aarnavsample@gmail.com',
//       password: 'Abcd12345',
//       nameFirst: 'aarnav',
//       nameLast: 'sheth',
//     });
//   });

//   describe('SUCCESS CASES', () => {
//     test('Successful adminQuizCreate 1 quiz', () => {
//       postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });

//       getRequest('/v1/admin/quiz/list', { })

//       expect(result1).toStrictEqual({ quizId: expect.any(Number) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });

//   describe('ERROR CASES', () => {
//     test('CASE: AuthUserId is not a valid user', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId + 1, //not sure if this is right
//         name: 'first quiz',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: not alpahnumeric name', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: '*not^lph+',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
    
//     test('CASE: name is less than 3 or more than 30 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'first quiz being tested',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });

//     test('CASE: name is already used for a quiz by user', () => {
//       postRequest('/v1/admin/quiz/list', {
//         authUserId: person1.authUserId,
//         name: 'first quiz', 
//         description: 'first quiz being tested',
//       });
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'first quiz', 
//         description: 'first quiz being tested again',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//     });

//     test('CASE: description is more than 100 characters', () => {
//       const result1 = postRequest('/v1/admin/quiz', {
//         authUserId: person1.authUserId,
//         name: 'as',
//         description: 'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV',
//       });
//       expect(result1).toStrictEqual({ error: expect.any(String) });
//       // expect(result1.statusCode).toBe(OK);
//     });
//   });
// });
