import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestionDuplicate,
  requestAdminQuizQuestion,
  requestAdminQuizInfo,
  deleteRequest,
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

describe('///////Testing /v2/admin/quiz/question/duplicate////////', () => {
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

  describe('Testing /v2/admin/quiz/question/duplicate success cases', () => {
    test('Success duplicating 1st question with 1 quiz 2 question', () => {
      quizQuestion2 = requestAdminQuizQuestion(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`
      );
      result2 = requestAdminQuizInfo(
        `${quiz1.body.quizId}`,
        `${person1.body.token}`
      );
      expect(quizQuestion3.body).toStrictEqual({
        newQuestionId: expect.any(Number),
      });
      expect(quizQuestion3.status).toBe(OK);

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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl,
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
            thumbnailUrl: quizQuestion1Body.thumbnailUrl,
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl,
          },
        ],
        duration: 10,
        thumbnailUrl: '',
      });
    });
    test('Success duplicating 1st question of 2nd quiz with 1 question', () => {
      quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
      quizQuestion2 = requestAdminQuizQuestion(
        `${quiz2.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );
      const expectedTime = Math.floor(Date.now() / 1000);
      const quizQuestion3 = requestAdminQuizQuestionDuplicate(
        `${quiz2.body.quizId}`,
        `${quizQuestion2.body.questionId}`,
        `${person1.body.token}`
      );
      result2 = requestAdminQuizInfo(
        `${quiz2.body.quizId}`,
        `${person1.body.token}`
      );
      expect(quizQuestion3.body).toStrictEqual({
        newQuestionId: expect.any(Number),
      });
      expect(quizQuestion3.status).toBe(OK);
      expect(result2.body.timeLastEdited).toBeGreaterThanOrEqual(expectedTime);
      expect(result2.body).toStrictEqual({
        quizId: quiz2.body.quizId,
        name: 'second quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'second quiz being tested',
        numQuestions: 2,
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl,
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
            thumbnailUrl: quizQuestion2Body.thumbnailUrl,
          },
        ],
        duration: 4,
        thumbnailUrl: '',
      });
    });
  });

  describe('Testing /v2/admin/quiz/question/duplicate error cases', () => {
    test('CASE (401): Token is not a valid structure - too short', () => {
      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${1}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (401): Token is not a valid structure - special symbols', () => {
      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${'let!!'}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(UNAUTHORISED);
    });

    test('CASE (403): Token is not valid for a currently logged in session', () => {
      const sessionId = parseInt(person1.body.token) + 1;
      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId + 1}`,
        `${quizQuestion1.body.questionId}`,
        `${sessionId}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(FORBIDDEN);
    });

    test('CASE (400): Quiz ID does not refer to a valid quiz', () => {
      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId + 1}`,
        `${quizQuestion1.body.questionId}`,
        `${person1.body.token}`
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

      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion1.body.questionId}`,
        `${person2.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Question Id does not refer to a valid question within this quiz', () => {
      quiz2 = requestAdminQuizCreate(
        `${person1.body.token}`,
        'second quiz',
        'second quiz being tested'
      );
      quizQuestion2 = requestAdminQuizQuestion(
        `${quiz2.body.quizId}`,
        `${person1.body.token}`,
        quizQuestion2Body
      );

      result1 = requestAdminQuizQuestionDuplicate(
        `${quiz1.body.quizId}`,
        `${quizQuestion2.body.questionId}`,
        `${person1.body.token}`
      );
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});