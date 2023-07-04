import {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
} from './quiz';
import { adminAuthRegister, adminAuthLogin } from './auth';
import { clear } from './other';

let result1: any;
let result2: any;
let person1: any;
let person2: any;
//put your define here for quiz1 quiz2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

beforeEach(() => {
  clear();
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
});

describe('////////TESTING ADMINQUIZLIST////////', () => {
  describe('Testing adminQuizList errors', () => {
    test('CASE: AuthUserId is not a valid user', () => {
      person1 = adminAuthRegister(
        'aarnavsample@gmail.com',
        'abcd1234',
        'Aarnav',
        'Sheth'
      );
      result1 = adminQuizList(person1.authUserId + 1);
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });

  describe('Testing adminQuizList success', () => {
    beforeEach(() => {
      person1 = adminAuthRegister(
        'aarnavsample@gmail.com',
        'abcd1234',
        'Aarnav',
        'Sheth'
      );
      adminAuthLogin('aarnavsample@gmail.com', 'abcd1234');
    });

    test('CASE: Successful Quiz Display', () => {
      const aarnavsQuiz = adminQuizCreate(
        person1.authUserId,
        'aarnavsquiz',
        'a very hard interesting quiz'
      );
      const result1 = adminQuizList(
        person1.authUserId
      );
      expect(result1).toStrictEqual({
        quizzes: [
          {
            quizId: aarnavsQuiz.quizId,
            name: 'aarnavsquiz',
          },
        ],
      });
    });

    test('CASE: Successful Multiple Quiz Display', () => {
      const aarnavsQuiz = adminQuizCreate(
        person1.authUserId,
        'aarnavsquiz',
        'a very hard interesting quiz'
      );
      const secondQuiz = adminQuizCreate(
        person1.authUserId,
        'secondquiz',
        'a very hard interesting quiz'
      );
      const thirdQuiz = adminQuizCreate(
        person1.authUserId,
        'thirdquiz',
        'a very hard interesting quiz'
      );
      result1 = adminQuizList(person1.authUserId);
      expect(result1).toStrictEqual({
        quizzes: [
          {
            quizId: aarnavsQuiz.quizId,
            name: 'aarnavsquiz',
          },
          {
            quizId: secondQuiz.quizId,
            name: 'secondquiz',
          },
          {
            quizId: thirdQuiz.quizId,
            name: 'thirdquiz',
          },
        ],
      });
    });

    test('CASE: Successful Empty Display', () => {
      result1 = adminQuizList(
        person1.authUserId
      );
      expect(result1).toStrictEqual({ quizzes: [] });
    });
  });
});

describe('////////TESTING ADMINQUIZCREATE////////', () => {
  describe('Testing adminQuizCreate success', () => {
    test('CASE: Successfully created quiz', () => {
      person1 = adminAuthRegister(
        'aarnavsample@gmail.com',
        'abcd1234',
        'Aarnav',
        'Sheth'
      );
      result1 = adminQuizCreate(
        person1.authUserId,
        'aarnavsquiz',
        'a very hard interesting quiz'
      );
      expect(result1).toMatchObject({ quizId: expect.any(Number) });
    });
  });

  describe('Testing adminQuizCreate errors', () => {
    beforeEach(() => {
      person1 = adminAuthRegister(
        'aarnavsample@gmail.com',
        'abcd1234',
        'Aarnav',
        'Sheth'
      );
    });

    test('CASE: AuthUserId is not a valid user', () => {
      result1 = adminQuizCreate(
        1947385608741,
        'aarnavsquiz',
        'a very hard interesting quiz'
      );
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: not alphanumeric name', () => {
      result1 = adminQuizCreate(
        person1.authUserId,
        '*not^lph+',
        'a very hard interesting quiz'
      );
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: name is less than 3 or more than 30 characters', () => {
      result1 = adminQuizCreate(
        person1.authUserId,
        'qz',
        'a very hard interesting quiz'
      );
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: name is already used for a quiz by user', () => {
      adminQuizCreate(person1.authUserId, 'aarnavsquiz', 'first quiz');
      result1 = adminQuizCreate(person1.authUserId, 'aarnavsquiz', 'second quiz');
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: description is more than 100 characters', () => {
      const result1 = adminQuizCreate(
        person1.authUserId,
        'aarnavsquiz',
        'abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV'
      );
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('/////////TESTING ADMINQUIZREMOVE////////', () => {
  describe('Testing all adminQuizRemove success and errors', () => {
    beforeEach(() => {
      person1 = adminAuthRegister(
        'manan.j2450@gmail.com',
        'Abcd1234',
        'Manan',
        'Jaiswal'
      );
      adminAuthLogin('manan.j2450@gmail.com', 'Abcd1234');
      person2 = adminAuthRegister(
        'test@gmail.com',
        'Abcd1234',
        'Manan',
        'Jaiswal'
      );
      adminAuthLogin('test@gmail.com', 'Abcd1234');
      result1 = adminQuizCreate(
        person1.authUserId,
        'COMP1511',
        'Programming Fundamentals'
      );
      result2 = adminQuizCreate(
        person2.authUserId,
        'COMP1531',
        'Software Engineering'
      );
    });

    test('CASE: return if no error {}', () => {
      expect(adminQuizRemove(person1.authUserId, result1.quizId)).toStrictEqual(
        {}
      );
    });

    test('CASE: AuthUserId is not a valid user', () => {
      expect(
        adminQuizRemove(person1.authUserId + 2, result1.quizId)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
      expect(
        adminQuizRemove(person1.authUserId, result1.quizId + 2)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
      expect(
        adminQuizRemove(person1.authUserId, result1.quizId + 10)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
      expect(
        adminQuizRemove(person1.authUserId, result1.quizId + 1000)
      ).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: quizId does not refer to a valid quiz that the user owns.', () => {
      expect(adminQuizRemove(person1.authUserId, result2.quizId)).toStrictEqual({
        error: expect.any(String),
      });
    });
  });
});

describe('////////TESTING ADMINQUIZINFO////////', () => {
  describe('Testing adminQuizInfo success', () => {
    test('CASE: Successfully returned info for 1 user and 1 quiz', () => {
      person1 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'vincentQuiz',
        'a very hard interesting quiz'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      result1 = adminQuizInfo(person1.authUserId, quiz.quizId);
      expect(result1).toStrictEqual({
        quizId: quiz.quizId,
        name: 'vincentQuiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'a very hard interesting quiz',
      });
    });

    test('CASE: Successfully returned info for quiz owned by 2nd person', () => {
      adminAuthRegister('aarnavsample@gmail.com', 'abcd1234', 'Aarnav', 'Sheth');
      person2 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const quiz = adminQuizCreate(
        person2.authUserId,
        'vincentQuiz',
        'a very hard interesting quiz'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };

      result1 = adminQuizInfo(person2.authUserId, quiz.quizId);
      expect(result1).toStrictEqual({
        quizId: quiz.quizId,
        name: 'vincentQuiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'a very hard interesting quiz',
      });
    });

    test('CASE: Successfully returned info for 1 user and 2nd quiz', () => {
      person1 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      adminQuizCreate(person1.authUserId, 'vincentFirstQuiz', 'first quiz');
      const quiz2 = adminQuizCreate(
        person1.authUserId,
        'vincentSecondQuiz',
        'second quiz'
      );
      if (quiz2.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      result1 = adminQuizInfo(person1.authUserId, quiz2.quizId);
      expect(result1).toStrictEqual({
        quizId: quiz2.quizId,
        name: 'vincentSecondQuiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz',
      });
    });
  });

  describe('Testing adminQuizInfo errors', () => {
    test('CASE: AuthUserId is not a valid user', () => {
      person1 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'vincentQuiz',
        'a very hard interesting quiz'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };

      result1 = adminQuizInfo(person1.authUserId + 1, quiz.quizId);
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz Id does not refer to a valid quiz', () => {
      person1 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'vincentQuiz',
        'a very hard interesting quiz'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      result1 = adminQuizInfo(person1.authUserId, quiz.quizId + 1);
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz Id does not refer to a quiz that this user owns', () => {
      person1 = adminAuthRegister(
        'aarnavsample@gmail.com',
        'abcd1234',
        'Aarnav',
        'Sheth'
      );
      person2 = adminAuthRegister(
        'vincentxian@gmail.com',
        'vincentpassword1',
        'vincent',
        'xian'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'aarnavQuiz',
        'a very hard interesting quiz'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      result1 = adminQuizInfo(person2.authUserId, quiz.quizId);
      expect(result1).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('////////TESTING ADMINQUIZNAMEUPDATE////////', () => {
  describe('Testing adminQuizNameUpdate outcomes', () => {
    // adminQuizNameUpdate pre-quiz-creation errors
    test('CASE: Create a user first!', () => {
      const result = adminQuizNameUpdate(0, 0, 'catQuiz');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Create a quiz first!', () => {
      adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const result = adminQuizNameUpdate(0, 0, 'catQuiz');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    // adminQuizNameUpdate successfully run
    test('CASE: Successful quiz name update', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person1.authUserId, quiz.quizId, 'catQuiz');
      expect(result).toStrictEqual({});
    });

    // adminQuizNameUpdate error(s) occurred.
    test('CASE: AuthUserId is not a valid user', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(
        person1.authUserId + 1,
        quiz.quizId,
        'CatQuiz'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      
      const result = adminQuizNameUpdate(
        person1.authUserId,
        quiz.quizId + 1,
        'catQuiz'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      person2 = adminAuthRegister(
        'pasta@gmail.com',
        'VincentXian14',
        'Vincent',
        'Xian'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person2.authUserId, quiz.quizId, 'catQuiz');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Name contains any characters that are not alphanumeric or are spaces', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person1.authUserId, quiz.quizId, '!@#$%^&');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Name is either less than 3 characters long or more than 30 characters long', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person1.authUserId, quiz.quizId, 'qu');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Name is either less than 3 characters long or more than 30 characters long', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(
        person1.authUserId,
        quiz.quizId,
        'There is a dog holding me hostage'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Name is already used by the current logged in user for another quiz', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      adminQuizCreate(person1.authUserId, 'CatQuiz', 'A quiz about cats :)');
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person1.authUserId, quiz.quizId, 'CatQuiz');
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  });
});

describe('////////TESTING ADMINQUIZDESCRIPTIONUPDATE////////', () => {
  describe('Testing adminQuizDescriptionUpdate outcomes', () => {
    // adminQuizDescriptionUpdate ran successfully
    test('CASE: Successful quiz name update', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizNameUpdate(person1.authUserId, quiz.quizId, 'catQuiz');
      expect(result).toStrictEqual({});
    });

    // adminQuizDescriptionUpdate error(s) occurred
    test('CASE: AuthUserId is not a valid user', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizDescriptionUpdate(
        person1.authUserId + 1,
        quiz.quizId,
        'A quiz about cats :)'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizDescriptionUpdate(
        person1.authUserId,
        quiz.quizId + 1,
        'A quiz about cats :)'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );

      person2 = adminAuthRegister(
        'pasta@gmail.com',
        'VincentXian14',
        'Vincent',
        'Xian'
      );
      adminAuthLogin('pasta@gmail.com', 'VincentXian14');
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizDescriptionUpdate(
        person2.authUserId,
        quiz.quizId,
        'A quiz about cats :)'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('CASE: Description is more than 100 characters in length', () => {
      person1 = adminAuthRegister(
        'zhizhao@gmail.com',
        'MeowMeow123',
        'Zhi',
        'Zhao'
      );
      const quiz = adminQuizCreate(
        person1.authUserId,
        'newQuiz',
        'A quiz about cats :)'
      );
      if (quiz.quizId === undefined) {
        throw new Error('adminQuizCreate does not work.')
      };
      const result = adminQuizDescriptionUpdate(
        person1.authUserId,
        quiz.quizId,
        'blahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlahBlah'
      );
      expect(result).toStrictEqual({ error: expect.any(String) });
    });
  });
});
