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

let result1: any;
let person1: any;
let player1: any;
let quiz1: any;
let session1: any;
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
  result1 = undefined;
  person1 = undefined;
  player1 = undefined;
  quiz1 = undefined;
  session1 = undefined;
});

describe('/////// TESTING v1/admin/quiz/{quizid}/session/{sessionid}/results ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 10);
    player1 = requestPlayerJoin(session1.body.sessionId, 'Vincent Xian');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'FINISH_COUNTDOWN');
    sleepSync(quizQuestion1Body.duration * 1000 + 1000);
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
    requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
  });

  describe('/////// Testing v1/player/{playerid}/session/{sessionid}/results success', () => {
    test('CASE: success results 1 session 1 player 0 answers', () => {
      result1 = requestPlayerResults(player1.body.playerId);

      expect(result1.body).toStrictEqual({
        usersRankedByScore: [{
          name: 'Vincent Xian',
          score: 0
        }],
        questionResults: []
      });
      expect(result1.status).toStrictEqual(OK);
    });
    /// /////////////////////////////////////////////////////////
    /// /more tests for when PLAYERS is complete to check state/////
    /// /////////////////////////////////////////////////////////
  });
  describe('/////// Testing v1/admin/player/{playerid}/results errors', () => {
    test('CASE (400): player ID does not refer to a player', () => {
      result1 = requestPlayerResults(100);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
    test('CASE (400): Session is not in FINAL_RESULTS state', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'END');
      result1 = requestPlayerResults(player1.body.playerId);
      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toStrictEqual(INPUT_ERROR);
    });
  });
});
