import {
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  deleteRequest,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerJoin,
  requestPlayerQuestionAnswer,
  requestPlayerQuestionInfo,
  requestAdminQuizSessionUpdate,
  requestAdminQuizSessionResults,
  OK,
  INPUT_ERROR,
  sleepSync,
} from '../helper';

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 2,
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
let person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'password1', 'Manan ', 'Jaiswal');
let quiz1 = requestAdminQuizCreate(
  `${person1.body.token}`,
  'first quiz',
  'first quiz being tested'
);
let sessionId = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 2);
let player1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan');
let player2 = requestPlayerJoin(sessionId.body.sessionId, 'Vincent');
let question = requestPlayerQuestionInfo(player1.body.playerId, 1);

describe('////////TESTING /v1/player/:playerid/question/:questionposition/answer////////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('manan.j2450@gmail.com', 'password1', 'Manan ', 'Jaiswal');
    quiz1 = requestAdminQuizCreate(
      `${person1.body.token}`,
      'first quiz',
      'first quiz being tested'
    );
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    sessionId = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 2);
    player1 = requestPlayerJoin(sessionId.body.sessionId, 'Manan');
    player2 = requestPlayerJoin(sessionId.body.sessionId, 'Vincent');
    question = requestPlayerQuestionInfo(player1.body.playerId, 1);
    sleepSync(0.1 * 1000);
  });
  describe('TESTING /v1/player/:playerid/question/:questionposition/answer success case', () => {
    test('testing 2nd player answers 1st question correctly', () => {
      requestPlayerQuestionAnswer(player1.body.playerId, 1, [question.body.answers[0].answerId]);
      const result1 = requestPlayerQuestionAnswer(player2.body.playerId, 1, [question.body.answers[1].answerId]);
      expect(result1.body).toStrictEqual({});
      expect(result1.status).toBe(OK);

      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${sessionId.body.sessionId}`, 'GO_TO_ANSWER');
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${sessionId.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
      const result2 = requestAdminQuizSessionResults(`${person1.body.token}`, `${quiz1.body.quizId}`, `${sessionId.body.sessionId}`);
      expect(result2.body).toStrictEqual({
        usersRankedByScore: [{
          name: 'Vincent',
          score: 2.5
        },
        {
          name: 'Manan',
          score: 0
        }],
        questionResults: [{
          questionId: question.body.questionId,
          questionCorrectBreakdown: [{
            answerId: expect.any(Number),
            playersCorrect: ['Vincent']
          }],
          averageAnswerTime: expect.any(Number),
          percentCorrect: 50,
        },
        {
          questionId: expect.any(Number),
          questionCorrectBreakdown: [{
            answerId: expect.any(Number),
            playersCorrect: []
          }],
          averageAnswerTime: expect.any(Number),
          percentCorrect: 0,
        }]
      });
    });
  });
  describe('TESTING /v1/player/:playerid/question/:questionposition/answer error case', () => {
    test('CASE (400): playerId doesnt exist', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId + 1, 1, [question.body.answers[0].answerId]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): If question position is not valid for the session this player is in', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 10, [question.body.answers[0].answerId]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session is not in QUESTION_OPEN state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${sessionId.body.sessionId}`, 'END');
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 1, [question.body.answers[0].answerId]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): If session is not yet up to this question', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 2, [question.body.answers[0].answerId]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Answer IDs are not valid for this particular question', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 1, [1000]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('There are duplicate answer IDs provided', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 1, [question.body.answers[0].answerId, question.body.answers[0].answerId]);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Less than 1 answer ID was submitted', () => {
      const result1 = requestPlayerQuestionAnswer(player1.body.playerId, 1, []);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
