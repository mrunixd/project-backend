import { adminAuthRegister, adminAuthLogin, adminUserDetails } from "./auth.js";
// import { getData, setData } from "./dataStore.js";
import { clear } from "./other.js";

//TESTING adminAuthRegister
describe('Testing adminAuthRegister success', () => {

    test('CASE: Successful register', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });
});

describe('Testing adminAuthRegister errors', () => {
    test('CASE: Email address is already in use', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        let result2 = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        expect(result2).toStrictEqual({ error: 'Email address is already in use' });
    });

    test('CASE: Email address is invalid', () => {
        clear();
        let result = adminAuthRegister("vincent123", "vincentpassword1", "vincent", "xian");
        expect(result).toStrictEqual({ error: 'Email address is not valid' });
    });

    test('CASE: First name is invalid', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "!!!", "xian");
        expect(result).toStrictEqual({ error: 'First name is invalid' });
    });
    
    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "v", "xian");
        expect(result).toStrictEqual({ error: 'First name is less than 2 characters or more than 20 characters' });
    });
    
    test('CASE: Last name is invalid', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "!!!");
        expect(result).toStrictEqual({ error: 'Last name is invalid' });
    });
       
    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
        clear(); 
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "x");
        expect(result).toStrictEqual({ error: 'Last name is less than 2 characters or more than 20 characters' });
    });
    
    test('CASE: Password is less than 8 characters', () => {
        clear();
        let result = adminAuthRegister("vincentxian@gmail.com", "pass", "vincent", "xian");
        expect(result).toStrictEqual({ error: 'Password is less than 8 characters' });
    });

    test('CASE: Password does not contain at least one number and at least one letter', () => {
        clear();

        let result = adminAuthRegister("vincentxian@gmail.com", "password", "vincent", "xian");
        expect(result).toStrictEqual({ error: 'Password does not contain at least one number and at least one letter' });
    });
});



//TESTING adminAuthLogin
describe('check return', () => {
    test('CASE: test returns authUserId {number}', () => {
        clear();
        adminAuthRegister("manan.j2450@gmail.com", "abcd1234", "Manan", "Jaiswal");
        expect(adminAuthLogin("manan.j2450@gmail.com", "abcd1234")).toStrictEqual({ authUserId: expect.any(Number)}); 
    });
});

describe('checking errors', () => {
    test('CASE: Email address does not exist', () => {
        clear();
        expect(adminAuthLogin("manan.j2450@gmail.com", "abcd1234")).toStrictEqual({ error: 'Email address does not exist.'}); 
    });

    test('CASE: Password is incorrect - differing case', () => {
        clear();
        adminAuthRegister("manan.j2450@gmail.com", "ABCD1234", "Manan", "Jaiswal");
        expect(adminAuthLogin("manan.j2450@gmail.com", "abcd1234")).toStrictEqual({ error: 'Password is incorrect.'}); 
    });
    
    test('CASE: Password is incorrect - differing password', () => {
        clear();
        adminAuthRegister("manan.j2450@gmail.com", "incorrectpw", "Manan", "Jaiswal");
        expect(adminAuthLogin("manan.j2450@gmail.com", "abcd1234")).toStrictEqual({ error: 'Password is incorrect.'}); 
    });
});

describe('email addresses case sensitivity', () => {
    test('CASE: test case sensitivity of email address letters', () => {
        clear();
        adminAuthRegister("manan.j2450@gmail.com", "abcd1234", "Manan", "Jaiswal");
        expect(adminAuthLogin("Manan.j2450@gmail.com", "abcd1234")).toStrictEqual({ authUserId: expect.any(Number)}); 
    });

    test('CASE: test case sensitivity of email address letters', () => {
        clear();
        adminAuthRegister("manan.j2450@gmail.com", "abcd1234", "Manan", "Jaiswal");
        expect(adminAuthLogin("manan.j2450@gMail.com", "abcd1234")).toStrictEqual({ authUserId: expect.any(Number)}); 
    });
});

//TESTING adminUserDetails