import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestionUpdate,
  requestAdminQuizQuestion,
  requestAdminQuizInfo,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
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
  thumbnailUrl:
    'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};

let person1 = requestAdminAuthRegister(
  'aarnavsample@gmail.com',
  'Abcd12345',
  'aarnav',
  'sheth'
);
let quiz1 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'first quiz',
  'first quiz being tested'
);
let quizQuestion1 = requestAdminQuizQuestion(
  `${quiz1.body.quizId}`,
  `${person1.body.token}`,
  quizQuestion1Body
);

describe('////////Testing v2/admin/quiz/{quizid}/question/update //////////', () => {
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
    quizQuestion1 = requestAdminQuizQuestion(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      quizQuestion1Body
    );
  });

  describe('Testing /v2/admin/quiz/{quizid}/question/{questionid} success cases', () => {
    test('Successful adminQuizCreate 1 quiz question update', () => {
      const quizQuestion3Body = {
        question: 'Who was the Monarch of England?',
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      const result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 1,
        questions: [
          {
            questionId: quizQuestion1.body.questionId,
            question: 'Who was the Monarch of England?',
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
            thumbnailUrl: expect.any(String),
          },
        ],
        duration: 4,
        thumbnailUrl: '',
      });
      expect(result2.status).toBe(OK);
    });
  });

  describe('Testing /v2/admin/quiz/{quizid}/question error cases', () => {
    test('CASE: quiz does not exist', () => {
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId + 1}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion1Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz does not exist for user', () => {
      const person2 = requestAdminAuthRegister(
        'vincent@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person2.body.token}`,
        quizQuestion1Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: quiz question does not exist for quiz', () => {
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId + 1}`,
        `${person1.body.token}`,
        quizQuestion1Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: question string is less than 5 or more than 50 characters', () => {
      const quizQuestion3Body = {
        question: 'Who?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true,
          },
        ],
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duration is not a positive number', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: total duration is more than 3 minutes', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: points awarded are more than 10 or less than 1', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: answer strings are less than 1 or greater than 30', () => {
      const quizQuestion3Body = {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: duplicate answers', () => {
      const quizQuestion3Body = {
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
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE: no correct answers', () => {
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
        thumbnailUrl:
          'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
      };
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
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
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
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
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
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
      const result1 = requestAdminQuizQuestionUpdate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        quizQuestion3Body
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
