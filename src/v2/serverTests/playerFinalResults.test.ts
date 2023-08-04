import {
    deleteRequest,
    requestAdminAuthRegister,
    requestAdminQuizCreate,
    requestAdminQuizQuestion,
    requestAdminQuizSessionStart,
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
  let question1: any;
  let question2: any;
  let question3: any;
  let player1: any;
  let player2: any;
  let session1: any;
  let result1: any;
  
  beforeEach(() => {
    deleteRequest('/v1/clear', {});
    person1 = undefined;
    quiz1 = undefined;
    question1 = undefined;
    question2 = undefined;
    question3 = undefined;
    player1 = undefined;
    player2 = undefined;
    session1 = undefined;
    result1 = undefined;
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
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
  };
  
  const quizQuestion2Body = {
    question: 'Which movie is better?',
    duration: 0.1,
    points: 10,
    answers: [
      {
        answer: 'Oppenheimer',
        correct: false,
      },
      {
        answer: 'Barbie',
        correct: true,
      },
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
  };
  
  const quizQuestion3Body = {
    question: 'What letter comes after A?',
    duration: 0.1,
    points: 5,
    answers: [
      {
        answer: 'C',
        correct: false,
      },
      {
        answer: 'B',
        correct: true,
      },
    ],
    thumbnailUrl: 'https://media.sproutsocial.com/uploads/Homepage_Header-Listening.png',
  };
  
  describe('/////// TESTING /v1/player/{playerid}/results ///////', () => {
    beforeEach(() => {
      person1 = requestAdminAuthRegister('vincentxian@gmail.com', 'password1', 'vincent', 'xian');
      quiz1 = requestAdminQuizCreate(`${person1.body.token}`, 'first quiz', 'first quiz being tested');
      question1 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion1Body);
      session1 = requestAdminQuizSessionStart(`${person1.body.token}`, `${quiz1.body.quizId}`, 3);
      player1 = requestPlayerJoin(session1.body.sessionId, 'Zhi Zhao');
    });
  
    describe('/////// Testing /v1/player/{playerid}/results success ///////', () => {
      test('CASE: 1 question, 1 player', () => {
        requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
        sleepSync(quizQuestion1Body.duration * 1000 + 1000);
        requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_ANSWER');
        requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
        result1 = requestPlayerFinalResults(player1.body.playerId);
    
        expect(result1.body).toStrictEqual(
        {
            usersRankedByScore: 
            [
                {
                name: 'Zhi Zhao',
                score: 0
                }
            ],
            questionResults: 
            [
                {
                    questionId: 0,
                    questionCorrectBreakdown: 
                    [
                        {
                            answerId: 1,
                            playersCorrect: []
                        }
                    ]
                }
            ],

            averageAnswerTime: 0,
            percentCorrect: 0
        });
        expect(result1.status).toBe(OK);
      });
  
    //   test('CASE: 3 questions, 2 players', () => {
    //     question2 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion2Body);
    //     question3 = requestAdminQuizQuestion(`${quiz1.body.quizId}`, `${person1.body.token}`, quizQuestion3Body);
  
    //     requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
    //     // answers submitted by players
    //     // player1, correct, 5
    //     // player2, correct, 5
    //     sleepSync(quizQuestion1Body.duration * 1000 + 1000);
    //     requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
    //     // answers submitted by players
    //     // player1, correct, 15
    //     // player2, incorrect, 5
    //     sleepSync(quizQuestion1Body.duration * 1000 + 1000);
    //     requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'NEXT_QUESTION');
    //     // answers submitted by players
    //     // player1, incorrect, 15
    //     // player2, correct, 10
  
    //     requestAdminQuizSessionUpdate(`${person1.body.token}`, `${quiz1.body.quizId}`, `${session1.body.sessionId}`, 'GO_TO_FINAL_RESULTS');
  
    //     result1 = requestPlayerFinalResults(player1.body.playerId);
    //     expect(result1.body).toStrictEqual({
    //       usersRankedByScore: [
    //       {
    //         name: 'Zhi Zhao',
    //         score: 15
    //       },
    //       {
    //         name: 'Vincent Xian',
    //         score: 10
    //       }
    //     ],
    //       questionResults: [
    //         {
    //           questionId: question1.body.questionId,
    //           questionCorrectBreakdown: [
    //             {
    //               answerId: expect.any(Number),
    //               playersCorrect: ["Zhi Zhao", "Vincent Xian"]
    //             },
    //             {
    //               answerId: expect.any(Number),
    //               playersCorrect: ["Zhi Zhao"]
    //             },
    //             {
    //               answerId: expect.any(Number),
    //               playersCorrect: ["Vincent Xian"]
    //             }
    //           ]
    //         }
    //       ]
    //     });
    //     expect(result1.body).toBe(OK);
    //   });
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