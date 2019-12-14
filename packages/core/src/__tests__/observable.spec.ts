// tslint:disable: no-string-literal
import Observable from '../Observable';

describe('packages/core/src/Observable.ts - Observable', () => {
  let emitter: Observable;

  beforeEach(() => {
    emitter = new Observable();
  });

  test('default events value', () => {
    expect(emitter['events']).toEqual({});
  });

  test('register listener', async () => {
    const funcA = jest.fn();
    const funcB = jest.fn();

    emitter.on('test', funcA);
    emitter.on('test', funcB);

    expect(emitter['events']).toHaveProperty('test');
    expect(emitter['events']['test']).toEqual([funcA, funcB]);
  });

  test('emit event', async () => {
    const f = jest.fn();

    emitter.on('test', f);
    await emitter.emit('test');

    expect(f).toHaveBeenCalledTimes(1);
  });

  test('emit event that does not have listeners', async () => {
    await emitter.emit('test');

    expect(emitter['events']).toHaveProperty('test');
  });
});
