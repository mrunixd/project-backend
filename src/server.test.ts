import request from 'sync-request';
import config from './config.json';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

function post(route: string, json: any) {
    const res = request('POST', `${SERVER_URL}${route}`, {json: json });
    return JSON.parse(res.body.toString());
}

describe('TESTING v1/admin/auth/register', () => {
  describe('SUCCESS CASES', () => {
    test('Successful adminAuthRegister 1 person', () => {
        const result1 = post("/v1/admin/auth/register", {email: 'vincent@gmail.com', password: 'password1', nameFirst: 'vincent', nameLast: 'xian'});
        expect(result1).toStrictEqual({authUserId: expect.any(Number)});
        // expect(result1.statusCode).toBe(OK);
      });
  });
});


