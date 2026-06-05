import type { GradeSpec } from './types.ts'

// REAL Python coding drills, graded by running Python (Pyodide in the browser; see
// pyGrade.ts). Ordered from fundamentals up: loops, then built-in methods, then
// comprehensions, then small backend-flavored logic. Test bodies use Python
// `assert`. Each reference is verified against its tests with python3.
export const pySpecs: GradeSpec[] = [
  // ----- Loops & basics ---------------------------------------------------
  {
    problemId: 'py-sum-loop',
    title: 'Sum With A For Loop',
    language: 'py',
    starter: 'def sum_list(nums):\n    # add the numbers using a for loop\n    pass\n',
    tests: [
      { name: 'sums a list', body: 'assert sum_list([1, 2, 3]) == 6' },
      { name: 'empty list is zero', body: 'assert sum_list([]) == 0' },
    ],
    reference: `def sum_list(nums):
    total = 0
    for n in nums:
        total += n
    return total
`,
  },
  {
    problemId: 'py-count-while',
    title: 'Count Down With While',
    language: 'py',
    starter: 'def count_down(n):\n    # use a while loop to return [n, n-1, ..., 1]\n    pass\n',
    tests: [
      { name: 'counts down', body: 'assert count_down(3) == [3, 2, 1]' },
      { name: 'zero is empty', body: 'assert count_down(0) == []' },
    ],
    reference: `def count_down(n):
    out = []
    while n > 0:
        out.append(n)
        n -= 1
    return out
`,
  },
  {
    problemId: 'py-fizzbuzz',
    title: 'FizzBuzz',
    language: 'py',
    starter: "def fizzbuzz(n):\n    # 1..n: 'Fizz' for %3, 'Buzz' for %5, 'FizzBuzz' for both, else the number as str\n    pass\n",
    tests: [
      { name: 'first five', body: "assert fizzbuzz(5) == ['1', '2', 'Fizz', '4', 'Buzz']" },
      { name: 'fifteen is FizzBuzz', body: "assert fizzbuzz(15)[-1] == 'FizzBuzz'" },
    ],
    reference: `def fizzbuzz(n):
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append('FizzBuzz')
        elif i % 3 == 0:
            out.append('Fizz')
        elif i % 5 == 0:
            out.append('Buzz')
        else:
            out.append(str(i))
    return out
`,
  },
  {
    problemId: 'py-factorial',
    title: 'Factorial',
    language: 'py',
    starter: 'def factorial(n):\n    # iterative product 1*2*...*n; factorial(0) == 1\n    pass\n',
    tests: [
      { name: 'computes factorial', body: 'assert factorial(5) == 120' },
      { name: 'zero is one', body: 'assert factorial(0) == 1' },
    ],
    reference: `def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
`,
  },
  {
    problemId: 'py-fib',
    title: 'Nth Fibonacci',
    language: 'py',
    starter: 'def fib(n):\n    # 0-indexed: fib(0)=0, fib(1)=1\n    pass\n',
    tests: [
      { name: 'base case', body: 'assert fib(0) == 0' },
      { name: 'seventh', body: 'assert fib(7) == 13' },
    ],
    reference: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
  },

  // ----- Built-in methods -------------------------------------------------
  {
    problemId: 'py-clean-name',
    title: 'String Methods: Clean A Name',
    language: 'py',
    starter: "def clean_name(s):\n    # trim whitespace and title-case it\n    pass\n",
    tests: [
      { name: 'trims and titles', body: "assert clean_name('  john doe  ') == 'John Doe'" },
    ],
    reference: `def clean_name(s):
    return s.strip().title()
`,
  },
  {
    problemId: 'py-reverse-words',
    title: 'Reverse Word Order',
    language: 'py',
    starter: "def reverse_words(s):\n    # 'a b c' -> 'c b a'\n    pass\n",
    tests: [
      { name: 'reverses order', body: "assert reverse_words('hello world foo') == 'foo world hello'" },
    ],
    reference: `def reverse_words(s):
    return ' '.join(s.split()[::-1])
`,
  },
  {
    problemId: 'py-min-max',
    title: 'Min And Max',
    language: 'py',
    starter: 'def min_max(nums):\n    # return a (min, max) tuple\n    pass\n',
    tests: [
      { name: 'returns the pair', body: 'assert min_max([3, 1, 2]) == (1, 3)' },
    ],
    reference: `def min_max(nums):
    return (min(nums), max(nums))
`,
  },
  {
    problemId: 'py-word-count',
    title: 'Dict Methods: Word Count',
    language: 'py',
    starter: 'def word_count(words):\n    # count occurrences into a dict (use dict.get)\n    pass\n',
    tests: [
      { name: 'counts words', body: "assert word_count(['a', 'b', 'a']) == {'a': 2, 'b': 1}" },
    ],
    reference: `def word_count(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts
`,
  },
  {
    problemId: 'py-safe-get',
    title: 'Dict Get With Default',
    language: 'py',
    starter: 'def safe_get(d, key, default):\n    # return d[key] if present, else default (no KeyError)\n    pass\n',
    tests: [
      { name: 'present', body: "assert safe_get({'a': 1}, 'a', 0) == 1" },
      { name: 'missing', body: "assert safe_get({}, 'x', -1) == -1" },
    ],
    reference: `def safe_get(d, key, default):
    return d.get(key, default)
`,
  },

  // ----- Comprehensions & sets -------------------------------------------
  {
    problemId: 'py-squares-even',
    title: 'List Comprehension: Even Squares',
    language: 'py',
    starter: 'def squares_even(nums):\n    # squares of the even numbers, in order\n    pass\n',
    tests: [
      { name: 'filters then maps', body: 'assert squares_even([1, 2, 3, 4]) == [4, 16]' },
    ],
    reference: `def squares_even(nums):
    return [x * x for x in nums if x % 2 == 0]
`,
  },
  {
    problemId: 'py-invert-dict',
    title: 'Dict Comprehension: Invert',
    language: 'py',
    starter: 'def invert_dict(d):\n    # swap keys and values\n    pass\n',
    tests: [
      { name: 'inverts', body: "assert invert_dict({'a': 1, 'b': 2}) == {1: 'a', 2: 'b'}" },
    ],
    reference: `def invert_dict(d):
    return {v: k for k, v in d.items()}
`,
  },
  {
    problemId: 'py-common-elements',
    title: 'Set Intersection',
    language: 'py',
    starter: 'def common_elements(a, b):\n    # sorted list of values in both\n    pass\n',
    tests: [
      { name: 'finds the overlap', body: 'assert common_elements([1, 2, 3], [2, 3, 4]) == [2, 3]' },
    ],
    reference: `def common_elements(a, b):
    return sorted(set(a) & set(b))
`,
  },

  // ----- Errors, decorators, backend-flavored logic ----------------------
  {
    problemId: 'py-safe-divide',
    title: 'Exceptions: Safe Divide',
    language: 'py',
    starter: 'def safe_divide(a, b):\n    # return a / b, or None on division by zero\n    pass\n',
    tests: [
      { name: 'divides', body: 'assert safe_divide(10, 2) == 5' },
      { name: 'guards zero', body: 'assert safe_divide(1, 0) is None' },
    ],
    reference: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
`,
  },
  {
    problemId: 'py-memoize',
    title: 'Decorator: Memoize',
    language: 'py',
    starter: 'def memoize(fn):\n    # cache results by args so fn runs once per distinct input\n    pass\n',
    tests: [
      {
        name: 'caches by args',
        body: `calls = []
@memoize
def sq(x):
    calls.append(x)
    return x * x
assert sq(3) == 9
assert sq(3) == 9
assert len(calls) == 1`,
      },
    ],
    reference: `def memoize(fn):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    return wrapper
`,
  },
  {
    problemId: 'py-match-route',
    title: 'Flask-Style Route Match',
    language: 'py',
    starter: "def match_route(routes, method, path):\n    # routes: list of dicts with 'method','path','handler'. return handler or None\n    pass\n",
    tests: [
      { name: 'matches', body: "assert match_route([{'method': 'GET', 'path': '/h', 'handler': 'h'}], 'GET', '/h') == 'h'" },
      { name: 'misses', body: "assert match_route([], 'GET', '/x') is None" },
    ],
    reference: `def match_route(routes, method, path):
    for r in routes:
        if r['method'] == method and r['path'] == path:
            return r['handler']
    return None
`,
  },
  {
    problemId: 'py-group-by',
    title: 'Group By Key',
    language: 'py',
    starter: 'def group_by(items, key_fn):\n    # bucket items into a dict keyed by key_fn(item)\n    pass\n',
    tests: [
      { name: 'buckets', body: "assert group_by([1, 2, 3, 4], lambda x: 'even' if x % 2 == 0 else 'odd') == {'odd': [1, 3], 'even': [2, 4]}" },
    ],
    reference: `def group_by(items, key_fn):
    out = {}
    for item in items:
        out.setdefault(key_fn(item), []).append(item)
    return out
`,
  },
]
