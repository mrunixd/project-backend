import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerQuestionInfo,
  requestAdminQuizSessionUpdate,
  OK,
  INPUT_ERROR,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 0.1,
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
  question: 'Who is the Goat?',
  duration: 0.1,
  points: 5,
  answers: [
    {
      answer: 'Manan',
      correct: false,
    },
    {
      answer: 'Vincent',
      correct: true,
    },
  ],
  thumbnailUrl:
    'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};
let person1 = requestAdminAuthRegister(
  'manan.j2450@gmail.com',
  'password1',
  'Manan ',
  'Jaiswal'
);
let quiz1 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'first quiz',
  'first quiz being tested'
);
let sessionId = requestAdminQuizSessionStart(
  `${person1.body.token}`,
  `${quiz1.body.quizId}`,
  3
);
let player1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan');

describe('////////TESTING /v1/player/:playerid/question/:questionposition////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister(
      'manan.j2450@gmail.com',
      'password1',
      'Manan ',
      'Jaiswal'
    );
    quiz1 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'first quiz',
      'first quiz being tested'
    );
    requestAdminQuizQuestion(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      quizQuestion1Body
    );
    requestAdminQuizQuestion(
      `${quiz1.body.quizId}`,
      `${person1.body.token}`,
      quizQuestion2Body
    );
    sessionId = requestAdminQuizSessionStart(
      `${person1.body.token}`,
      `${quiz1.body.quizId}`,
      3
    );
    player1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan');
  });
  describe('Testing /v1/player/:playerid/question/:questionposition success', () => {
    test('Testing questioninfo output with one player', () => {
      requestAdminQuizSessionUpdate(
        `${person1.body.token}`,
        `${quiz1.body.quizId}`,
        `${sessionId.body.sessionId}`,
        'NEXT_QUESTION'
      );
      const result1 = requestPlayerQuestionInfo(player1.body.playerId, 1);
      expect(result1.body).toStrictEqual({
        questionId: expect.any(Number),
        question: 'Who is the Monarch of England?',
        duration: 0.1,
        thumbnailUrl: expect.any(String),
        points: 5,
        answers: [
          {
            answerId: expect.any(Number),
            answer: 'Prince Charles',
            colour: expect.any(String),
            correct: false,
          },
          {
            answerId: expect.any(Number),
            answer: 'King Charles',
            colour: expect.any(String),
            correct: true,
          },
        ],
      });
      expect(result1.status).toBe(OK);
    });
  });
  describe('Testing /v1/player/:playerid/question/:questionposition errors', () => {
    test('CASE 400: PlayerId does not exist', () => {
      const result1 = requestPlayerQuestionInfo(player1.body.playerId + 1, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE 400: Question position is not valid for the session the player is in', () => {
      requestAdminQuizSessionUpdate(
        `${person1.body.token}`,
        `${quiz1.body.quizId}`,
        `${sessionId.body.sessionId}`,
        'NEXT_QUESTION'
      );
      const result1 = requestPlayerQuestionInfo(player1.body.playerId, 3);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE 400: session is not currently on this question', () => {
      requestAdminQuizSessionUpdate(
        `${person1.body.token}`,
        `${quiz1.body.quizId}`,
        `${sessionId.body.sessionId}`,
        'NEXT_QUESTION'
      );
      const result1 = requestPlayerQuestionInfo(player1.body.playerId, 2);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE 400: Session is in Lobby or end state', () => {
      requestAdminQuizSessionUpdate(
        `${person1.body.token}`,
        `${quiz1.body.quizId}`,
        `${sessionId.body.sessionId}`,
        'END'
      );
      const result1 = requestPlayerQuestionInfo(player1.body.playerId, 1);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
