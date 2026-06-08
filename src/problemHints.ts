// Progressive hints, keyed by problemId. Each hint is a NUDGE, not the answer —
// they escalate from "what to think about" to "the approach", stopping short of
// the code (the spec's reference reveal is the final answer).
//
// Render (Codex): a "Need a hint?" control that reveals hints[0], then hints[1],
// ... one at a time, shown above the reference-solution reveal. Seeded on the
// hardest drills first; growing.
//
// Ownership: Claude.

export type ProblemHints = {
  problemId: string
  hints: string[]
}

export const problemHints: ProblemHints[] = [
  // Algorithms
  { problemId: 'algo-kadane', hints: ['At each element you either start fresh or extend the current run — which is larger?', 'Track a running sum that resets when it goes negative, plus a global max.'] },
  { problemId: 'algo-two-sum', hints: ["Brute force is two loops. What if you remembered numbers you've already seen?", 'Store value -> index in a map; for each n, look up target - n.'] },
  { problemId: 'algo-valid-parens', hints: ['A closer must match the most recent unmatched opener — what gives you "most recent"?', 'Push openers on a stack; on a closer, pop and compare. Empty stack on a closer is invalid.'] },
  { problemId: 'algo-kth-largest', hints: ["You don't need full order, just the kth largest.", 'Sort descending and take index k-1, or keep a size-k min-heap.'] },
  { problemId: 'algo-binary-search', hints: ['The array is sorted — halve the search space each step.', 'Compare the middle; move the bound that cannot contain the target.'] },
  { problemId: 'algo-merge-intervals', hints: ['Overlaps are obvious once intervals are ordered.', 'Sort by start; if the next start <= current end, extend the end, else start a new interval.'] },
  { problemId: 'algo-longest-unique', hints: ['Think of a window of unique characters that grows and shrinks.', "Track each char's last index; on a repeat inside the window, move start past it."] },
  { problemId: 'algo-product-except-self', hints: ["You can't divide. Think about everything left of i and everything right of i.", 'One prefix-product pass, one suffix-product pass, multiply them.'] },
  { problemId: 'algo-coin-change', hints: ['Fewest coins for amount a builds on fewest coins for a - coin.', 'dp[a] = min over coins of dp[a - coin] + 1; dp[0] = 0.'] },
  { problemId: 'algo-quicksort', hints: ['Pick a pivot and split the rest into smaller and larger.', 'Recurse on each side: sort(less) + [pivot] + sort(greaterEqual).'] },
  { problemId: 'algo-rotate-matrix', hints: ['Where does (i, j) land after a 90 degree clockwise turn?', 'It goes to (j, n-1-i); write into a fresh matrix there.'] },
  { problemId: 'algo-move-zeroes', hints: ['Keep the order of non-zeros; zeros pile up at the end.', 'Collect the non-zeros, then pad zeros to the original length.'] },

  // Graph
  { problemId: 'graph-topo-sort', hints: ['A node can go first only when nothing it depends on remains — think in-degree.', "Kahn's: start with in-degree 0; removing a node lowers its neighbors' in-degree."] },
  { problemId: 'graph-has-cycle', hints: ["A cycle means you reach a node still being explored on the current path.", 'Use three states; reaching an in-progress node means a cycle.'] },
  { problemId: 'graph-components', hints: ['Each fresh exploration start is one new group.', 'Flood-fill from each unvisited node; count the starts.'] },
  { problemId: 'graph-shortest-unweighted', hints: ['Which traversal visits nodes in distance order?', 'BFS: the level at which you first reach the target is the shortest distance.'] },
  { problemId: 'graph-dijkstra', hints: ['Always finalize the closest unvisited node next.', 'Pick the min-distance unvisited node, then relax its edges.'] },
  { problemId: 'graph-num-islands', hints: ['Each unvisited land cell starts an island; then erase that island.', 'On a 1, count it and flood-fill all connected 1s to 0.'] },
  { problemId: 'graph-bipartite', hints: ['Try to 2-color the graph; when is it impossible?', 'BFS, coloring neighbors the opposite color; a same-color edge means no.'] },

  // Data structures
  { problemId: 'dsb-min-heap', hints: ['The min stays at index 0; the work is restoring that after changes.', 'Sift up after push (swap with parent while smaller); sift down after pop.'] },
  { problemId: 'dsb-bst', hints: ['Smaller goes left, larger goes right — for both insert and search.', 'Walk left or right by comparing to node.val until you find the spot.'] },
  { problemId: 'dsb-reverse-list', hints: ['Flip each next pointer without losing the rest of the list.', 'Save next, point head.next at prev, then advance prev and head.'] },
  { problemId: 'dsb-level-order', hints: ['Finish one whole level before the next.', 'Map the current level to values, then build the next level from all children.'] },
  { problemId: 'dsb-hashmap', hints: ['Map a key to a bucket; handle two keys in the same bucket.', 'Hash to an index; store [key, val] pairs per bucket; update if the key exists.'] },

  // Bit / math
  { problemId: 'bit-single-number', hints: ['What is x ^ x?', 'XOR everything: pairs cancel to 0, leaving the unique value.'] },
  { problemId: 'bit-missing-number', hints: ['XOR the indices together with the values.', 'XOR 0..n with all values; matches cancel, leaving the missing one.'] },
  { problemId: 'bit-power-of-two', hints: ['Powers of two have exactly one set bit.', 'n & (n-1) clears the lowest set bit; if that is 0 (and n>0), it was a power of two.'] },
  { problemId: 'math-sieve', hints: ['Mark non-primes by walking multiples of each prime.', 'For each prime i, mark i*i, i*i+i, ... as composite.'] },
  { problemId: 'math-fast-power', hints: ['Halve the exponent each step instead of multiplying exp times.', 'If the low exponent bit is set, multiply into the result; square the base; shift right.'] },
  { problemId: 'math-int-sqrt', hints: ['Binary-search the answer between 1 and n.', 'Find the largest mid where mid*mid <= n.'] },

  // SQL / API
  { problemId: 'sqldrill-rank', hints: ['Sort first; ties share a rank and the next distinct value jumps.', 'Track 1-based position; only change the rank when the value changes.'] },
  { problemId: 'sqldrill-dedupe-latest', hints: ['For each key you want the row with the biggest timestamp.', 'Keep a map key -> row, replacing when a newer timestamp appears.'] },
  { problemId: 'apidrill-crud-handler', hints: ['Each method maps to one action and one success status.', 'GET(no id)->200, GET id->200/404, POST->201, DELETE->204/404, else 405.'] },
  { problemId: 'apidrill-merge-patch', hints: ['Three cases per key: null, nested object, or plain value.', 'null deletes; two objects merge recursively; otherwise replace.'] },

  // Python / TypeScript
  { problemId: 'py-two-sum', hints: ['Remember numbers seen so you can look up the complement.', 'If target - n is in the seen map, return the two indices.'] },
  { problemId: 'py-fib-memo', hints: ['Plain recursion recomputes the same fibs repeatedly.', 'Add @lru_cache(maxsize=None) so each n is computed once.'] },
  { problemId: 'py-anagram-groups', hints: ['Anagrams become identical after sorting their letters.', "Group words by ''.join(sorted(word))."] },
  { problemId: 'ts-exhaustive', hints: ['How can the compiler force you to handle every union case?', 'Assign the leftover in the default to a never; a new case becomes a type error.'] },
]
