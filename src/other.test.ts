import { clear } from './other';
import { adminAuthRegister } from './auth';
import { adminQuizCreate, adminQuizInfo, adminQuizList } from './quiz';

describe('////////TESTING CLEAR////////', () => {
  test('test clear() returns {}', () => {
    expect(clear()).toStrictEqual({});
  });

  let person1;
  let quizIds;
  test('test clear() using adminQuizInfo', () => {
    person1 = adminAuthRegister('manan.j2450@gmail.com', 'Abcd1234', 'Manan', 'Jaiswal');
    quizIds = adminQuizCreate(person1.authUserId, 'COMP1531', 'Software Engineering');
    const quizId = quizIds.quizId;

    clear();
    expect(adminQuizInfo(person1.authUserId, quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('test clear() using adminQuizList', () => {
    person1 = adminAuthRegister('manan.j2450@gmail.com', 'Abcd1234', 'Manan', 'Jaiswal');
    quizIds = adminQuizCreate(person1.authUserId, 'COMP1531', 'Software Engineering');
    clear();
    expect(adminQuizList(person1.authUserId)).toStrictEqual({ error: expect.any(String) });
  });
});
