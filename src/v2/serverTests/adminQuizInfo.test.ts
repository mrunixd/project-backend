import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizInfo,
  requestAdminQuizQuestion,
  requestAdminQuizDelete,
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
  thumbnailUrl:
    'https://media.sproutsocial.com/uploads/PI_Analytics_Instagram_Competitors_Report.png',
};
let person1 = requestAdminAuthRegister(
  'vincentxian@gmail.com',
  'password1',
  'vincent',
  'xian'
);
let quiz1 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'first quiz',
  'first quiz being tested'
);

describe('///////Testing /v2/admin/quiz/ info////////', () => {
  describe('Testing /v2/admin/quiz/ info success cases', () => {
    test('Success info 1 person 1 quiz 0 questions', () => {
      const person1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      const result1 = requestAdminQuizInfo(
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
        thumbnailUrl: '',
      });
    });

    test('Success info 1 person 1 quiz 2 questions', () => {
      const person1 = requestAdminAuthRegister(
        'vincentxian@gmail.com',
        'password1',
        'vincent',
        'xian'
      );
      const quiz1 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );

      const quizQuestion1 = requestAdminQuizQuestion(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion1Body
      );
      const quizQuestion2 = requestAdminQuizQuestion(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      const result1 = requestAdminQuizInfo(
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
            thumbnailUrl: expect.any(String),
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
            thumbnailUrl: expect.any(String),
          },
        ],
        duration: 6,
        thumbnailUrl: '',
      });
    });
  });
  describe('Testing /v2/admin/quiz/ info error cases', () => {
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
    test('CASE: Quiz ID does not refer to a valid quiz', () => {
      const result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId + 1}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE: Quiz ID does not refer to a quiz that this user owns', () => {
      const person2 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );
      const quiz2 = requestAdminQuizCreate(`${person1.body.token}`,
        'first quiz',
        'first quiz being tested'
      );
      requestAdminQuizDelete(`${person1.body.token}`, `${quiz2.body.quizId}`);
      const result1 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person2.body.token}`
      );

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
