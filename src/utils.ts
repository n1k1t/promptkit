export const cast = <T>(payload: T): T => payload;

/**
 * Builds a counter starting from `initial` value, incrementing by `step`.
 * @param initial Starting value of the counter, defaults to 0.
 * @param step The amount to increment each time, defaults to 1.
 */
export const buildCounter =
  (initial = 0, step = 1) =>
  () => {
    initial += step;
    return initial;
  };