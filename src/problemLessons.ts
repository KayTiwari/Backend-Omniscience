// Per-PROBLEM teaching, keyed by problemId. Fixes the "Learn First is identical
// on every page" problem: the subject teaching model is generic, this is specific
// to the exact task. Codex's Learn First panel should prefer
// problemLessons[activeProblem.id] and fall back to the subject model when absent.
//
// concept = the one idea this problem teaches (plain English).
// idiom   = the key line(s) of code to know.
// mistake = the common pitfall.
//
// Ownership: Claude. Growing batch — Python Fundamentals first (the worst
// offender in the screenshot), more subjects to follow. See PROGRESSION_PLAN.md.

export type ProblemLesson = {
  problemId: string
  concept: string
  idiom: string
  mistake?: string
}

export const problemLessons: ProblemLesson[] = [
  { problemId: 'py-is-even', concept: `Even vs odd is a remainder check: a number is even when dividing by 2 leaves nothing.`, idiom: `return n % 2 == 0`, mistake: `Returning n % 2 gives 0 or 1, not a boolean.` },
  { problemId: 'py-max-of-three', concept: `max() takes several arguments and returns the largest one.`, idiom: `return max(a, b, c)`, mistake: `Hand-writing nested if/else when max() already does it.` },
  { problemId: 'py-sum-loop', concept: `Build a total by adding each item as you loop (an accumulator).`, idiom: `total = 0\nfor n in nums:\n    total += n`, mistake: `Forgetting to initialize total before the loop.` },
  { problemId: 'py-build-range', concept: `range(n) yields 0..n-1; collect the values into a list.`, idiom: `for i in range(n):\n    out.append(i)`, mistake: `range(n) is not a list until you iterate it or wrap it in list().` },
  { problemId: 'py-count-while', concept: `A while loop repeats until its condition becomes false — good for countdowns.`, idiom: `while n > 0:\n    out.append(n)\n    n -= 1`, mistake: `Forgetting to decrement n creates an infinite loop.` },
  { problemId: 'py-evens-up-to', concept: `range(start, stop, step) counts by step.`, idiom: `list(range(0, n, 2))`, mistake: `stop is exclusive — off-by-one is easy here.` },
  { problemId: 'py-factorial', concept: `Factorial multiplies 1 through n with an accumulator.`, idiom: `result = 1\nfor i in range(2, n + 1):\n    result *= i`, mistake: `factorial(0) must be 1, not 0.` },
  { problemId: 'py-fib', concept: `Each Fibonacci number is the sum of the two before it.`, idiom: `a, b = 0, 1\nfor _ in range(n):\n    a, b = b, a + b`, mistake: `Off-by-one on which index you return.` },
  { problemId: 'py-fizzbuzz', concept: `Test divisibility, checking the combined case first.`, idiom: `if i % 15 == 0: 'FizzBuzz'\nelif i % 3 == 0: 'Fizz'`, mistake: `Checking 3 and 5 before 15 misses FizzBuzz.` },
  { problemId: 'py-shout', concept: `str.upper() returns an uppercased copy of the string.`, idiom: `return s.upper()`, mistake: `Strings are immutable; upper() returns a new one.` },
  { problemId: 'py-clean-name', concept: `Chain string methods: strip() trims whitespace, title()/lower() normalize case.`, idiom: `return name.strip().title()`, mistake: `Skipping strip() leaves stray leading/trailing spaces.` },
  { problemId: 'py-has-substring', concept: `The in operator tests substring/membership.`, idiom: `return needle in haystack`, mistake: `Using find() != -1 where in reads cleaner.` },
  { problemId: 'py-is-url', concept: `str.startswith() checks a prefix.`, idiom: `return s.startswith('http')`, mistake: `Slicing s[:4] by hand is brittle.` },
  { problemId: 'py-redact', concept: `str.replace(old, new) swaps every occurrence.`, idiom: `return s.replace(secret, '***')`, mistake: `replace returns a new string; it does not mutate in place.` },
  { problemId: 'py-csv-join', concept: `str.join() glues a list together with a separator.`, idiom: `return ','.join(parts)`, mistake: `join is called on the separator, not on the list.` },
  { problemId: 'py-count-char', concept: `str.count(sub) counts non-overlapping occurrences.`, idiom: `return s.count(ch)`, mistake: `Looping by hand when count() exists.` },
  { problemId: 'py-reverse-string', concept: `Slicing with step -1 reverses a sequence.`, idiom: `return s[::-1]`, mistake: `reversed() returns an iterator, not a string.` },
  { problemId: 'py-reverse-words', concept: `split() into words, reverse the list, join back.`, idiom: `return ' '.join(s.split()[::-1])`, mistake: `Reversing characters instead of word order.` },
  { problemId: 'py-first-n', concept: `Slicing items[:n] takes the first n items.`, idiom: `return items[:n]`, mistake: `Slicing never errors past the end, so no bounds check needed.` },
  { problemId: 'py-position', concept: `list.index raises if missing, so guard with in.`, idiom: `return items.index(x) if x in items else -1`, mistake: `Calling index() on a missing value raises ValueError.` },
  { problemId: 'py-sort-desc', concept: `sorted(reverse=True) returns a new list, high to low.`, idiom: `return sorted(nums, reverse=True)`, mistake: `list.sort() mutates in place and returns None.` },
  { problemId: 'py-sort-by-len', concept: `sorted(key=...) sorts by a computed key.`, idiom: `return sorted(words, key=len)`, mistake: `Passing len() (called) instead of len (the function).` },
  { problemId: 'py-min-max', concept: `min() and max() find the extremes of a sequence.`, idiom: `return [min(nums), max(nums)]`, mistake: `Both raise on an empty list.` },
  { problemId: 'py-with-index', concept: `enumerate yields (index, item) pairs.`, idiom: `for i, x in enumerate(items):`, mistake: `Keeping a manual counter instead of enumerate.` },
  { problemId: 'py-pair-up', concept: `zip pairs up items from multiple iterables.`, idiom: `list(zip(a, b))`, mistake: `zip stops at the shortest input.` },
  { problemId: 'py-word-count', concept: `Tally into a dict, defaulting missing keys to 0.`, idiom: `counts[w] = counts.get(w, 0) + 1`, mistake: `Indexing a missing key directly raises KeyError.` },
  { problemId: 'py-safe-get', concept: `dict.get(key, default) avoids KeyError.`, idiom: `return d.get(key, default)`, mistake: `d[key] raises if absent; get() returns the default.` },
  { problemId: 'py-keys-sorted', concept: `dict.keys() is a view; sort it for ordered keys.`, idiom: `return sorted(d.keys())`, mistake: `Dict order is insertion order, not sorted.` },
  { problemId: 'py-merge-dicts', concept: `{**a, **b} merges two dicts, with b winning conflicts.`, idiom: `return {**a, **b}`, mistake: `Later keys silently overwrite earlier ones.` },
  { problemId: 'py-invert-dict', concept: `A dict comprehension can swap keys and values.`, idiom: `return {v: k for k, v in d.items()}`, mistake: `Duplicate values collapse to a single key.` },
  { problemId: 'py-squares-even', concept: `A list comprehension can filter and map in one line.`, idiom: `[x * x for x in nums if x % 2 == 0]`, mistake: `Putting the if before the for (wrong order).` },
  { problemId: 'py-common-elements', concept: `Set intersection finds items in both collections.`, idiom: `return list(set(a) & set(b))`, mistake: `Sets drop order and duplicates.` },
  { problemId: 'py-all-positive', concept: `all() is True when every item passes; pair it with a generator.`, idiom: `return all(x > 0 for x in nums)`, mistake: `all([]) is True (vacuously).` },
  { problemId: 'py-safe-divide', concept: `try/except handles an error instead of crashing.`, idiom: `try:\n    return a / b\nexcept ZeroDivisionError:\n    return None`, mistake: `A bare except hides real bugs.` },
  { problemId: 'py-memoize', concept: `A decorator wraps a function to cache its results by arguments.`, idiom: `cache = {}\nif args in cache: return cache[args]`, mistake: `A mutable default argument as a cache leaks across calls.` },
  { problemId: 'py-group-by', concept: `Bucket items into a dict of lists by a computed key.`, idiom: `out.setdefault(k, []).append(x)`, mistake: `Overwriting the bucket instead of appending.` },
  { problemId: 'py-match-route', concept: `Compare path segments to a pattern, capturing :params.`, idiom: `pattern.split('/') vs path.split('/')`, mistake: `Not handling a differing number of segments.` },
  { problemId: 'py-string-format', concept: `f-strings interpolate values directly into text.`, idiom: `f"{name} has {count} items"`, mistake: `Forgetting the f prefix leaves literal braces.` },
  { problemId: 'py-zip-dict', concept: `dict(zip(keys, values)) pairs two lists into a dict.`, idiom: `return dict(zip(keys, values))`, mistake: `Mismatched lengths drop the extras.` },
  { problemId: 'py-flatten', concept: `Nest two loops (or extend) to flatten one level.`, idiom: `for sub in nested:\n    out.extend(sub)`, mistake: `append would re-nest; use extend.` },
  { problemId: 'py-filter-lambda', concept: `filter(fn, seq) keeps items where fn is truthy.`, idiom: `list(filter(lambda x: x > 0, nums))`, mistake: `filter returns an iterator; wrap it in list().` },
  { problemId: 'py-dedupe-order', concept: `Track seen items in a set to dedupe while keeping order.`, idiom: `if x not in seen:\n    seen.add(x); out.append(x)`, mistake: `set(items) dedupes but loses order.` },
  { problemId: 'py-sort-dicts', concept: `Sort a list of dicts by a field via a key lambda.`, idiom: `sorted(items, key=lambda d: d[key])`, mistake: `Comparing dicts directly raises a TypeError.` },
  { problemId: 'py-max-by-key', concept: `max(key=...) picks the item with the largest computed value.`, idiom: `return max(items, key=key_fn)`, mistake: `Returning the key value instead of the item.` },
  { problemId: 'py-class-counter', concept: `A class bundles state (self.count) with methods that change it.`, idiom: `def __init__(self):\n    self.count = 0`, mistake: `Forgetting self on attributes and method params.` },
  { problemId: 'py-json-roundtrip', concept: `json.dumps serializes to text; json.loads parses it back.`, idiom: `json.loads(json.dumps(obj))`, mistake: `Mixing up dumps (to string) and loads (from string).` },
  { problemId: 'py-defaultdict-group', concept: `defaultdict(list) auto-creates an empty list per new key.`, idiom: `out[key_fn(x)].append(x)`, mistake: `Return dict(out) if you need plain-dict equality.` },
  { problemId: 'py-is-palindrome', concept: `A palindrome reads the same reversed.`, idiom: `return s == s[::-1]`, mistake: `Not normalizing case/spaces when required.` },
  { problemId: 'py-chunk', concept: `Slice in steps of size to split a list into chunks.`, idiom: `[items[i:i + size] for i in range(0, len(items), size)]`, mistake: `The last chunk may be shorter — that is expected.` },
  { problemId: 'py-running-total', concept: `Emit the accumulator after each addition for cumulative sums.`, idiom: `total += n\nout.append(total)`, mistake: `Appending before adding shifts every value.` },
  { problemId: 'py-rotate', concept: `Slicing splits and recombines to rotate a list.`, idiom: `items[-k:] + items[:-k]`, mistake: `k can exceed length; use k % len(items).` },
  { problemId: 'py-merge-sum', concept: `Merge two dicts, adding values for shared keys.`, idiom: `out[k] = out.get(k, 0) + v`, mistake: `Overwriting instead of summing.` },
  { problemId: 'py-count-words', concept: `collections.Counter tallies occurrences in one call.`, idiom: `dict(Counter(text.split()))`, mistake: `Counter is a dict subclass; convert if you need a plain dict.` },
  { problemId: 'py-two-sum', concept: `A seen-map gives O(n): look for target - n as you go.`, idiom: `if target - n in seen:\n    return [seen[target - n], i]`, mistake: `The double loop is O(n^2).` },
  { problemId: 'py-flatten-deep', concept: `Recursion flattens nesting of any depth.`, idiom: `if isinstance(x, list):\n    out.extend(flatten_deep(x))`, mistake: `Handling only one level of nesting.` },
  { problemId: 'py-fib-memo', concept: `@lru_cache memoizes a function automatically.`, idiom: `@lru_cache(maxsize=None)\ndef fib(n): ...`, mistake: `Plain recursion is exponential without caching.` },
  { problemId: 'py-anagram-groups', concept: `Sorted letters are a canonical key shared by anagrams.`, idiom: `groups[''.join(sorted(w))].append(w)`, mistake: `Comparing words directly misses anagrams.` },
]
