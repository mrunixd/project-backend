import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerSendMessage,
  deleteRequest,
  sleepSync,
  OK,
  INPUT_ERROR
} from '../helper';

let person1: any;
let quiz1: any;
let result1: any;
let result2: any;
let sessionId: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  quiz1 = undefined;
  sessionId = undefined;
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

describe('/////// TESTING /v1/player/:playerid/chat (Send message) ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    sessionId = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
    result1 = requestPlayerJoin(sessionId.body.sessionId, 'Zhi Zhao');
  });

  describe('/////// Testing /v1/player/:playerid/chat success ///////', () => {
    test('adminQuizSendMessage runs without error', () => {
      result2 = requestPlayerSendMessage(result1.body.playerId, 'Hello world');

      expect(result2.body).toStrictEqual({});
      expect(result2.status).toBe(OK);
    });
  });

  describe('/////// Testing /v1/player/:playerid/chat errors ///////', () => {
    test('CASE (400): Message is less than 1 character', () => {
      result2 = requestPlayerSendMessage(result1.body.playerId, 'H');

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Message is more than 100 characters', () => {
      result2 = requestPlayerSendMessage(result1.body.playerId, 'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World');

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Player ID does not exist in this session', () => {
      result2 = requestPlayerSendMessage(1234, 'Hello World');

      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});

afterAll(() => {
  sleepSync(1000);
});
