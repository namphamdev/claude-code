export function intersperse<A>(as: A[], separator: (index: number) => A): A[] {
  return as.flatMap((a, i) => (i ? [separator(i), a] : [a]))
}

/**
 * Counts the number of elements in an array that satisfy the predicate.
 * Uses a traditional for loop instead of for..of to avoid iterator allocation
 * and improve execution speed in tight loops (e.g. counting messages/tools).
 */
export function count<T>(arr: readonly T[], pred: (x: T) => unknown): number {
  let n = 0
  for (let i = 0, len = arr.length; i < len; i++) {
    n += +!!pred(arr[i])
  }
  return n
}

export function uniq<T>(xs: Iterable<T>): T[] {
  return [...new Set(xs)]
}
