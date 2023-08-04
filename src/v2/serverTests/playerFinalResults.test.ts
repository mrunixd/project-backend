import {
  deleteRequest,
  requestAdminAuthRegister,
  requestAdminQuizCreate,
  requestAdminQuizQuestion,
  requestAdminQuizSessionStart,
  requestPlayerQuestionInfo,
  requestPlayerJoin,
  requestPlayerQuestionAnswer,
  requestAdminQuizSessionUpdate,
  requestPlayerFinalResults,
  sleepSync,
  OK,
  INPUT_ERROR
} from '../helper';

let person1: any;
let quiz1: any;
let question: any;
let player1: any;
let session1: any;
let result1: any;

beforeEach(() => {
  deleteRequest('/v1/clear', {});
  person1 = undefined;
  quiz1 = undefined;
  question = undefined;
  player1 = undefined;
  session1 = undefined;
  result1 = undefined;
});

const quizQuestion1Body = {
  question: 'Who is the Monarch of England?',
  duration: 0.5,
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

describe('/////// TESTING /v1/player/{playerid}/results ///////', () => {
  beforeEach(() => {
    person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
    quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
    requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
    session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 1);
    player1 = requestPlayerJoin(session1.body.sessionId, 'Zhi Zhao');
    question = requestPlayerQuestionInfo(player1.body.playerId, 1);
    sleepSync(0.1 * 1000);
  });

  describe('/////// Testing /v1/player/{playerid}/results success ///////', () => {
    test('CASE: 1 question that is answered correctly by 1 players', () => {
      requestPlayerQuestionAnswer(player1.body.playerId, 1, [question.body.answers[1].answerId]);

      sleepSync(1 * 1000);
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');

      result1 = requestPlayerFinalResults(player1.body.playerId);
      expect(result1.body).toStrictEqual({
        usersRankedByScore: [
          {
            name: 'Zhi Zhao',
            score: 5
          }
        ],
        questionResults: [
          {
            questionId: question.body.questionId,
            questionCorrectBreakdown: [
              {
                answerId: expect.any(Number),
                playersCorrect: ['Zhi Zhao']
              },
            ],
            averageAnswerTime: 0,
            percentCorrect: 100
          }
        ]
      });
      expect(result1.status).toBe(OK);
    });
  });

  describe('/////// Testing /v1/player/{playerid}/results error ///////', () => {
    test('CASE (400): playerId does not exist', () => {
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
      sleepSync(quizQuestion1Body.duration * 1000 + 1000);
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
      requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
      result1 = requestPlayerFinalResults(player1.body.playerId + 1);

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });

    test('CASE (400): Session is not in FINAL_RESULTS state', () => {
      result1 = requestPlayerFinalResults(player1.body.playerId + 1);

      expect(result1.body).toStrictEqual({ error: expect.any(String) });
      expect(result1.status).toBe(INPUT_ERROR);
    });
  });
});
