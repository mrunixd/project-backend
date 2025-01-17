import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  OK,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
let quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
let quizQuestion1 = {
  question: 'Who is the Monarch of England?',
  duration: 1,
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
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};
describe('////////Testing v2/admin/quiz/{quizid}/question//////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('aarnavsample@gmail.com', 'Abcd12345', 'aarnav', 'sheth');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    quizQuestion1 = {
      question: 'Who is the Monarch of England?',
      duration: 1,
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
      thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
    };
  });

  describe('Testing /v2/admin/quiz/{quizid}/question success cases', () => {
    test('Successful adminQuizQuestionCreate 1 quiz question', () => {
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ questionId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/{quizid}/question error cases', () => {
    test('CASE: quiz does not exist', () => {
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId + 1}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      const person2 = requestAdminAuthRegister('vincent@gmail.com', 'password1', 'vincent', 'xian');
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person2.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: too few answers', () => {
      quizQuestion1 = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true,
          }
        ],
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png'
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
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
        thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: empty url', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: '',
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: invalid url', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://NOT_AREAL_URL.png'
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: valid url but not a jpeg or png', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl: 'https://www.wix.com/'
      };
      const result1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion3Body);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
