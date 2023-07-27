import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizInfo,
  requestAdminQuizQuestionCreate,
  deleteRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let person1: any;
let person2: any;
let quiz1: any;
let quizQuestion1: any;
let quizQuestion2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;

  quizQuestion1 = undefined;
  quizQuestion2 = undefined;
});

const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 4,
  points: 5,
  answers: [
    {
      answer: 'Prince Charles',
      correct: false,
    },
    {
      answer: 'King Charles',
      correct: true,
    },
  ],
};
const quizQuestion2Body = {
  question: 'second question?',
  duration: 2,
  points: 3,
  answers: [
    {
      answer: 'second answer',
      correct: false,
    },
    {
      answer: 'second real answer',
      correct: true,
    },
  ],
};

describe('///////Testing /v1/admin/quiz/ info////////', () => {
  describe('Testing /v1/admin/quiz/ info success cases', () => {
    test('Success info 1 person 1 quiz 0 questions', () => {
      person1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.status).toBe(OK);
      expect(result1.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
      });
    });

    test('Success info 1 person 1 quiz 2 questions', () => {
      person1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      quizQuestion1 = requestAdminQuizQuestionCreate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion1Body
      );
      quizQuestion2 = requestAdminQuizQuestionCreate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.status).toBe(OK);
      expect(result1.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 2,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'Prince Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'King Charles',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
          {
            questionId: quizQuestion2.body.questionId,
            question: 'second question?',
            duration: 2,
            points: 3,
            answers: [
              {
                answer: 'second answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: false,
              },
              {
                answer: 'second real answer',
                answerId: expect.any(Number),
                colour: expect.any(String),
                correct: true,
              },
            ],
          },
        ],
        duration: 6,
      });
    });
  });
  describe('Testing /v1/admin/quiz/ info error cases', () => {
    beforeEach(() => {
      person1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
    });

    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${1}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, 'lett!');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${sessionId}`);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId + 1}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );
      result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
