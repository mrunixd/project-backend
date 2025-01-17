import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerStatus,
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
requestAdminQuizQuestion(
  `${quiz1.body.quizId}`,
  `${person1.body.token}`,
  quizQuestion1Body
);
let sessionId = requestAdminQuizSessionStart(
  `${person1.body.token}`,
  `${quiz1.body.quizId}`,
  3
);

describe('////////TESTING v1/player/:playerid////////', () => {
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
    sessionId = requestAdminQuizSessionStart(
      `${person1.body.token}`,
      `${quiz1.body.quizId}`,
      3
    );
  });
  describe('Testing v1/player/:playerid success cases', () => {
    test('Testing player status of one player', () => {
      const result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      const result2 = requestPlayerStatus(result1.body.playerId);
      expect(result2.body).toStrictEqual({
        state: 'LOBBY',
        numQuestions: expect.any(Number),
        atQuestion: expect.any(Number)
      });
      expect(result2.status).toBe(OK);
    });
    test('Testing player status of two player session', () => {
      let result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      const result2 = requestPlayerJoin(sessionId.body.sessionId, 'Aarnav Sheth');
      const result3 = requestPlayerStatus(result1.body.playerId);
      result1 = requestPlayerStatus(result2.body.playerId);
      expect(result1.body).toStrictEqual({
        state: 'LOBBY',
        numQuestions: expect.any(Number),
        atQuestion: expect.any(Number)
      });
      expect(result3.body).toStrictEqual({
        state: 'LOBBY',
        numQuestions: expect.any(Number),
        atQuestion: expect.any(Number)
      });
      expect(result1.status).toStrictEqual(OK);
      expect(result3.status).toStrictEqual(OK);
    });
  });
  describe('Testing v1/player/:playerid error cases', () => {
    test('Testing no player found', () => {
      const result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      const result2 = requestPlayerStatus(result1.body.playerId + 1);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});
