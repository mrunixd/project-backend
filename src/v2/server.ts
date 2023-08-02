import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';

import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminAuthLogout,
  adminAuthUpdateDetails,
  adminAuthUpdatePassword
} from './auth';

import {
  adminQuizCreate,
  adminQuizList,
  adminQuizInfo,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizQuestion,
  adminQuizTransfer,
  adminQuizQuestionMove,
  adminQuizQuestionDuplicate,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizTrashEmpty,
  adminQuizQuestionUpdate,
  adminQuizQuestionDelete,
  adminQuizSessionStart,
  adminQuizSessionUpdate,
  adminQuizSessionStatus,
  adminQuizThumbnailUpdate,
  adminQuizSessionResults
} from './quiz';

import { playerJoin, playerStatus, playerResults, playerSendMessage, playerViewMessages } from './player';
import { clear, sessionIdtoUserId, checkValidToken, fullTokenCheck } from './other';
import HTTPError from 'http-errors';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use(
  '/docs',
  sui.serve,
  sui.setup(YAML.parse(file), {
    swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' },
  })
);

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// ROUTE: clear
app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  // clearImagesDirectory();
  return res.json(response);
});

// ROUTE: adminAuthRegister
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminAuthLogin
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);

  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ====================================================================
//  ================= ITERATION 2 (v1) ROUTES BELOW ===================
// ====================================================================
// ROUTE: adminUserDetails
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token.toString();

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminUserDetails(userId); return res.json(response);
});

// ROUTE: adminQuizTrash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }
  const response = adminQuizTrash(userId); return res.json(response);
});

// ROUTE: adminQuizList
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token.toString();

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizList(userId); return res.json(response);
});

// ROUTE: adminQuizCreate
app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizCreate(userId, name, description);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizRemove
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizid = parseInt(req.params.quizid);
  const token = req.query.token.toString();

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }
  const response = adminQuizRemove(userId, quizid);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizInfo
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizid = parseInt(req.params.quizid);
  const token = req.query.token.toString();

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizInfo(userId, quizid);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizNameUpdate
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, name } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizNameUpdate(userId, quizId, name);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.status(200).json(response);
});

// ROUTE: adminQuizDescriptionUpdate
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizDescriptionUpdate(userId, quizId, description);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.status(200).json(response);
});

// ROUTE: adminAuthLogout
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);

  const response = adminAuthLogout(userId);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.status(200).json(response);
});

// ROUTE: adminAuthUpdateDetails
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminAuthUpdateDetails(userId, email, nameFirst, nameLast);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.status(200).json(response);
});

// ROUTE: adminAuthUpdatePassword
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'Token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminAuthUpdatePassword(userId, oldPassword, newPassword);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  return res.status(200).json(response);
});

// ROUTE: adminQuizRestore
app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }
  const response = adminQuizRestore(userId, quizId);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizTrashEmpty
app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIds = req.query.quizIds.toString().slice(1, -1);
  const quizIdsArr = quizIds.split(',');
  const token = req.query.token.toString();

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }
  const response = adminQuizTrashEmpty(quizIdsArr, userId);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizTransfer
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, userEmail } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizTransfer(userId, quizId, userEmail);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizQuestion
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;

  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  const response = adminQuizQuestion(userId, quizId, questionBody);
  if ('error' in response) {
    return res.status(400).json(response);
  } return res.json(response);
});

// ROUTE: adminQuizQuestionUpdate
app.put(
  '/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const { token, questionBody } = req.body;

    if (!checkValidToken(token)) {
      return res.status(401).json({ error: 'token has invalid structure' });
    }
    const userId = sessionIdtoUserId(token);
    if (userId === -1) {
      return res.status(403).json({
        error:
          'Provided token is valid structure, but is not for a currently logged in session',
      });
    }

    const response = adminQuizQuestionUpdate(
      userId,
      quizId,
      questionId,
      questionBody
    );
    if ('error' in response) {
      return res.status(400).json(response);
    }
    return res.json(response);
  }
);

// ROUTE: adminQuizQuestionDelete
app.delete(
  '/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = req.query.token.toString();

    if (!checkValidToken(token)) {
      return res.status(401).json({ error: 'token has invalid structure' });
    }
    const userId = sessionIdtoUserId(token);
    if (userId === -1) {
      return res.status(403).json({
        error:
          'Provided token is valid structure, but is not for a currently logged in session',
      });
    }
    const response = adminQuizQuestionDelete(userId, quizId, questionId);
    if ('error' in response) {
      return res.status(400).json(response);
    }
    return res.json(response);
  }
);

// ROUTE: adminQuizQuestionMove
app.put(
  '/v1/admin/quiz/:quizid/question/:questionid/move',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const { token, newPosition } = req.body;

    if (!checkValidToken(token)) {
      return res.status(401).json({ error: 'token has invalid structure' });
    }
    const userId = sessionIdtoUserId(token);
    if (userId === -1) {
      return res.status(403).json({
        error:
          'Provided token is valid structure, but is not for a currently logged in session',
      });
    }

    const response = adminQuizQuestionMove(
      userId,
      quizId,
      questionId,
      newPosition
    );
    if ('error' in response) {
      return res.status(400).json(response);
    }
    return res.json(response);
  }
);
// ROUTE: adminQuizQuestionDuplicate
app.post(
  '/v1/admin/quiz/:quizid/question/:questionid/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const { token } = req.body;

    if (!checkValidToken(token)) {
      return res.status(401).json({ error: 'token has invalid structure' });
    }
    const userId = sessionIdtoUserId(token);
    if (userId === -1) {
      return res.status(403).json({
        error:
          'Provided token is valid structure, but is not for a currently logged in session',
      });
    }

    const response = adminQuizQuestionDuplicate(userId, quizId, questionId);
    if ('error' in response) {
      return res.status(400).json(response);
    }
    return res.json(response);
  }
);

// ====================================================================
//  ================= ITERATION 3 (v2) ROUTES BELOW ===================
// ====================================================================
// ROUTE: adminUserDetails
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const userId = fullTokenCheck(token);
  const response = adminUserDetails(userId); return res.json(response);
});

// ROUTE: adminQuizTrash
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const userId = fullTokenCheck(token);

  const response = adminQuizTrash(userId); return res.json(response);
});

// ROUTE: adminQuizList
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const userId = fullTokenCheck(token);
  const response = adminQuizList(userId); return res.json(response);
});

// ROUTE: adminQuizCreate
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const { name, description } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizCreate(userId, name, description);
  return res.json(response);
});

// ROUTE: adminQuizRemove
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizid = parseInt(req.params.quizid);
  const token = req.headers.token.toString();

  const userId = fullTokenCheck(token);
  const response = adminQuizRemove(userId, quizid);
  return res.json(response);
});

// ROUTE: adminQuizInfo
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizid = parseInt(req.params.quizid);
  const token = req.headers.token.toString();

  const userId = fullTokenCheck(token);
  const response = adminQuizInfo(userId, quizid);
  return res.json(response);
});

// ROUTE: adminQuizNameUpdate
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();
  const { name } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizNameUpdate(userId, quizId, name);
  return res.json(response);
});

// ROUTE: adminQuizDescriptionUpdate
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();
  const { description } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizDescriptionUpdate(userId, quizId, description);
  return res.json(response);
});

// ROUTE: adminAuthLogout
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  if (!checkValidToken(token)) {
    throw HTTPError(401, { error: 'token has invalid structure' });
  }
  const userId = sessionIdtoUserId(token);
  const response = adminAuthLogout(userId); return res.json(response);
});

// ROUTE: adminAuthUpdateDetails
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const { email, nameFirst, nameLast } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminAuthUpdateDetails(userId, email, nameFirst, nameLast);
  return res.json(response);
});

// ROUTE: adminAuthUpdatePassword
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.headers.token.toString();
  const { oldPassword, newPassword } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminAuthUpdatePassword(userId, oldPassword, newPassword);
  return res.json(response);
});

// ROUTE: adminQuizRestore
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();

  const userId = fullTokenCheck(token);
  const response = adminQuizRestore(userId, quizId);
  return res.json(response);
});

// ROUTE: adminQuizTrashEmpty
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIds = req.query.quizIds.toString().slice(1, -1);
  const quizIdsArr = quizIds.split(',');
  const token = req.headers.token.toString();

  const userId = fullTokenCheck(token);
  const response = adminQuizTrashEmpty(quizIdsArr, userId);
  return res.json(response);
});

// ROUTE: adminQuizTransfer
app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();
  const { userEmail } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizTransfer(userId, quizId, userEmail);
  return res.json(response);
});

// ROUTE: adminQuizQuestion
app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();
  const { questionBody } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizQuestion(userId, quizId, questionBody);
  return res.json(response);
});

// ROUTE: adminQuizQuestionUpdate
app.put(
  '/v2/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = req.headers.token.toString();
    const { questionBody } = req.body;

    const userId = fullTokenCheck(token);
    const response = adminQuizQuestionUpdate(
      userId,
      quizId,
      questionId,
      questionBody
    );

    return res.json(response);
  }
);

// ROUTE: adminQuizQuestionDelete
app.delete(
  '/v2/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = req.headers.token.toString();

    const userId = fullTokenCheck(token);
    const response = adminQuizQuestionDelete(userId, quizId, questionId);

    return res.json(response);
  }
);

// ROUTE: adminQuizQuestionMove
app.put(
  '/v2/admin/quiz/:quizid/question/:questionid/move',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = req.headers.token.toString();
    const { newPosition } = req.body;

    const userId = fullTokenCheck(token);
    const response = adminQuizQuestionMove(
      userId,
      quizId,
      questionId,
      newPosition
    );
    return res.json(response);
  }
);
// ROUTE: adminQuizQuestionDuplicate
app.post(
  '/v2/admin/quiz/:quizid/question/:questionid/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);
    const token = req.headers.token.toString();

    const userId = fullTokenCheck(token);
    const response = adminQuizQuestionDuplicate(userId, quizId, questionId);

    return res.json(response);
  }
);

// ROUTE: adminQuizSessionStart
app.post(
  '/v1/admin/quiz/:quizid/session/start',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const token = req.headers.token.toString();
    const { autoStartNum } = req.body;

    const userId = fullTokenCheck(token);
    const response = adminQuizSessionStart(userId, quizId, autoStartNum);

    return res.json(response);
  }
);

// ROUTE: adminQuizSessionUpdate
app.put(
  '/v1/admin/quiz/:quizid/session/:sessionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const sessionId = parseInt(req.params.sessionid);
    const token = req.headers.token.toString();
    const { action } = req.body;

    const userId = fullTokenCheck(token);
    const response = adminQuizSessionUpdate(userId, quizId, sessionId, action.toString());

    return res.json(response);
  }
);

// ROUTE: adminQuizSessionStatus
app.get(
  '/v1/admin/quiz/:quizid/session/:sessionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const sessionId = parseInt(req.params.sessionid);
    const token = req.headers.token.toString();

    const userId = fullTokenCheck(token);
    const response = adminQuizSessionStatus(userId, quizId, sessionId);

    return res.json(response);
  }
);

// ROUTE: adminQuizSessionResults
app.get(
  '/v1/admin/quiz/:quizid/session/:sessionid/results',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const sessionId = parseInt(req.params.sessionid);
    const token = req.headers.token.toString();

    const userId = fullTokenCheck(token);
    const response = adminQuizSessionResults(userId, quizId, sessionId);

    return res.json(response);
  }
);

// ROUTE: playerJoin
app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;

  const response = playerJoin(sessionId, name);

  return res.json(response);
});

// ROUTE: playerStatus
app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const response = playerStatus(playerId);

  return res.json(response);
});

// ROUTE: playerSendMessage
app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;

  const response = playerSendMessage(playerId, message);
  return res.json(response);
});

// ROUTE: playerResults
app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const response = playerResults(playerId);

  return res.json(response);
});

// ROUTE: playerViewMessages
app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);

  const response = playerViewMessages(playerId);
  return res.json(response);
});

// ROUTE: adminQuizThumbnailUpdate
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token.toString();
  const { imgUrl } = req.body;

  const userId = fullTokenCheck(token);
  const response = adminQuizThumbnailUpdate(userId, quizId, imgUrl);
  return res.json(response);
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
