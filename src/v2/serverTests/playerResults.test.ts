import {
  requestAdminAuthRegister,
  requestAdminQuizSessionStart,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionUpdate,
  requestPlayerJoin,
  requestPlayerResults,
  sleepSync,
  deleteRequest,
  OK,
  INPUT_ERROR,
} from '../helper';

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
  thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
};

beforeEach(() => {
  deleteRequest('/v1/clear', {});
});
let person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
let quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
let question1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
let session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
let player1 = requestPlayerJoin(session1.body.sessionId, 'Vincent Xian');

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid}/results ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    question1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
    player1 = requestPlayerJoin(session1.body.sessionId, 'Vincent Xian');
  });

  describe('/////// Testing v1/player/{playerid}/session/{sessionid}/results success', () => {
    test('CASE: success results 1 session 1 player 0 answers', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      sleepSync(100);
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
      const result1 = requestPlayerResults(player1.body.playerId);

      expect(result1.body).toStrictEqual({
        usersRankedByScore: [{
          name: 'Vincent Xian',
          score: 0
        }],
        questionResults: [{
          questionId: question1.body.questionId,
          questionCorrectBreakdown: [{
            answerId: expect.any(Number),
            playersCorrect: []
          }],
          averageAnswerTime: 0,
          percentCorrect: 0
        }]
      });
      expect(result1.status).toStrictEqual(OK);
    });
  });
  describe('/////// Testing v1/admin/player/{playerid}/results errors', () => {
    test('CASE (400): player ID does not refer to a player', () => {
      const result1 = requestPlayerResults(100);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session is not in FINAL_RESULTS state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'END');
      const result1 = requestPlayerResults(player1.body.playerId);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
