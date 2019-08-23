import migration from '@underbase/core';
import underbase from '../index';

describe('Underbase', () => {
  test('module package export', () => {
    expect(underbase).toBe(migration);
  });
});
