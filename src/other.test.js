import { clear } from "./other.js";
import { adminAuthRegister } from "./auth.js";
import { adminQuizCreate, adminQuizInfo } from "./quiz.js";


test('test clear() returns {}', () => {
    expect(clear()).toStrictEqual({}); 
});
  
let person1;
let quizId;
test('test clear() using other functions', () => {
    person1 = adminAuthRegister("manan.j2450@gmail.com", "Abcd1234", "Manan", "Jaiswal");
    quizId = adminQuizCreate(person1, "COMP1531", "Software Engineering");
    clear();
    expect(adminQuizInfo(person1, quizId)).toStrictEqual({ error: expect.any(String)});
});
