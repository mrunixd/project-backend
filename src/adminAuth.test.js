import { adminAuthRegister, adminAuthLogin, adminUserDetails } from "./auth.js";
import { getData, setData } from "./dataStore.js";

//TESTING adminAuthRegister
test('Test successful adminAuthRegister', () => {
    let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
    expect(result).toMatchObject({ authUserId: expect.any(Number) });
});

test('Test duplicate adminAuthRegister', () => {
    let result = adminAuthRegister("vincentxian@gmail.com", "vincentpassword1", "vincent", "xian");
    expect(result).toMatchObject({ error: 'Email is already in use.' });
});

//TESTING adminAuthLogin

//TESTING adminUserDetails