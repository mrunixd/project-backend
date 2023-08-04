import { deleteRequest } from '../helper';
beforeEach(() => {
  deleteRequest('/v1/clear', {});
});

describe('////////TESTING v1/clear////////', () => {
  test('test clear() returns {}', () => {
    const result1 = deleteRequest('/v1/clear', {});
    expect(result1.body).toStrictEqual({});
  });
});
