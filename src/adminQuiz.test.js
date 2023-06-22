import { adminQuizCreate, adminQuizList, adminQuizInfo, adminQuizRemove } from "./quiz.js";
import { adminAuthRegister, adminAuthLogin, adminUserDetails } from "./auth.js";
// import { getData, setData } from "./dataStore.js";
import { clear } from "./other.js";
    
let result1;
let result2;
let person1;
let person2;
    
beforeEach(() => {
    clear();
    result1 = undefined;
    result2 = undefined;
    person1 = undefined;
    person2 = undefined;
});


//TESTING adminQuizList
describe('Testing adminQuizList errors', () => {

    test('CASE: AuthUserId is not a valid user', () => {
        person1 = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        result1 = adminQuizList(person1.authUserId + 1);
        expect(result1).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });
});

describe('Testing adminQuizList success', () => {

    beforeEach(() => {
        person1 = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        adminAuthLogin("aarnavsample@gmail.com", "abcd1234");
      });

    test('CASE: Successful Quiz Display', () => {

        adminQuizCreate(person1.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        let result1 = adminQuizList(person1.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({
            quizzes: [
            {
                quizId: 0,
                name: 'aarnavsquiz',
            }
            ]
        });
    });

    test('CASE: Successful Multiple Quiz Display', () => {

        adminQuizCreate(person1.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        adminQuizCreate(person1.authUserId, "secondquiz", "a very hard interesting quiz");
        adminQuizCreate(person1.authUserId, "thirdquiz", "a very hard interesting quiz");
        result1 = adminQuizList(person1.authUserId);
        expect(result1).toStrictEqual({
            quizzes: [
            {
                quizId: 0,
                name: 'aarnavsquiz',
            },
            {
                quizId: 1,
                name: 'secondquiz',
            },
            {
                quizId: 2,
                name: 'thirdquiz',
            }
            ]   
        });
    });

    test('CASE: Successful Empty Display', () => {

        result1 = adminQuizList(person1.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ quizzes: [] });
    });
});


//TESTING adminQuizCreate
describe('Testing adminQuizCreate success', () => {
    
    test('CASE: Successfully created quiz', () => {
    
        person1 = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        result1 = adminQuizCreate(person1.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toMatchObject({ quizId: expect.any(Number) });
    });
});
    
describe('Testing adminQuiz errors', () => {
    
    beforeEach(() => {
        person1 = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
    });
    
    test('CASE: AuthUserId is not a valid user', () => {
    
        result1 = adminQuizCreate("invalid", "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });
    
    test('CASE: not alphanumeric name', () => {
    
        result1 = adminQuizCreate(person1.authUserId, "*not^lph+", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'Name contains invalid characters' });
    });
    
    test('CASE: name is less than 3 or more than 30 characters', () => {
    
        result1 = adminQuizCreate(person1.authUserId, "qz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'Name is less than 3 or more than 30 characters' });
    });
        
    test('CASE: name is already used for a quiz by user', () => {
    
        adminQuizCreate(person1.authUserId, "aarnavsquiz", "first quiz");
        result1 = adminQuizCreate(person1.authUserId, "aarnavsquiz", "second quiz");
        expect(result1).toStrictEqual({ error: 'Name is already used for another quiz' });
    });
        
    test('CASE: description is more than 100 characters', () => {

        let result1 = adminQuizCreate(person1.authUserId, "aarnavsquiz", "abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV");
        expect(result1).toStrictEqual({ error: 'Description is more than 100 characters' });
    });
});


//TESTING adminQuizRemove
describe('Testing all adminQuizRemove success and errors', () => {
    beforeEach(() => {
        person1 = adminAuthRegister("manan.j2450@gmail.com", "Abcd1234", "Manan", "Jaiswal");
        adminAuthLogin("manan.j2450@gmail.com", "Abcd1234");
        person2 = adminAuthRegister("test@gmail.com", "Abcd1234", "Manan", "Jaiswal");
        adminAuthLogin("test@gmail.com", "Abcd1234");
        result1 = adminQuizCreate(person1.authUserId, "COMP1511", "Programming Fundamentals");
        result2 = adminQuizCreate(person2.authUserId, "COMP1531", "Software Engineering");
    });

    test('CASE: return if no error {}', () => {
        expect(adminQuizRemove(person1.authUserId, result1.quizId)).toStrictEqual({});
    }); 

    test('CASE: AuthUserId is not a valid user', () => {
        expect(adminQuizRemove(person1.authUserId + 2, result1.quizId)).toStrictEqual({ error: "AuthUserId is not a valid user"});
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
        expect(adminQuizRemove(person1.authUserId, result1.quizId + 2)).toStrictEqual({ error: "Quiz ID does not refer to a valid quiz"});
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
        expect(adminQuizRemove(person1.authUserId, result1.quizId + 10)).toStrictEqual({ error: "Quiz ID does not refer to a valid quiz"});
    });

    test('CASE: quizId does not refer to a valid quiz.', () => {
        expect(adminQuizRemove(person1.authUserId, result1.quizId + 1000)).toStrictEqual({ error: "Quiz ID does not refer to a valid quiz"});
    });

    test('CASE: quizId does not refer to a valid quiz that the user owns.', () => {
        expect(adminQuizRemove(person1.authUserId, result2.quizId)).toStrictEqual({ error: "Quiz ID does not refer to a valid quiz that this user owns"});
    });
});


//TESTING adminQuizInfo
describe('Testing adminQuizInfo success', () => {
    
    test('CASE: Successfully returned info for 1 user and 1 quiz', () => {
    
        person1 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let quiz = adminQuizCreate(person1.authUserId, "vincentQuiz", "a very hard interesting quiz");
        result1 = adminQuizInfo(person1.authUserId, quiz.quizId);
        expect(result1).toStrictEqual({
            quizId: 0,
            name: 'vincentQuiz',
            timeCreated: expect.any(Date),
            timeLastEdited: expect.any(Date),
            description: 'a very hard interesting quiz', 
        });
    });
    
    test('CASE: Successfully returned info for quiz owned by 2nd person', () => {
    
        adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        person2 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let quiz = adminQuizCreate(person2.authUserId, "vincentQuiz", "a very hard interesting quiz");
        result1 = adminQuizInfo(person2.authUserId, quiz.quizId);
        expect(result1).toStrictEqual({
            quizId: 0,
            name: 'vincentQuiz',
            timeCreated: expect.any(Date),
            timeLastEdited: expect.any(Date),
            description: 'a very hard interesting quiz', 
        });
    });

    test('CASE: Successfully returned info for 1 user and 2nd quiz', () => {
    
        person1 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        adminQuizCreate(person1.authUserId, "vincentFirstQuiz", "first quiz");
        let quiz2 = adminQuizCreate(person1.authUserId, "vincentSecondQuiz", "second quiz");

        result1 = adminQuizInfo(person1.authUserId, quiz2.quizId);
        expect(result1).toStrictEqual({
            quizId: 1,
            name: 'vincentSecondQuiz',
            timeCreated: expect.any(Date),
            timeLastEdited: expect.any(Date),
            description: 'second quiz', 
        });
    });
});

describe('Testing adminQuizInfo errors', () => {
    test('CASE: AuthUserId is not a valid user', () => {

        person1 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let quiz = adminQuizCreate(person1.authUserId, "vincentQuiz", "a very hard interesting quiz");
        result1 = adminQuizInfo(person1.authUserId + 1, quiz.quizId);
        expect(result1).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });

    test('CASE: Quiz Id does not refer to a valid quiz', () => {

        person1 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let quiz = adminQuizCreate(person1.authUserId, "vincentQuiz", "a very hard interesting quiz");
        result1 = adminQuizInfo(person1.authUserId, quiz.quizId + 1);
        expect(result1).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('CASE: Quiz Id does not refer to a quiz that this user owns', () => {

        person1 = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        person2 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let quiz = adminQuizCreate(person1.authUserId, "aarnavQuiz", "a very hard interesting quiz");
        result1 = adminQuizInfo(person2.authUserId, quiz.quizId);
        expect(result1).toStrictEqual({ error: 'Quiz Id does not refer to a quiz that this user owns' });
    });
});

//TESTING adminQuizNameUpdate

//TESTING adminQuizDescriptionUpdate

