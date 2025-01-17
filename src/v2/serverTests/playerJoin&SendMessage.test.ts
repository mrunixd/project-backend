import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerSendMessage,
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
let result1 = requestPlayerJoin(sessionId.body.sessionId, 'Zhi Zhao');
describe('////////TESTING v1/player/join&sendmessage////////', () => {
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
  describe('TESTING v1/player/join success', () => {
    test('player joins empty game successfully', () => {
      const result1 = requestPlayerJoin(sessionId.body.sessionId, '');
      expect(result1.body).toStrictEqual({ playerId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });
  describe('TESTING v1/player/join errors', () => {
    test('CASE 400: player joins game where individual has same name', () => {
      requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      const result2 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
    test('CASE 400: sessionId not valid', () => {
      const result1 = requestPlayerJoin(-56, 'Manan Jaiswal');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
    test('CASE 400: sessionId already started', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${sessionId.body.sessionId}`, 'NEXT_QUESTION');
      const result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });

  describe('TESTING /v1/player/:playerid/chat (Send message)', () => {
    beforeEach(() => {
      result1 = requestPlayerJoin(sessionId.body.sessionId, 'Zhi Zhao');
    });

    describe('Testing /v1/player/:playerid/chat success', () => {
      test('adminQuizSendMessage runs without error', () => {
        const result2 = requestPlayerSendMessage(result1.body.playerId, 'Hello world');

        expect(result2.body).toStrictEqual({});
        expect(result2.status).toBe(OK);
      });
    });

    describe('Testing /v1/player/:playerid/chat errors', () => {
      test('CASE (400): Message is less than 1 character', () => {
        const result2 = requestPlayerSendMessage(result1.body.playerId, 'H');

        expect(result2.body).toStrictEqual({ error: expect.any(String) });
        expect(result2.status).toBe(INPUT_ERROR);
      });

      test('CASE (400): Message is more than 100 characters', () => {
        const result2 = requestPlayerSendMessage(result1.body.playerId, 'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World');

        expect(result2.body).toStrictEqual({ error: expect.any(String) });
        expect(result2.status).toBe(INPUT_ERROR);
      });

      test('CASE (400): Player ID does not exist in this session', () => {
        const result2 = requestPlayerSendMessage(1234, 'Hello World');

        expect(result2.body).toStrictEqual({ error: expect.any(String) });
        expect(result2.status).toBe(INPUT_ERROR);
      });
    });
  });
});
