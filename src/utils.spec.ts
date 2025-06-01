import { cast } from '../src/utils';
import { buildCounter } from '../src/utils';

// Test generated using Keploy
test('test_cast_returnsSamePayload', () => {
  const numberPayload = 42;
  const stringPayload = 'test';
  const objectPayload = { key: 'value' };
  const arrayPayload = [1, 2, 3];

  expect(cast(numberPayload)).toBe(numberPayload);
  expect(cast(stringPayload)).toBe(stringPayload);
  expect(cast(objectPayload)).toBe(objectPayload);
  expect(cast(arrayPayload)).toBe(arrayPayload);

  // Validate that types are preserved
  expect(typeof cast(numberPayload)).toBe('number');
  expect(typeof cast(stringPayload)).toBe('string');
  expect(typeof cast(objectPayload)).toBe('object');
  expect(Array.isArray(cast(arrayPayload))).toBe(true);
});

// Test generated using Keploy
test('default behavior of buildCounter increments correctly', () => {
  const counter1 = buildCounter();
  const counter2 = buildCounter();

  expect(counter1()).toBe(1);
  expect(counter1()).toBe(2);
  expect(counter2()).toBe(1);
});
