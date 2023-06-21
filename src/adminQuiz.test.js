import { adminQuizCreate, adminQuizList, adminQuizInfo } from "./quiz.js";
import { adminAuthRegister, adminAuthLogin, adminUserDetails } from "./auth.js";
// import { getData, setData } from "./dataStore.js";
import { clear } from "./other.js";
    
let result;
    
beforeEach(() => {
    clear();
});
    
///////////////////////////// TESTING adminQuizCreate /////////////////////////////
describe('Testing adminQuizCreate success', () => {
    
    test('CASE: Successfully created quiz', () => {
    
        let result = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        adminAuthLogin("aarnavsample@gmail.com", "abcd1234");
        let result1 = adminQuizCreate(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ quizId: expect.any(Number) });
    });
});
    
describe('Testing adminQuizErrors', () => {
    
    beforeEach(() => {
        result = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        adminAuthLogin("aarnavsample@gmail.com", "abcd1234");
    });
    
    test('CASE: Not a valid user', () => {
    
        let result1 = adminQuizCreate("invalid", "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'User is invalid' });
    });
    
    test('CASE: not alphanumeric name', () => {
    
        let result1 = adminQuizCreate(result.authUserId, "*not^lph+", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'Name contains invalid characters' });
    });
    
    test('CASE: name is less than 3 or more than 30 characters', () => {
    
        let result1 = adminQuizCreate(result.authUserId, "qz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'Name is less than 3 or more than 30 characters' });
    });
        
    test('CASE: name is already used for a quiz by user', () => {
    
        adminQuizCreate(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        let result1 = adminQuizCreate(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'Name is already used for another quiz' });
    });
        
    test('CASE: description is more than 100 characters', () => {

        let result1 = adminQuizCreate(result.authUserId, "aarnavsquiz", "abcdefghijklmanoinapqrstuvfkdlhzbljkfs kj;kadvbjp kj;aobadbo;udvk; j kja jna dnad j;canlnlxc gjanjk  bafhlbahwlbvkljbhw;KEWBF;KBNE;BNKBGGJRNAJLKVBJ;KV");
        expect(result1).toStrictEqual({ error: 'Description is more than 100 characters' });
    });
});
    
////////////////////////////// TESTING adminQuizList //////////////////////////////
describe('Testing adminQuizList error', () => {

    beforeEach(() => {
        result = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        adminAuthLogin("aarnavsample@gmail.com", "abcd1234");
    });

    test('CASE: Not a valid user', () => {

        let result1 = adminQuizList("invalid", "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ error: 'User is invalid' });
    });
});

describe('Testing adminQuizList outcomes', () => {

    beforeEach(() => {
        result = adminAuthRegister("aarnavsample@gmail.com", "abcd1234", "Aarnav", "Sheth");
        adminAuthLogin("aarnavsample@gmail.com", "abcd1234");
    });

    test('CASE: Successful Quiz Display', () => {

        adminQuizCreate(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        let result1 = adminQuizList(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
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

        adminQuizCreate(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        adminQuizCreate(result.authUserId, "secondquiz", "a very hard interesting quiz");
        adminQuizCreate(result.authUserId, "thirdquiz", "a very hard interesting quiz");
        let result1 = adminQuizList(result.authUserId);
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

        let result1 = adminQuizList(result.authUserId, "aarnavsquiz", "a very hard interesting quiz");
        expect(result1).toStrictEqual({ quizzes: [] });
    });
});
 
/////////////////////////// TESTING adminQuizNameUpdate ///////////////////////////
describe('Testing adminQuizNameUpdate outcomes', () => {
    beforeEach(() => {
        let user = adminAuthRegister('zhizhao@gmail.com', 'MeowMeow123', 'Zhi', 'Zhao');
        adminAuthLogin('zhizhao@gmail.com', 'MeowMeow123');
        let quizId = adminQuizCreate(user.authUserId, 'newQuiz', 'A quiz about cats :)');
    });

    // adminQuizNameUpdate successfully run
    test('CASE: Successful quiz name update', () => {
        let result = adminQuizNameUpdate(user.authUserId, quizId, 'catQuiz');
        expect(result).toStrictEqual({});
    });

    // adminQuizNameUpdate error(s) occurred.
    test('CASE: Invalid authUserId', () => {
        let result = adminQuizNameUpdate(0, quizId, 'CatQuiz');
        expect(result).toStrictEqual({ error: 'ERROR: Invalid authUserId' });
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
        let result = adminQuizNameUpdate(user.authUserId, 0, 'catQuiz');
        expect(result).toStrictEqual({ error: 'ERROR: Quiz ID does not refer to a valid quiz' });
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
        let user1 = adminAuthRegister('pasta@gmail.com', 'VincentXian14', 'Vincent', 'Xian');
        adminAuthLogin('pasta@gmail.com', 'VincentXian14');

        let result = adminQuizNameUpdate(user.authUserId, quizId, 'catQuiz'); 
        expect(result).toStrictEqual({ error: 'ERROR: Quiz ID does not refer to a quiz that this user owns' });
    });

    test('CASE: Name contains any characters that are not alphanumeric or are spaces', () => {
        let result = adminQuizNameUpdate(user.authUserId, quizId, '!@#$%^&');
        expect(result).toStrictEqual({ error: 'ERROR: Name contains any characters that are not alphanumeric or are spaces' });
    });

    test('CASE: Name is either less than 3 characters long or more than 30 characters long', () => {
        let result = adminQuizNameUpdate(user.authUserId, quizId, 'qu');
        expect(result).toStrictEqual({ error: 'ERROR: Name is either less than 3 characters long or more than 30 characters long' });
    });

    test('CASE: Name is either less than 3 characters long or more than 30 characters long', () => {
        let result = adminQuizNameUpdate(user.authUserId, quizId, 'There is a dog holding me hostage.');
        expect(result).toStrictEqual({ error: 'ERROR: Name is either less than 3 characters long or more than 30 characters long' });
    });

    test('CASE: Name is already used by the current logged in user for another quiz', () => {
        adminQuizCreate(user.authUserId, 'CatQuiz', 'A quiz about cats :)')

        let result = adminQuizNameUpdate(user.authUserId, quizId, 'CatQuiz');
        expect(result).toStrictEqual({ error: 'ERROR: Name is already used by the current logged in user for another quiz' });
    });

});

/////////////////////// TESTING adminQuizDescriptionUpdate ///////////////////////
describe('Testing adminQuizNameUpdate outcomes', () => {

    // beforeEach(() => {
    //     user =

    // })

    test({})

});