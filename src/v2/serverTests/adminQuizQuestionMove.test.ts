import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestionDuplicate,
  requestAdminQuizQuestionMove,
  requestAdminQuizQuestion,
  requestAdminQuizInfo,
  deleteRequest,
  OK,
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

describe('///////Testing /v2/admin/quiz/question/move////////', () => {
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
    quizQuestion1 = requestAdminQuizQuestion(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      quizQuestion1Body
    );
  });

  describe('Testing /v2/admin/quiz/question/move success cases', () => {
    test('Success move 1st question in middle of 3 question', () => {
      quizQuestion2 = requestAdminQuizQuestion(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion2.body.questionId}`,
        `${person1.body.token}`
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        1
      );
      result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz1.body.quizId,
        name: 'first quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'first quiz being tested',
        numQuestions: 3,
        questions: [
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
            questionId: quizQuestion3.body.newQuestionId,
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
        duration: 8,
        thumbnailUrl: '',
      });
    });
  });
  describe('Testing /v2/admin/quiz/question/move error cases', () => {
    beforeEach(() => {
      quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
    });
    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId + 6}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        1
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Quiz ID does not refer to a quiz that this user owns', () => {
      person2 = requestAdminAuthRegister(
        'aarnavsample@gmail.com',
        'Abcd12345',
        'aarnav',
        'sheth'
      );

      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person2.body.token}`,
        1
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quizQuestion2 = requestAdminQuizQuestion(
        `${quiz2.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion2.body.questionId}`,
        `${person1.body.token}`,
        1
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is less than 0', () => {
      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        -1
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is greater than n-1 where n is the number of questions', () => {
      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        2
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE (400): NewPosition is the position of the current question', () => {
      result1 = requestAdminQuizQuestionMove(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`,
        0
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
