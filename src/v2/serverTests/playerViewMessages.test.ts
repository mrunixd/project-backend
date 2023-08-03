import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerSendMessage,
  requestPlayerViewMessages,
  deleteRequest,
  OK,
  INPUT_ERROR
} from '../helper';

let person1: any;
let quiz1: any;
let sessionId: any;
let result1: any;
let result2: any;
let result3: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  person1 = undefined;
  quiz1 = undefined;
  sessionId = undefined;
  result1 = undefined;
  result2 = undefined;
  result3 = undefined;
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

describe('/////// TESTING /v1/player/:playerid/chat (Show Messages) ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    sessionId = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
    result1 = requestPlayerJoin(sessionId.body.sessionId, 'Zhi Zhao');
    requestPlayerSendMessage(result1.body.playerId, 'Hello World');
  });

  describe('CASE: adminViewChatMessages successful', () => {
    test('adminViewChatMessages runs successfully with one message', () => {
      result2 = requestPlayerViewMessages(result1.body.playerId);

      expect(result2.body).toStrictEqual({
        message: [{
          messageBody: 'Hello World',
          playerId: result1.body.playerId,
          name: 'Zhi Zhao',
          timeSent: expect.any(Number)
        }]
      });

      expect(result2.status).toBe(OK);
    });

    test('playerViewMessages runs successfully with multiple messages', () => {
      requestAdminAuthRegister('zhizhao@gmail.com', 'password1', 'Zhi', 'Zhao');
      result2 = requestPlayerJoin(sessionId.body.sessionId, 'Vincent Xian');
      requestPlayerSendMessage(result2.body.playerId, 'Goodbye World');

      result3 = requestPlayerViewMessages(result2.body.playerId);

      expect(result3.body).toStrictEqual({
        message: [
          {
            messageBody: 'Hello World',
            playerId: result1.body.playerId,
            name: 'Zhi Zhao',
            timeSent: expect.any(Number)
          },
          {
            messageBody: 'Goodbye World',
            playerId: result2.body.playerId,
            name: 'Vincent Xian',
            timeSent: expect.any(Number)
          }
        ]
      });

      expect(result3.status).toBe(OK);
    });
  });

  describe('/////// Testing /v1/player/:playerid/chat errors ///////', () => {
    test('CASE (400): PlayerId does not exist', () => {
      result2 = requestPlayerViewMessages(1234);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});
