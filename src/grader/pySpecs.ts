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

  // ----- Even more fundamentals: conditionals, methods, iteration --------
  {
    problemId: 'py-is-even',
    title: 'Is It Even?',
    language: 'py',
    starter: 'def is_even(n):\n    # return True if n is even\n    pass\n',
    tests: [
      { name: 'even and odd', body: 'assert is_even(4) == True\nassert is_even(7) == False' },
    ],
    reference: `def is_even(n):
    return n % 2 == 0
`,
  },
  {
    problemId: 'py-max-of-three',
    title: 'Max Of Three',
    language: 'py',
    starter: 'def max_of_three(a, b, c):\n    pass\n',
    tests: [{ name: 'largest', body: 'assert max_of_three(1, 9, 4) == 9' }],
    reference: `def max_of_three(a, b, c):
    return max(a, b, c)
`,
  },
  {
    problemId: 'py-shout',
    title: 'String Method: Upper',
    language: 'py',
    starter: 'def shout(s):\n    # uppercase it\n    pass\n',
    tests: [{ name: 'uppercases', body: "assert shout('hi') == 'HI'" }],
    reference: `def shout(s):
    return s.upper()
`,
  },
  {
    problemId: 'py-has-substring',
    title: 'Membership: in',
    language: 'py',
    starter: 'def has_substring(s, sub):\n    pass\n',
    tests: [
      { name: 'contains', body: "assert has_substring('hello', 'ell') == True\nassert has_substring('hello', 'z') == False" },
    ],
    reference: `def has_substring(s, sub):
    return sub in s
`,
  },
  {
    problemId: 'py-is-url',
    title: 'String Method: startswith',
    language: 'py',
    starter: 'def is_url(s):\n    pass\n',
    tests: [
      { name: 'http prefix', body: "assert is_url('https://x') == True\nassert is_url('ftp://x') == False" },
    ],
    reference: `def is_url(s):
    return s.startswith('http')
`,
  },
  {
    problemId: 'py-redact',
    title: 'String Method: replace',
    language: 'py',
    starter: "def redact(s, word):\n    # replace word with '***'\n    pass\n",
    tests: [{ name: 'redacts', body: "assert redact('pw is hunter2', 'hunter2') == 'pw is ***'" }],
    reference: `def redact(s, word):
    return s.replace(word, '***')
`,
  },
  {
    problemId: 'py-csv-join',
    title: 'String Method: join',
    language: 'py',
    starter: "def csv_join(items):\n    # comma-join\n    pass\n",
    tests: [{ name: 'joins', body: "assert csv_join(['a', 'b', 'c']) == 'a,b,c'" }],
    reference: `def csv_join(items):
    return ','.join(items)
`,
  },
  {
    problemId: 'py-count-char',
    title: 'String Method: count',
    language: 'py',
    starter: 'def count_char(s, c):\n    pass\n',
    tests: [{ name: 'counts', body: "assert count_char('banana', 'a') == 3" }],
    reference: `def count_char(s, c):
    return s.count(c)
`,
  },
  {
    problemId: 'py-reverse-string',
    title: 'Slicing: Reverse',
    language: 'py',
    starter: 'def reverse_string(s):\n    # use slicing\n    pass\n',
    tests: [{ name: 'reverses', body: "assert reverse_string('abc') == 'cba'" }],
    reference: `def reverse_string(s):
    return s[::-1]
`,
  },
  {
    problemId: 'py-build-range',
    title: 'For Loop: Build A List',
    language: 'py',
    starter: 'def build_range(n):\n    # [0, 1, ..., n-1] using append in a loop\n    pass\n',
    tests: [{ name: 'builds', body: 'assert build_range(3) == [0, 1, 2]' }],
    reference: `def build_range(n):
    out = []
    for i in range(n):
        out.append(i)
    return out
`,
  },
  {
    problemId: 'py-evens-up-to',
    title: 'range With A Step',
    language: 'py',
    starter: 'def evens_up_to(n):\n    # [0, 2, 4, ...] below n\n    pass\n',
    tests: [{ name: 'steps by two', body: 'assert evens_up_to(6) == [0, 2, 4]' }],
    reference: `def evens_up_to(n):
    return list(range(0, n, 2))
`,
  },
  {
    problemId: 'py-first-n',
    title: 'List Slicing',
    language: 'py',
    starter: 'def first_n(items, n):\n    pass\n',
    tests: [{ name: 'takes a prefix', body: 'assert first_n([1, 2, 3, 4], 2) == [1, 2]' }],
    reference: `def first_n(items, n):
    return items[:n]
`,
  },
  {
    problemId: 'py-position',
    title: 'List Method: index (safely)',
    language: 'py',
    starter: 'def position(items, target):\n    # index of target, or -1 if absent\n    pass\n',
    tests: [
      { name: 'found and missing', body: "assert position(['a', 'b', 'c'], 'b') == 1\nassert position([], 'x') == -1" },
    ],
    reference: `def position(items, target):
    return items.index(target) if target in items else -1
`,
  },
  {
    problemId: 'py-sort-desc',
    title: 'sorted Descending',
    language: 'py',
    starter: 'def sort_desc(nums):\n    pass\n',
    tests: [{ name: 'descending', body: 'assert sort_desc([3, 1, 2]) == [3, 2, 1]' }],
    reference: `def sort_desc(nums):
    return sorted(nums, reverse=True)
`,
  },
  {
    problemId: 'py-sort-by-len',
    title: 'sorted With A Key',
    language: 'py',
    starter: 'def sort_by_len(words):\n    pass\n',
    tests: [{ name: 'by length', body: "assert sort_by_len(['ccc', 'a', 'bb']) == ['a', 'bb', 'ccc']" }],
    reference: `def sort_by_len(words):
    return sorted(words, key=len)
`,
  },
  {
    problemId: 'py-with-index',
    title: 'enumerate',
    language: 'py',
    starter: 'def with_index(items):\n    # [(0, a), (1, b), ...]\n    pass\n',
    tests: [{ name: 'pairs index', body: "assert with_index(['a', 'b']) == [(0, 'a'), (1, 'b')]" }],
    reference: `def with_index(items):
    return list(enumerate(items))
`,
  },
  {
    problemId: 'py-pair-up',
    title: 'zip',
    language: 'py',
    starter: 'def pair_up(a, b):\n    pass\n',
    tests: [{ name: 'zips', body: "assert pair_up([1, 2], ['a', 'b']) == [(1, 'a'), (2, 'b')]" }],
    reference: `def pair_up(a, b):
    return list(zip(a, b))
`,
  },
  {
    problemId: 'py-keys-sorted',
    title: 'Dict Method: keys',
    language: 'py',
    starter: 'def keys_sorted(d):\n    pass\n',
    tests: [{ name: 'sorted keys', body: "assert keys_sorted({'b': 1, 'a': 2}) == ['a', 'b']" }],
    reference: `def keys_sorted(d):
    return sorted(d.keys())
`,
  },
  {
    problemId: 'py-merge-dicts',
    title: 'Dict Merge (spread)',
    language: 'py',
    starter: 'def merge_dicts(a, b):\n    # b wins on conflicts\n    pass\n',
    tests: [
      { name: 'merges, b wins', body: "assert merge_dicts({'a': 1}, {'b': 2}) == {'a': 1, 'b': 2}\nassert merge_dicts({'a': 1}, {'a': 9}) == {'a': 9}" },
    ],
    reference: `def merge_dicts(a, b):
    return {**a, **b}
`,
  },
  {
    problemId: 'py-all-positive',
    title: 'all() With A Generator',
    language: 'py',
    starter: 'def all_positive(nums):\n    pass\n',
    tests: [
      { name: 'every element', body: 'assert all_positive([1, 2, 3]) == True\nassert all_positive([1, -1]) == False' },
    ],
    reference: `def all_positive(nums):
    return all(x > 0 for x in nums)
`,
  },

  // ----- Intermediate: classes, JSON, collections, lambdas ---------------
  {
    problemId: 'py-class-counter',
    title: 'Class: A Counter',
    language: 'py',
    starter: 'class Counter:\n    # increment() returns the new count; .count holds it\n    pass\n',
    tests: [
      { name: 'counts up', body: 'c = Counter()\nassert c.increment() == 1\nassert c.increment() == 2\nassert c.count == 2' },
    ],
    reference: `class Counter:
    def __init__(self):
        self.count = 0
    def increment(self):
        self.count += 1
        return self.count
`,
  },
  {
    problemId: 'py-json-roundtrip',
    title: 'JSON: Round-Trip',
    language: 'py',
    starter: 'import json\n\ndef roundtrip(obj):\n    # serialize to JSON text and parse it back\n    pass\n',
    tests: [
      { name: 'survives a round trip', body: "assert roundtrip({'a': [1, 2]}) == {'a': [1, 2]}" },
    ],
    reference: `import json

def roundtrip(obj):
    return json.loads(json.dumps(obj))
`,
  },
  {
    problemId: 'py-sort-dicts',
    title: 'Sort A List Of Dicts',
    language: 'py',
    starter: 'def sort_by(items, key):\n    # sort dicts ascending by the given key\n    pass\n',
    tests: [
      { name: 'orders by key', body: "assert sort_by([{'n':3},{'n':1},{'n':2}], 'n') == [{'n':1},{'n':2},{'n':3}]" },
    ],
    reference: `def sort_by(items, key):
    return sorted(items, key=lambda x: x[key])
`,
  },
  {
    problemId: 'py-dedupe-order',
    title: 'Dedupe Preserving Order',
    language: 'py',
    starter: 'def dedupe(items):\n    # remove duplicates but keep first-seen order\n    pass\n',
    tests: [
      { name: 'keeps order', body: 'assert dedupe([1, 2, 1, 3, 2]) == [1, 2, 3]' },
    ],
    reference: `def dedupe(items):
    seen = set()
    out = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out
`,
  },
  {
    problemId: 'py-zip-dict',
    title: 'Build A Dict From Two Lists',
    language: 'py',
    starter: 'def to_dict(keys, values):\n    # pair them into a dict\n    pass\n',
    tests: [
      { name: 'zips into a dict', body: "assert to_dict(['a', 'b'], [1, 2]) == {'a': 1, 'b': 2}" },
    ],
    reference: `def to_dict(keys, values):
    return dict(zip(keys, values))
`,
  },
  {
    problemId: 'py-flatten',
    title: 'Flatten A Nested List',
    language: 'py',
    starter: 'def flatten(nested):\n    # [[1,2],[3]] -> [1,2,3]\n    pass\n',
    tests: [
      { name: 'flattens one level', body: 'assert flatten([[1, 2], [3], [4, 5]]) == [1, 2, 3, 4, 5]' },
    ],
    reference: `def flatten(nested):
    out = []
    for sub in nested:
        for x in sub:
            out.append(x)
    return out
`,
  },
  {
    problemId: 'py-string-format',
    title: 'f-strings',
    language: 'py',
    starter: 'def greet(name, count):\n    # return "<name> has <count> items"\n    pass\n',
    tests: [
      { name: 'formats text', body: "assert greet('Ada', 3) == 'Ada has 3 items'" },
    ],
    reference: `def greet(name, count):
    return f"{name} has {count} items"
`,
  },
  {
    problemId: 'py-defaultdict-group',
    title: 'collections.defaultdict',
    language: 'py',
    starter: 'from collections import defaultdict\n\ndef group_items(items, key_fn):\n    # group into a normal dict of lists\n    pass\n',
    tests: [
      { name: 'groups', body: "assert group_items([1, 2, 3, 4], lambda x: 'e' if x % 2 == 0 else 'o') == {'o': [1, 3], 'e': [2, 4]}" },
    ],
    reference: `from collections import defaultdict

def group_items(items, key_fn):
    out = defaultdict(list)
    for x in items:
        out[key_fn(x)].append(x)
    return dict(out)
`,
  },
  {
    problemId: 'py-filter-lambda',
    title: 'filter() With A Lambda',
    language: 'py',
    starter: 'def positives(nums):\n    # keep the positive numbers using filter\n    pass\n',
    tests: [
      { name: 'filters', body: 'assert positives([-1, 2, -3, 4]) == [2, 4]' },
    ],
    reference: `def positives(nums):
    return list(filter(lambda x: x > 0, nums))
`,
  },
  {
    problemId: 'py-max-by-key',
    title: 'max() With A Key',
    language: 'py',
    starter: 'def max_by(items, key_fn):\n    # the item with the largest key_fn value\n    pass\n',
    tests: [
      { name: 'longest string', body: "assert max_by(['a', 'ccc', 'bb'], len) == 'ccc'" },
    ],
    reference: `def max_by(items, key_fn):
    return max(items, key=key_fn)
`,
  },

  // ----- Advanced: recursion, lru_cache, Counter, real problems ----------
  {
    problemId: 'py-flatten-deep',
    title: 'Recursion: Flatten Deeply',
    language: 'py',
    starter: 'def flatten_deep(items):\n    # flatten arbitrarily nested lists\n    pass\n',
    tests: [
      { name: 'any depth', body: 'assert flatten_deep([1, [2, [3, 4]], 5]) == [1, 2, 3, 4, 5]' },
    ],
    reference: `def flatten_deep(items):
    out = []
    for x in items:
        if isinstance(x, list):
            out.extend(flatten_deep(x))
        else:
            out.append(x)
    return out
`,
  },
  {
    problemId: 'py-fib-memo',
    title: 'functools.lru_cache',
    language: 'py',
    starter: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    # memoized fibonacci\n    pass\n',
    tests: [
      { name: 'fast fib', body: 'assert fib(0) == 0\nassert fib(10) == 55' },
    ],
    reference: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
`,
  },
  {
    problemId: 'py-anagram-groups',
    title: 'Group Anagrams',
    language: 'py',
    starter: 'from collections import defaultdict\n\ndef anagram_groups(words):\n    # group anagrams; return sorted groups, each sorted\n    pass\n',
    tests: [
      { name: 'groups anagrams', body: "assert anagram_groups(['eat','tea','tan','ate','nat','bat']) == [['ate','eat','tea'],['bat'],['nat','tan']]" },
    ],
    reference: `from collections import defaultdict

def anagram_groups(words):
    groups = defaultdict(list)
    for w in words:
        groups[''.join(sorted(w))].append(w)
    return sorted([sorted(g) for g in groups.values()])
`,
  },
  {
    problemId: 'py-chunk',
    title: 'Chunk A List',
    language: 'py',
    starter: 'def chunk(items, size):\n    # split into sub-lists of length size\n    pass\n',
    tests: [
      { name: 'splits', body: 'assert chunk([1,2,3,4,5], 2) == [[1,2],[3,4],[5]]' },
    ],
    reference: `def chunk(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]
`,
  },
  {
    problemId: 'py-running-total',
    title: 'Running Total',
    language: 'py',
    starter: 'def running_total(nums):\n    # cumulative sums\n    pass\n',
    tests: [
      { name: 'accumulates', body: 'assert running_total([1,2,3,4]) == [1,3,6,10]' },
    ],
    reference: `def running_total(nums):
    out = []
    total = 0
    for n in nums:
        total += n
        out.append(total)
    return out
`,
  },
  {
    problemId: 'py-rotate',
    title: 'Rotate A List',
    language: 'py',
    starter: 'def rotate(items, k):\n    # rotate right by k (wraps)\n    pass\n',
    tests: [
      { name: 'wraps around', body: 'assert rotate([1,2,3,4,5], 2) == [4,5,1,2,3]\nassert rotate([1,2,3], 0) == [1,2,3]' },
    ],
    reference: `def rotate(items, k):
    if not items:
        return []
    k = k % len(items)
    return items[-k:] + items[:-k] if k else items[:]
`,
  },
  {
    problemId: 'py-count-words',
    title: 'collections.Counter',
    language: 'py',
    starter: 'from collections import Counter\n\ndef count_words(text):\n    # word -> count as a dict\n    pass\n',
    tests: [
      { name: 'counts words', body: "assert count_words('a b a c b a') == {'a':3, 'b':2, 'c':1}" },
    ],
    reference: `from collections import Counter

def count_words(text):
    return dict(Counter(text.split()))
`,
  },
  {
    problemId: 'py-merge-sum',
    title: 'Merge Dicts Summing Values',
    language: 'py',
    starter: 'def merge_sum(a, b):\n    # add values for shared keys\n    pass\n',
    tests: [
      { name: 'adds overlaps', body: "assert merge_sum({'x':1,'y':2}, {'y':3,'z':4}) == {'x':1,'y':5,'z':4}" },
    ],
    reference: `def merge_sum(a, b):
    out = dict(a)
    for k, v in b.items():
        out[k] = out.get(k, 0) + v
    return out
`,
  },
  {
    problemId: 'py-is-palindrome',
    title: 'Palindrome Check',
    language: 'py',
    starter: 'def is_palindrome(s):\n    pass\n',
    tests: [
      { name: 'checks', body: "assert is_palindrome('racecar') == True\nassert is_palindrome('hello') == False" },
    ],
    reference: `def is_palindrome(s):
    return s == s[::-1]
`,
  },
  {
    problemId: 'py-two-sum',
    title: 'Two Sum',
    language: 'py',
    starter: 'def two_sum(nums, target):\n    # return indices [i, j] that sum to target, else None\n    pass\n',
    tests: [
      { name: 'finds the pair', body: 'assert two_sum([2,7,11,15], 9) == [0, 1]\nassert two_sum([1,2], 100) is None' },
    ],
    reference: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return None
`,
  },

  // ----- Python idioms: generators, context managers, *args/**kwargs -----
  {
    problemId: 'py-generator-fn',
    title: 'Generator Function (yield)',
    language: 'py',
    starter: 'def squares(n):\n    # yield 0, 1, 4, ... for i in range(n)\n    pass\n',
    tests: [
      { name: 'lazy squares', body: 'assert list(squares(4)) == [0, 1, 4, 9]' },
    ],
    reference: `def squares(n):
    for i in range(n):
        yield i * i
`,
  },
  {
    problemId: 'py-context-manager',
    title: 'Context Manager (with)',
    language: 'py',
    starter: 'class Tag:\n    # record "open" on enter and "close" on exit, in self.events\n    pass\n',
    tests: [
      { name: 'enter/exit order', body: "t = Tag()\nwith t:\n    t.events.append('use')\nassert t.events == ['open', 'use', 'close']" },
    ],
    reference: `class Tag:
    def __init__(self):
        self.events = []
    def __enter__(self):
        self.events.append('open')
        return self
    def __exit__(self, *a):
        self.events.append('close')
        return False
`,
  },
  {
    problemId: 'py-star-args',
    title: '*args',
    language: 'py',
    starter: 'def total(*args):\n    # sum any number of positional args\n    pass\n',
    tests: [
      { name: 'variadic sum', body: 'assert total(1, 2, 3) == 6\nassert total() == 0' },
    ],
    reference: `def total(*args):
    return sum(args)
`,
  },
  {
    problemId: 'py-kwargs',
    title: '**kwargs',
    language: 'py',
    starter: 'def to_dict(**kwargs):\n    # collect keyword args into a dict\n    pass\n',
    tests: [
      { name: 'collects kwargs', body: "assert to_dict(a=1, b=2) == {'a': 1, 'b': 2}" },
    ],
    reference: `def to_dict(**kwargs):
    return dict(kwargs)
`,
  },
  {
    problemId: 'py-sorted-tuple-key',
    title: 'Sort By Multiple Keys',
    language: 'py',
    starter: 'def sort_words(words):\n    # by length, then alphabetically\n    pass\n',
    tests: [
      { name: 'tuple key', body: "assert sort_words(['bb', 'a', 'cc', 'b']) == ['a', 'b', 'bb', 'cc']" },
    ],
    reference: `def sort_words(words):
    return sorted(words, key=lambda w: (len(w), w))
`,
  },
  {
    problemId: 'py-set-comprehension',
    title: 'Set Comprehension',
    language: 'py',
    starter: 'def unique_lengths(words):\n    # the distinct word lengths\n    pass\n',
    tests: [
      { name: 'distinct lengths', body: "assert unique_lengths(['a', 'bb', 'cc', 'd']) == {1, 2}" },
    ],
    reference: `def unique_lengths(words):
    return {len(w) for w in words}
`,
  },
  {
    problemId: 'py-dict-comprehension-filter',
    title: 'Dict Comprehension With Filter',
    language: 'py',
    starter: 'def positives(d):\n    # keep only entries with a positive value\n    pass\n',
    tests: [
      { name: 'filters values', body: "assert positives({'a': 1, 'b': -2, 'c': 3}) == {'a': 1, 'c': 3}" },
    ],
    reference: `def positives(d):
    return {k: v for k, v in d.items() if v > 0}
`,
  },
  {
    problemId: 'py-unzip',
    title: 'Unzip With zip(*)',
    language: 'py',
    starter: 'def unzip(pairs):\n    # [(1,"a"),(2,"b")] -> [[1,2],["a","b"]]\n    pass\n',
    tests: [
      { name: 'splat transpose', body: "assert unzip([(1, 'a'), (2, 'b')]) == [[1, 2], ['a', 'b']]" },
    ],
    reference: `def unzip(pairs):
    return [list(t) for t in zip(*pairs)] if pairs else [[], []]
`,
  },

  // ----- Python standard library (heapq, bisect, deque, itertools) -------
  {
    problemId: 'py-heapq-smallest',
    title: 'heapq.nsmallest',
    language: 'py',
    starter: 'import heapq\n\ndef k_smallest(nums, k):\n    # the k smallest values, ascending\n    pass\n',
    tests: [
      { name: 'k smallest', body: 'assert k_smallest([5, 1, 3, 2, 4], 2) == [1, 2]' },
    ],
    reference: `import heapq

def k_smallest(nums, k):
    return heapq.nsmallest(k, nums)
`,
  },
  {
    problemId: 'py-bisect-insort',
    title: 'bisect.insort',
    language: 'py',
    starter: 'import bisect\n\ndef insert_sorted(arr, x):\n    # insert x keeping arr sorted; return arr\n    pass\n',
    tests: [
      { name: 'stays sorted', body: 'assert insert_sorted([1, 3, 5], 4) == [1, 3, 4, 5]' },
    ],
    reference: `import bisect

def insert_sorted(arr, x):
    bisect.insort(arr, x)
    return arr
`,
  },
  {
    problemId: 'py-deque-rotate',
    title: 'collections.deque rotate',
    language: 'py',
    starter: 'from collections import deque\n\ndef rotate(items, k):\n    # rotate right by k using a deque\n    pass\n',
    tests: [
      { name: 'rotates right', body: 'assert rotate([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3]' },
    ],
    reference: `from collections import deque

def rotate(items, k):
    d = deque(items)
    d.rotate(k)
    return list(d)
`,
  },
  {
    problemId: 'py-counter-most-common',
    title: 'Counter.most_common',
    language: 'py',
    starter: 'from collections import Counter\n\ndef top_words(text, k):\n    # the k most frequent words, most-first\n    pass\n',
    tests: [
      { name: 'top k', body: "assert top_words('a b a c a b', 2) == ['a', 'b']" },
    ],
    reference: `from collections import Counter

def top_words(text, k):
    return [w for w, _ in Counter(text.split()).most_common(k)]
`,
  },
  {
    problemId: 'py-defaultdict-int',
    title: 'defaultdict(int) Counter',
    language: 'py',
    starter: 'from collections import defaultdict\n\ndef char_freq(s):\n    # character -> count, as a plain dict\n    pass\n',
    tests: [
      { name: 'counts chars', body: "assert char_freq('aabbc') == {'a': 2, 'b': 2, 'c': 1}" },
    ],
    reference: `from collections import defaultdict

def char_freq(s):
    freq = defaultdict(int)
    for ch in s:
        freq[ch] += 1
    return dict(freq)
`,
  },
  {
    problemId: 'py-namedtuple',
    title: 'collections.namedtuple',
    language: 'py',
    starter: "from collections import namedtuple\n\ndef make_point(x, y):\n    # build a Point namedtuple, return (p.x, p.y)\n    pass\n",
    tests: [
      { name: 'named fields', body: 'assert make_point(3, 4) == (3, 4)' },
    ],
    reference: `from collections import namedtuple

def make_point(x, y):
    Point = namedtuple('Point', ['x', 'y'])
    p = Point(x, y)
    return (p.x, p.y)
`,
  },
  {
    problemId: 'py-accumulate',
    title: 'itertools.accumulate',
    language: 'py',
    starter: 'import itertools\n\ndef running_sums(nums):\n    # cumulative sums\n    pass\n',
    tests: [
      { name: 'running total', body: 'assert running_sums([1, 2, 3, 4]) == [1, 3, 6, 10]' },
    ],
    reference: `import itertools

def running_sums(nums):
    return list(itertools.accumulate(nums))
`,
  },
  {
    problemId: 'py-bisect-search',
    title: 'Binary Search With bisect',
    language: 'py',
    starter: 'import bisect\n\ndef position(arr, x):\n    # index of x in sorted arr, or -1\n    pass\n',
    tests: [
      { name: 'finds or -1', body: 'assert position([1, 3, 5, 7], 5) == 2\nassert position([1, 3, 5], 4) == -1' },
    ],
    reference: `import bisect

def position(arr, x):
    i = bisect.bisect_left(arr, x)
    return i if i < len(arr) and arr[i] == x else -1
`,
  },

  // ----- Python web/backend logic (Django/DRF/Flask-flavored) ------------
  {
    problemId: 'pyweb-queryset-filter',
    title: 'QuerySet-Style Filter',
    language: 'py',
    starter: 'def filter_objects(objects, **filters):\n    # keep objects matching all key=value filters (like .filter(**kw))\n    pass\n',
    tests: [
      { name: 'matches all filters', body: "assert filter_objects([{'name':'a','active':True},{'name':'b','active':False}], active=True) == [{'name':'a','active':True}]" },
    ],
    reference: `def filter_objects(objects, **filters):
    return [o for o in objects if all(o.get(k) == v for k, v in filters.items())]
`,
  },
  {
    problemId: 'pyweb-serialize',
    title: 'Serializer: Pick Fields',
    language: 'py',
    starter: 'def serialize(obj, fields):\n    # return only the allowlisted fields present on obj\n    pass\n',
    tests: [
      { name: 'drops extras', body: "assert serialize({'id':1,'name':'a','password':'x'}, ['id','name']) == {'id':1,'name':'a'}" },
    ],
    reference: `def serialize(obj, fields):
    return {k: obj[k] for k in fields if k in obj}
`,
  },
  {
    problemId: 'pyweb-paginate',
    title: 'DRF-Style Pagination',
    language: 'py',
    starter: "def paginate(items, page, size):\n    # return { count, results, has_next }\n    pass\n",
    tests: [
      { name: 'page shape', body: "assert paginate([1,2,3,4,5], 1, 2) == {'count':5,'results':[1,2],'has_next':True}" },
    ],
    reference: `def paginate(items, page, size):
    start = (page - 1) * size
    return {
        'count': len(items),
        'results': items[start:start + size],
        'has_next': start + size < len(items),
    }
`,
  },
  {
    problemId: 'pyweb-route-match',
    title: 'Route Match With <param>',
    language: 'py',
    starter: "def match_route(pattern, path):\n    # '/users/<id>/' vs '/users/42/' -> {'id': '42'}; no match -> None\n    pass\n",
    tests: [
      { name: 'captures params', body: "assert match_route('/users/<id>/', '/users/42/') == {'id': '42'}\nassert match_route('/users/', '/posts/') is None" },
    ],
    reference: `def match_route(pattern, path):
    p_parts = pattern.strip('/').split('/')
    a_parts = path.strip('/').split('/')
    if len(p_parts) != len(a_parts):
        return None
    params = {}
    for pp, ap in zip(p_parts, a_parts):
        if pp.startswith('<') and pp.endswith('>'):
            params[pp[1:-1]] = ap
        elif pp != ap:
            return None
    return params
`,
  },
  {
    problemId: 'pyweb-validate',
    title: 'Validate Required Fields',
    language: 'py',
    starter: "def validate(data, required):\n    # return { field: 'required' } for each missing/empty field\n    pass\n",
    tests: [
      { name: 'reports missing', body: "assert validate({'name':'a'}, ['name','email']) == {'email':'required'}" },
    ],
    reference: `def validate(data, required):
    return {f: 'required' for f in required if not data.get(f)}
`,
  },
  {
    problemId: 'pyweb-permission',
    title: 'Permission: Staff Or Owner',
    language: 'py',
    starter: 'def can_edit(user, obj):\n    # staff can always edit; otherwise only the owner\n    pass\n',
    tests: [
      { name: 'staff or owner', body: "assert can_edit({'id':1,'is_staff':False}, {'owner':1}) == True\nassert can_edit({'id':2,'is_staff':False}, {'owner':1}) == False\nassert can_edit({'id':3,'is_staff':True}, {'owner':1}) == True" },
    ],
    reference: `def can_edit(user, obj):
    return user.get('is_staff', False) or obj.get('owner') == user.get('id')
`,
  },
  {
    problemId: 'pyweb-status-for',
    title: 'Exception To HTTP Status',
    language: 'py',
    starter: "def status_for(error):\n    # ValidationError->400, NotFound->404, PermissionDenied->403, Conflict->409, else 500\n    pass\n",
    tests: [
      { name: 'maps errors', body: "assert status_for('NotFound') == 404\nassert status_for('Boom') == 500" },
    ],
    reference: `def status_for(error):
    return {'ValidationError': 400, 'NotFound': 404, 'PermissionDenied': 403, 'Conflict': 409}.get(error, 500)
`,
  },
  {
    problemId: 'pyweb-query-params',
    title: 'Parse Query Params',
    language: 'py',
    starter: "def parse_params(query):\n    # { page:1, size:20, search:'' } defaults, overridden by query (ints coerced)\n    pass\n",
    tests: [
      { name: 'defaults + coercion', body: "assert parse_params({'page':'2','search':'x'}) == {'page':2,'size':20,'search':'x'}" },
    ],
    reference: `def parse_params(query):
    return {
        'page': int(query.get('page', 1)),
        'size': int(query.get('size', 20)),
        'search': query.get('search', ''),
    }
`,
  },
]
