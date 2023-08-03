import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  OK,
  INPUT_ERROR,
} from '../helper';

let result1: any;
let result2: any;
let person1: any;
let quiz1: any;
let sessionId: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  result2 = undefined;
  person1 = undefined;
  quiz1 = undefined;
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

describe('////////TESTING v1/player/join////////', () => {
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
      result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      console.log(result1.body);
      expect(result1.body).toStrictEqual({ playerId: expect.any(Number) });
      expect(result1.status).toBe(OK);
    });
  });
  describe('TESTING v1/player/join errors', () => {
    test('CASE 400: player joins game where individual has same name', () => {
      result1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      result2 = requestPlayerJoin(sessionId.body.sessionId, 'Manan Jaiswal');
      console.log(result1.body);
      expect(result2.body).toStrictEqual({ error: expect.any(String) });
      expect(result2.status).toBe(INPUT_ERROR);
    });
  });
});
