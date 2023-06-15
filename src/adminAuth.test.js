import { adminAuthRegister, adminAuthLogin, adminUserDetails } from "./auth.js";
import { getData, setData } from "./dataStore.js";

//TESTING adminAuthRegister
describe('Testing adminAuthRegister success', () => {

    test('CASE: Successful register', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });
});

describe('Testing adminAuthRegister errors', () => {
    test('CASE: Email address is already in use', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
        expect(result).toMatchObject({ error: 'Email address is already in use.' });
    });

    test('CASE: Email address is invalid', () => {
        let result = adminAuthRegister("vincent123", "vincentpassword1", "vincent", "xian");
        expect(result).toMatchObject({ error: 'Email address is not valid.' });
    });

    test('CASE: First name is invalid', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "!!!", "xian");
        expect(result).toMatchObject({ error: 'First name is invalid' });
    });

    test('CASE: First name is less than 2 characters or more than 20 characters', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "v", "xian");
        expect(result).toMatchObject({ error: 'First name is less than 2 characters or more than 20 characters' });
    });

    test('CASE: Last name is invalid', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "!!!");
        expect(result).toMatchObject({ error: 'Last name is invalid' });
    });
    
    test('CASE: Last name is less than 2 characters or more than 20 characters', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "x");
        expect(result).toMatchObject({ error: 'Last name is less than 2 characters or more than 20 characters' });
    });

    test('CASE: Password is less than 8 characters', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "pass", "vincent", "xian");
        expect(result).toMatchObject({ error: 'Password is less than 8 characters' });
    });
    
    test('CASE: Password does not contain at least one number and at least one letter', () => {
        let result = adminAuthRegister("vincentxian@gmail.com", "password", "vincent", "x");
        expect(result).toMatchObject({ error: 'Password does not contain at least one number and at least one letter' });
    });
});



//TESTING adminAuthLogin

//TESTING adminUserDetails