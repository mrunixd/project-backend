import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  postRequest,
  OK,
  UNAUTHORISED,
  FORBIDDEN,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let result3: any;
let person1: any;
let person2: any;
let quiz1: any;
let quiz2: any;
let quiz3: any;
let quizQuestion1: any;
let quizQuestion2: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  result3 = undefined;
  person1 = undefined;
  person2 = undefined;
  quiz1 = undefined;
  quiz2 = undefined;
  quiz3 = undefined;
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

describe('////////Testing v1/admin/quiz/{quizid}/question//////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
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
    quizQuestion1 = {
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
  });

  describe('Testing /v1/admin/quiz/{quizid}/question success cases', () => {
    test('Successful adminQuizCreate 1 quiz question', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ questionId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v1/admin/quiz/{quizid}/question error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: '1',
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: 'let!!',
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${sessionId}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE: quiz does not exist', () => {
      result1 = postRequest(
        `/v1/admin/quiz/${quiz1.body.quizId + 1}/question`,
        {
          token: `${person1.body.token}`,
          questionBody: quizQuestion1,
        }
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      person2 = requestAdminAuthRegister(
        'vincent@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person2.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: question string is less than 5 or more than 50 characters', () => {
      quizQuestion1 = {
        question: 'Who?',
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
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      quizQuestion1 = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duration is not a positive number', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: -1,
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
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: total duration is more than 3 minutes', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 181,
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
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: points awarded are more than 10 or less than 1', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 11,
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
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: answer strings are less than 1 or greater than 30', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 9,
        answers: [
          {
            answer:
              'this is meant to be more than 30 characters long and i think it is',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duplicate answers', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 8,
        answers: [
          {
            answer: 'King Charles',
            correct: false,
          },
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: no correct answers', () => {
      quizQuestion1 = {
        question: 'Who is the monarch of England?',
        duration: 13,
        points: 8,
        answers: [
          {
            answer: 'King Charless',
            correct: false,
          },
          {
            answer: 'Prince Charles',
            correct: false,
          },
        ],
      };
      result1 = postRequest(`/v1/admin/quiz/${quiz1.body.quizId}/question`, {
        token: `${person1.body.token}`,
        questionBody: quizQuestion1,
      });
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
