/**
 * https://gist.github.com/axelpale/3118596
 *
 * Copyright 2012 Akseli Palén.
 * Created 2012-07-15.
 * Types added by Lumi Pakkanen on 2022-05-04
 * Licensed under the MIT license.
 *
 * <license>
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * </lisence>
 *
 * Implements functions to calculate combinations of elements in JS Arrays.
 *
 * Functions:
 *   kCombinations(set, k) -- Return all k-sized combinations in a set
 *   combinations(set) -- Return all combinations of the set
 */

/**
 * K-combinations
 *
 * Examples:
 * ```ts
 * kCombinations([1, 2, 3], 1)  // [[1], [2], [3]]
 * kCombinations([1, 2, 3], 2)  // [[1, 2], [1, 3], [2, 3]]
 * kCombinations([1, 2, 3], 3)  // [[1, 2, 3]]
 * kCombinations([1, 2, 3], 4)  // []
 * kCombinations([1, 2, 3], 0)  // []
 * kCombinations([1, 2, 3], -1)  // []
 * kCombinations([], 0)  // []
 * ```
 * @param set Array of objects of any type. They are treated as unique.
 * @param k Size of combinations to search for.
 * @returns Array of found combinations, size of a combination is k.
 */
export function kCombinations(set: any[], k: number): any[][] {
  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k === set.length) {
    return [set];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k === 1) {
    const combs: any[] = [];
    for (let i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}

  // Algorithm description:
  // To get k-combinations of a set, we want to join each element
  // with all (k-1)-combinations of the other elements. The set of
  // these k-sized sets would be the desired result. However, as we
  // represent sets with lists, we need to take duplicates into
  // account. To avoid producing duplicates and also unnecessary
  // computing, we use the following approach: each element i
  // divides the list into three: the preceding elements, the
  // current element i, and the subsequent elements. For the first
  // element, the list of preceding elements is empty. For element i,
  // we compute the (k-1)-computations of the subsequent elements,
  // join each with the element i, and store the joined to the set of
  // computed k-combinations. We do not need to take the preceding
  // elements into account, because they have already been the i:th
  // element so they are already computed and stored. When the length
  // of the subsequent list drops below (k-1), we cannot find any
  // (k-1)-combs, hence the upper limit for the iteration:
  const combs: any[] = [];
  for (let i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    const head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    const tailCombs = kCombinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (let j = 0; j < tailCombs.length; j++) {
      combs.push(head.concat(tailCombs[j]));
    }
  }
  return combs;
}

/**
 * Get all possible combinations of elements in a set.
 *
 * Examples:
 * ```ts
 * combinations([1, 2, 3])  // [[1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]
 * combinations([1])  // [[1]]
 * ```
 * @param set Array of objects of any type. They are treated as unique.
 * @returns Array of arrays representing all possible non-empty combinations of elements in a set.
 */
export function combinations(set: any[]): any[][] {
  const combs: any[] = [];

  // Calculate all non-empty k-combinations
  for (let k = 1; k <= set.length; k++) {
    const kCombs = kCombinations(set, k);
    for (let i = 0; i < kCombs.length; i++) {
      combs.push(kCombs[i]);
    }
  }
  return combs;
}
