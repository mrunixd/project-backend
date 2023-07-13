import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import { adminAuthRegister, adminAuthLogin, adminUserDetails, adminAuthLogout, adminAuthUpdateDetails } from './auth';
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
} from './quiz';
import { clear, sessionIdtoUserId, checkValidToken } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
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

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// setData(getDataGlobal());
// setInterval(function() {setDataGlobal()}, 1000);

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  const ret = echo(data);
  if ('error' in ret) {
    res.status(400);
  }
  return res.json(ret);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in response) {
    return res.status(400).json(response);
  }
  return res.json(response);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);

  if ('error' in response) {
    return res.status(400).json(response);
  }
  return res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  return res.json(response);
});

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

  const response = adminUserDetails(userId);
  return res.json(response);
});

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
  }
  return res.json(response);
});

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

  const response = adminQuizList(userId);
  return res.json(response);
});

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
  const response = adminQuizTrash(userId);
  return res.json(response);
});

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
  }
  return res.json(response);
});

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
  }
  return res.json(response);
});

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
  }
  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, name } = req.body;

  // Status 401
  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);

  // Status 403
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  // Status 400
  const response = adminQuizNameUpdate(userId, quizId, name);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  // Status 200
  return res.status(200).json(response);
});

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
  }
  return res.json(response);
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;

  // Status 401
  if (!checkValidToken(token)) {
    return res.status(401).json({ error: 'token has invalid structure' });
  }

  const userId = sessionIdtoUserId(token);

  // Status 403
  if (userId === -1) {
    return res.status(403).json({
      error:
        'Provided token is valid structure, but is not for a currently logged in session',
    });
  }

  // Status 400
  const response = adminQuizDescriptionUpdate(userId, quizId, description);
  if ('error' in response) {
    return res.status(400).json(response);
  }

  // Status 200
  return res.status(200).json(response);
});

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
  }
  return res.json(response);
});

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
  }
  return res.json(response);
});
// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
