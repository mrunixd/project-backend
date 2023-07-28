import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizTransfer,
  requestAdminQuizQuestionCreate,
  requestAdminQuizInfo,
  deleteRequest,
  requestAdminQuizQuestionDuplicate,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let person1: any;
let person2: any;
let quiz1: any;
let quiz2: any;
let quizQuestion1: any;
let quizQuestion2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
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

describe('///////Testing /v1/admin/quiz/transfer////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'vincentxian@gmail.com',
      'password1',
      'vincent',
      'xian'
    );
    person2 = requestAdminAuthRegister(
      'aarnavsample@gmail.com',
      'Abcd12345',
      'aarnav',
      'sheth'
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
  });

  describe('Testing /v1/admin/quiz/question/transfer success cases', () => {
    test('move quiz to 2nd person who already has a quiz', () => {
      quiz2 = requestAdminQuizCreate(
        `${person2.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'aarnavsample@gmail.com'
      );

      result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`
      );
      const result3 = requestAdminQuizInfo(
        `${quiz2.body.quizId}`,
        `${person2.body.token}`
      );

      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toMatchObject({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
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
        ],
        duration: 4,
      });
      expect(result3.body).toMatchObject({
        quizId: quiz2.body.quizId,
        name: 'second quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz being tested',
        numQuestions: 0,
        questions: [],
        duration: 0,
      });
    });

    test('duplicate 1st question after transfer to 2nd person', () => {
      quizQuestion2 = requestAdminQuizQuestionCreate(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'aarnavsample@gmail.com'
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person2.body.token}`
      );
      result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`
      );
      const result3 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result3.status).toBe(INPUT_ERROR);

      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toMatchObject({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 3,
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
            questionId: quizQuestion3.body.newQuestionId,
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
        duration: 10,
      });
    });
  });
  describe('Testing /v1/admin/quiz/transfer error cases', () => {
    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${'le1!!'}`,
        'aarnavsample@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Provided token is valid structure, but is not for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${sessionId}`,
        'aarnavsample@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId + 1}`,
        `${person1.body.token}`,
        'aarnavsample@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      requestAdminAuthRegister(
        'manan.j2450@gmail.com',
        'Abcd12345',
        'Manan',
        'Jaiswal'
      );
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`,
        'manan.j2450@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is not a real user', () => {
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'fakeEmail'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): userEmail is the current logged in user', () => {
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'vincentxian@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      quiz2 = requestAdminQuizCreate(
        `${person2.body.token}`,
        'first quiz',
        'second quiz being tested'
      );
      result1 = requestAdminQuizTransfer(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        'aarnavsample@gmail.com'
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
