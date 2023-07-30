import { deleteRequest } from '../helper';
let result1: any;
beforeEach(() => {
  deleteRequest('/v1/clear', {});
  result1 = undefined;
});

describe('////////TESTING v1/clear////////', () => {
  test('test clear() returns {}', () => {
    result1 = deleteRequest('/v1/clear', {});
    expect(result1.body).toStrictEqual({});
  });
});
