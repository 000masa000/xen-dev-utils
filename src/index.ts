import {Fraction, mmod} from './fraction';

export * from './fraction';
export * from './primes';
export * from './conversion';
export * from './combinations';
export * from './monzo';
export * from './approximation';

export interface AnyArray {
  [key: number]: any;
  length: number;
}

export interface NumberArray {
  [key: number]: number;
  length: number;
}

/**
 * Check if the contents of two arrays are equal using '==='.
 * @param a The first array.
 * @param b The second array.
 * @returns True if the arrays are component-wise equal.
 */
export function arraysEqual(a: AnyArray, b: AnyArray) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Floor division.
 * @param a The dividend.
 * @param b The divisor.
 * @returns The quotient of Euclidean division of a by b.
 */
export function div(a: number, b: number): number {
  return Math.floor(a / b);
}

/** Result of the extended Euclidean algorithm. */
export type ExtendedEuclid = {
  /** Bézout coefficient of the first parameter.  */
  coefA: number;
  /** Bézout coefficient of the second parameter.  */
  coefB: number;
  /** Greatest common divisor of the parameters. */
  gcd: number;
  /** Quotient of the first parameter when divided by the gcd */
  quotientA: number;
  /** Quotient of the second parameter when divided by the gcd */
  quotientB: number;
};

// https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Pseudocode
/**
 * Extended Euclidean algorithm for integers a and b:
 * Find x and y such that ax + by = gcd(a, b).
 * ```ts
 * result.gcd = a * result.coefA + b * result.coefB;  // = gcd(a, b)
 * result.quotientA = div(a, gcd(a, b));
 * result.quotientB = div(b, gcd(a, b));
 * ```
 * @param a The first integer.
 * @param b The second integer.
 * @returns Bézout coefficients, gcd and quotients.
 */
export function extendedEuclid(a: number, b: number): ExtendedEuclid {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  }

  let [rOld, r] = [a, b];
  let [sOld, s] = [1, 0];
  let [tOld, t] = [0, 1];

  while (r !== 0) {
    const quotient = div(rOld, r);
    [rOld, r] = [r, rOld - quotient * r];
    [sOld, s] = [s, sOld - quotient * s];
    [tOld, t] = [t, tOld - quotient * t];
  }

  return {
    coefA: sOld,
    coefB: tOld,
    gcd: rOld,
    quotientA: t,
    quotientB: Math.abs(s),
  };
}

/**
 * Iterated (extended) Euclidean algorithm.
 * @param params An iterable of integers.
 * @returns Bézout coefficients of the parameters.
 */
export function iteratedEuclid(params: Iterable<number>) {
  const coefs = [];
  let a: number | undefined = undefined;
  for (const param of params) {
    if (a === undefined) {
      a = param;
      coefs.push(1);
      continue;
    }
    const ee = extendedEuclid(a, param);
    for (let j = 0; j < coefs.length; ++j) {
      coefs[j] *= ee.coefA;
    }
    a = ee.gcd;
    coefs.push(ee.coefB);
  }
  return coefs;
}

/**
 * Collection of unique fractions.
 */
export class FractionSet extends Set<Fraction> {
  /**
   * Check `value` membership.
   * @param value Value to check for membership.
   * @returns A boolean asserting whether an element is present with the given value in the `FractionSet` object or not.
   */
  has(value: Fraction) {
    for (const other of this) {
      if (other.equals(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Appends `value` to the `FractionSet` object.
   * @param value Value to append.
   * @returns The `FractionSet` object with added value.
   */
  add(value: Fraction) {
    if (this.has(value)) {
      return this;
    }
    super.add(value);
    return this;
  }

  /**
   * Removes the element associated to the `value`.
   * @param value Value to remove.
   * @returns A boolean asserting whether an element was successfully removed or not. `FractionSet.prototype.has(value)` will return `false` afterwards.
   */
  delete(value: Fraction) {
    for (const other of this) {
      if (other.equals(value)) {
        return super.delete(other);
      }
    }
    return false;
  }
}

// https://stackoverflow.com/a/37716142
// step 1: a basic LUT with a few steps of Pascal's triangle
const BINOMIALS = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
  [1, 6, 15, 20, 15, 6, 1],
  [1, 7, 21, 35, 35, 21, 7, 1],
  [1, 8, 28, 56, 70, 56, 28, 8, 1],
];

// step 2: a function that builds out the LUT if it needs to.
/**
 * Calculate the Binomial coefficient *n choose k*.
 * @param n Size of the set to choose from.
 * @param k Number of elements to choose.
 * @returns The number of ways to choose `k` (unordered) elements from a set size `n`.
 */
export function binomial(n: number, k: number) {
  while (n >= BINOMIALS.length) {
    const s = BINOMIALS.length;
    const lastRow = BINOMIALS[s - 1];
    const nextRow = [1];
    for (let i = 1; i < s; i++) {
      nextRow.push(lastRow[i - 1] + lastRow[i]);
    }
    nextRow.push(1);
    BINOMIALS.push(nextRow);
  }
  return BINOMIALS[n][k];
}

/**
 * Clamp a value to a finite range.
 * @param minValue Lower bound.
 * @param maxValue Upper bound.
 * @param value Value to clamp between bounds.
 * @returns Clamped value.
 */
export function clamp(minValue: number, maxValue: number, value: number) {
  if (value < minValue) {
    return minValue;
  }
  if (value > maxValue) {
    return maxValue;
  }
  return value;
}

/**
 * Calculate the inner (dot) product of two arrays of real numbers.
 * @param a The first array of numbers.
 * @param b The second array of numbers.
 * @returns The dot product.
 */
export function dot(a: NumberArray, b: NumberArray): number {
  let result = 0;
  for (let i = 0; i < Math.min(a.length, b.length); ++i) {
    result += a[i] * b[i];
  }
  return result;
}

/**
 * Calculate the norm (vector length) of an array of real numbers.
 * @param array The array to measure.
 * @param type Type of measurement.
 * @returns The length of the vector.
 */
export function norm(
  array: NumberArray,
  type: 'euclidean' | 'taxicab' | 'maximum' = 'euclidean'
) {
  let result = 0;
  for (let i = 0; i < array.length; ++i) {
    if (type === 'taxicab') {
      result += Math.abs(array[i]);
    } else if (type === 'maximum') {
      result = Math.max(result, Math.abs(array[i]));
    } else {
      result += array[i] * array[i];
    }
  }
  if (type === 'euclidean') {
    return Math.sqrt(result);
  }
  return result;
}

/**
 * Calculate the difference between two cents values such that equave equivalence is taken into account.
 * @param a The first pitch measured in cents.
 * @param b The second pitch measured in cents.
 * @param equaveCents The interval of equivalence measured in cents.
 * @returns The first pitch minus the second pitch but on a circle such that large differences wrap around.
 */
export function circleDifference(a: number, b: number, equaveCents = 1200.0) {
  const half = 0.5 * equaveCents;
  return mmod(a - b + half, equaveCents) - half;
}

/**
 * Calculate the distance between two cents values such that equave equivalence is taken into account.
 * @param a The first pitch measured in cents.
 * @param b The second pitch measured in cents.
 * @param equaveCents The interval of equivalence measured in cents.
 * @returns The absolute distance between the two pitches measured in cents but on a circle such that large distances wrap around.
 */
export function circleDistance(a: number, b: number, equaveCents = 1200.0) {
  return Math.abs(circleDifference(a, b, equaveCents));
}
