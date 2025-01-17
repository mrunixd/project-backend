import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

let person1 = requestAdminAuthRegister(
  'aarnavsample@gmail.com',
  'Abcd12345',
  'aarnav',
  'sheth'
);
describe('//////// Testing v2/admin/quiz/ create////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'aarnavsample@gmail.com',
      'Abcd12345',
      'aarnav',
      'sheth'
    );
  });

  describe('Testing /v2/admin/quiz success cases', () => {
    test('Successful adminQuizCreate 1 quiz', () => {
      const result1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      expect(result1.body).toStrictEqual({ quizId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/ error cases', () => {
    test('CASE: not alpahnumeric name', () => {
      const result1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        '*not^lph+',
        'first quiz being tested'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is less than 3 or more than 30 characters', () => {
      const result1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'as',
        'first quiz being tested'
      );
      const result2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'this is going to be a lot more than 30 characters',
        'first quiz being tested'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE: name is already used for a quiz by user', () => {
      requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      const result1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested again'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: description is more than 100 characters', () => {
      const result1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
