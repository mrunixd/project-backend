import request from 'sync-request';
import config from './config.json';

export const OK = 200;
export const INPUT_ERROR = 400;
export const UNAUTHORISED = 401;
export const FORBIDDEN = 403;
export const port = config.port;
export const url = config.url;
export const SERVER_URL = `${url}:${port}`;

export function postRequest(route: string, json: any) {
  const res = request('POST', `${SERVER_URL}${route}`, { json: json });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function deleteRequest(route: string, qs: any) {
  const res = request('DELETE', `${SERVER_URL}${route}`, { qs: qs });
  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function putRequest(route: string, json: any) {
  const res = request('PUT', `${SERVER_URL}${route}`, { json: json });

  return {
    status: res.statusCode,
    body: JSON.parse(res.body.toString())
  };
}

export function getRequest(route: string, qs: any) {
  const res = request('GET', `${SERVER_URL}${route}`, { qs: qs });
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
  const response = getRequest(`/v1/admin/user/details?token=${token}`, {});
  return response;
}

export function requestAdminAuthLogout(token: string) {
  const response = postRequest('/v1/admin/auth/logout', { token });
  return response;
}

export function requestAdminAuthUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string) {
  const response = putRequest('/v1/admin/user/details', { token, email, nameFirst, nameLast });
  return response;
}

export function requestAdminAuthUpdatePassword(token: string, oldPassword: string, newPassword: string) {
  const response = putRequest('/v1/admin/user/password', { token, oldPassword, newPassword });
  return response;
}

export function requestAdminQuizCreate(token: string, name: string, description: string) {
  const response = postRequest('/v1/admin/quiz', { token, name, description });
  return response;
}

export function requestAdminQuizList(token: string) {
  const response = getRequest(`/v1/admin/quiz/list?token=${token}`, {});
  return response;
}

export function requestAdminQuizDelete(quizId: string, token: string) {
  const response = deleteRequest(`/v1/admin/quiz/${quizId}?token=${token}`, {});
  return response;
}

export function requestAdminQuizInfo(quizId: string, token: string) {
  const response = getRequest(`/v1/admin/quiz/${quizId}?token=${token}`, {});
  return response;
}

export function requestAdminQuizNameUpdate(quizId: string, token: string, name: string) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/name`, { token, name });
  return response;
}

export function requestAdminQuizDescriptionUpdate(quizId: string, token: string, description: string) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/description`, { token, description });
  return response;
}

export function requestAdminQuizQuestionCreate(quizId: string, token: string, questionBody: any) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/question`, { token, questionBody });
  return response;
}

export function requestAdminQuizTrashList(token: string) {
  const response = getRequest(`/v1/admin/quiz/trash?token=${token}`, {});
  return response;
}

export function requestAdminQuizRestore(quizId: string, token: string) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/restore`, { token });
  return response;
}

// export function requestAdminQuizTrashEmpty(token: string, quizIds: string[]) {
//   const response = deleteRequest(`/v1/admin/quiz/trash/empty`, { token, quizIds });
//   return response;
// }

export function requestAdminQuizTransfer(quizId: string, token: string, userEmail: string) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/transfer`, { token, userEmail });
  return response;
}

export function requestAdminQuizQuestionUpdate(quizId: string, questionId: string, token: string, questionBody: any) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/question/${questionId}`, { token, questionBody });
  return response;
}

export function requestAdminQuizQuestionMove(quizId: string, questionId: string, token: string, newPosition: number) {
  const response = putRequest(`/v1/admin/quiz/${quizId}/question/${questionId}/move`, { token, newPosition });
  return response;
}

export function requestAdminQuizQuestionDuplicate(quizId: string, questionId: string, token: string) {
  const response = postRequest(`/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, { token });
  return response;
}

export function requestAdminQuizQuestionDelete(quizId: string, questionId: string, token: string) {
  const response = deleteRequest(`/v1/admin/quiz/${quizId}/question/${questionId}?token=${token}`, {});
  return response;
}
