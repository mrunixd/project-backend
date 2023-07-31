import request from 'sync-request';
import config from './config.json';
import { IncomingHttpHeaders } from 'http';

export const OK = 200;
export const INPUT_ERROR = 400;
export const UNAUTHORISED = 401;
export const FORBIDDEN = 403;
export const port = config.port;
export const url = config.url;
export const SERVER_URL = `${url}:${port}`;

export function postRequest(route: string, json: any, headers: IncomingHttpHeaders = {}) {
  const res = request('POST', `${SERVER_URL}${route}`, { json: json, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function deleteRequest(route: string, qs: any, headers: IncomingHttpHeaders = {}) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function putRequest(route: string, json: any, headers: IncomingHttpHeaders = {}) {
  const res = request('PUT', `${SERVER_URL}${route}`, { json: json, headers: headers });

  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function getRequest(route: string, qs: any, headers: IncomingHttpHeaders = {}) {
  const res = request('GET', `${SERVER_URL}${route}`, { qs: qs, headers: headers });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}
export function requestAdminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const response = postRequest('/v1/admin/auth/register', { email, password, nameFirst, nameLast });
  return response;
}

export function requestAdminAuthLogin(email: string, password: string) {
  const response = postRequest('/v1/admin/auth/login', { email, password });
  return response;
}

export function requestAdminUserDetails(token: string) {
  const response = getRequest('/v2/admin/user/details', {}, { token });
  return response;
}

export function requestAdminAuthLogout(token: string) {
  const response = postRequest('/v2/admin/auth/logout', {}, { token });
  return response;
}

export function requestAdminAuthUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string) {
  const response = putRequest('/v2/admin/user/details', { email, nameFirst, nameLast }, { token });
  return response;
}

export function requestAdminAuthUpdatePassword(token: string, oldPassword: string, newPassword: string) {
  const response = putRequest('/v2/admin/user/password', { oldPassword, newPassword }, { token });
  return response;
}

export function requestAdminQuizCreate(token: string, name: string, description: string) {
  const response = postRequest('/v2/admin/quiz', { name, description }, { token });
  return response;
}

export function requestAdminQuizList(token: string) {
  const response = getRequest('/v2/admin/quiz/list', {}, { token });
  return response;
}

export function requestAdminQuizDelete(quizId: string, token: string) {
  const response = deleteRequest(`/v2/admin/quiz/${quizId}`, {}, { token });
  return response;
}

export function requestAdminQuizInfo(quizId: string, token: string) {
  const response = getRequest(`/v2/admin/quiz/${quizId}`, {}, { token });
  return response;
}

export function requestAdminQuizNameUpdate(quizId: string, token: string, name: string) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/name`, { name }, { token });
  return response;
}

export function requestAdminQuizDescriptionUpdate(quizId: string, token: string, description: string) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/description`, { description }, { token });
  return response;
}

export function requestAdminQuizTrashList(token: string) {
  const response = getRequest('/v2/admin/quiz/trash', {}, { token });
  return response;
}

export function requestAdminQuizRestore(quizId: string, token: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/restore`, {}, { token });
  return response;
}

export function requestAdminQuizTrashEmpty(token: string, quizIds: string) {
  const response = deleteRequest('/v2/admin/quiz/trash/empty', { quizIds }, { token });
  return response;
}

export function requestAdminQuizTransfer(quizId: string, token: string, userEmail: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/transfer`, { userEmail }, { token });
  return response;
}

export function requestAdminQuizQuestion(quizId: string, token: string, questionBody: any) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/question`, { questionBody }, { token });
  return response;
}

export function requestAdminQuizQuestionUpdate(quizId: string, questionId: string, token: string, questionBody: any) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/question/${questionId}`, { questionBody }, { token });
  return response;
}

export function requestAdminQuizQuestionMove(quizId: string, questionId: string, token: string, newPosition: number) {
  const response = putRequest(`/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition }, { token });
  return response;
}

export function requestAdminQuizQuestionDuplicate(quizId: string, questionId: string, token: string) {
  const response = postRequest(`/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token });
  return response;
}

export function requestAdminQuizQuestionDelete(quizId: string, questionId: string, token: string) {
  const response = deleteRequest(`/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token });
  return response;
}

export function requestAdminQuizSessionStart(token: string, quizId: string, autoStartNum: number) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, { token });
  return response;
}

export function requestAdminQuizSessionUpdate(token: string, quizId: string, sessionId: string, action: string) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/session/${sessionId}`, { action }, { token });
  return response;
}

export function requestAdminQuizSessionStatus(token: string, quizId: string, sessionId: string) {
  const response = getRequest(`/v1/admin/quiz/${quizId}/session/${sessionId}`, {}, { token });
}

export function requestPlayerJoin(sessionId: number, name: string) {
  const response = postRequest('/v1/player/join', { sessionId, name });
  return response;
}
