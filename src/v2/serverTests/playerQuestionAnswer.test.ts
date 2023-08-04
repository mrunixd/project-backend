import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerQuestionAnswer,
  requestPlayerQuestionInfo,
  OK,
  sleepSync,
} from '../helper';
let result1: any;
let person1: any;
let quiz1: any;
let sessionId: any;
let player1: any;
let player2: any;
let player3: any;
// let info1: any;
let question: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
  person1 = undefined;
  quiz1 = undefined;
  sessionId = undefined;
  player1 = undefined;
  player2 = undefined;
  player3 = undefined;
  // info1 = undefined;
  question = undefined;
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
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};

describe('////////TESTING /v1/player/:playerid/question/:questionposition/answer////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'password1', 'Manan ', 'Jaiswal');
    quiz1 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'first quiz',
      'first quiz being tested'
    );
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    sessionId = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
    player1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan');
    player2 = requestPlayerJoin(sessionId.body.sessionId, 'Vincent');
    player3 = requestPlayerJoin(sessionId.body.sessionId, 'thegoat');
    // info1 = requestAdminQuizInfo(`${quiz1.body.quizId}`, `${person1.body.token}`);
    question = requestPlayerQuestionInfo(player1.body.playerId, 1);
    sleepSync(0.1 * 1000);
  });
  describe('TESTING /v1/player/:playerid/question/:questionposition/answer success case', () => {
    test('testing 1 player question answer', () => {
      result1 = requestPlayerQuestionAnswer(player1.body.playerId, 1, [question.body.answers[1].answerId]);
      requestPlayerQuestionAnswer(player2.body.playerId, 1, [question.body.answers[1].answerId]);
      requestPlayerQuestionAnswer(player3.body.playerId, 1, [question.body.answers[1].answerId]);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);
    });
  });
  // describe('TESTING /v1/player/:playerid/question/:questionposition/answer error case', () => {});
});
