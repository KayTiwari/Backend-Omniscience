import type { Problem } from './course'

// SQL from absolute zero. Examples use two small tables (users, orders) that
// carry through every rung so the data stays familiar. All query results
// verified against a real database engine.

const usersTable = ` id | name | role   | email
----+------+--------+-----------------
  1 | Kay  | admin  | kay@example.com
  2 | Sam  | viewer | NULL
  3 | Lee  | editor | lee@example.com`

const ordersTable = ` id  | user_id | amount | status
-----+---------+--------+---------
 101 |       1 |     40 | paid
 102 |       2 |     75 | paid
 103 |       1 |    120 | pending
 104 |       3 |     15 | paid`

export const sqlFoundations: Problem[] = [
  {
    id: 'sql-rung-what-is-a-database',
    title: 'Rung 1: What Is A Database?',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt:
      'Understand tables, rows, and columns, and why backends keep data in a database instead of files or memory.',
    explanation: `Your program's variables vanish when the process stops. A database is a separate, long-running program whose entire job is keeping data safe and queryable: it survives restarts, accepts many connections at once, and answers questions about millions of rows in milliseconds.

**Table.** One kind of thing, laid out like a spreadsheet: a users table, an orders table.

**Row.** One record: the user Kay, order 101. New data means new rows.

**Column.** One field every row has, with a declared type: name is text, amount is a number. The database rejects data that does not fit, like a type system for storage.

**SQL.** Structured Query Language, the language every relational database speaks. You describe what you want; the database figures out how to get it. PostgreSQL is the open source engine this course targets, and the SQL here works almost everywhere.

The two tables below appear in every rung of this ladder, so read them once now: three users, four orders, and a user_id column on orders pointing at who placed each one.`,
    production:
      'Nearly every backend you will ever touch sits in front of a relational database. When an app is slow, the database is the first suspect; when data is wrong, the database is where truth gets checked. SQL fluency is the single most transferable backend skill.',
    walkthrough: [
      'Read the users table: 3 rows, 4 columns.',
      'Read the orders table and find the user_id column.',
      'Trace order 103 to its owner: user_id 1 is Kay.',
      'Say the words: table is the kind, row is the record, column is the field.',
    ],
    questions: [
      'Why not keep data in program variables?',
      'What does a column type enforce?',
      'What does user_id on orders point at?',
    ],
    checklist: [
      'Define table, row, and column.',
      'Trace a foreign key by eye.',
      'Explain what SQL is.',
    ],
    interactive: {
      mental:
        'A database is a warehouse of spreadsheets with a librarian who never sleeps: tables are the sheets, rows the entries, and SQL is how you ask the librarian.',
      diagram: {
        nodes: ['Table', 'Row', 'Column', 'Foreign key', 'SQL'],
        explanations: [
          'One kind of thing, laid out like a spreadsheet: users, orders, products. Each table declares its columns once.',
          'One record: the user Kay, order 101. New data means new rows; the shape never changes.',
          'One typed field every row has. The type is enforced: text in a number column is rejected at the door.',
          'A column holding the id of a row in another table, like user_id on orders. Following these pointers is what makes the data relational.',
          'The question language. You describe the result you want; the engine plans how to fetch it.',
        ],
      },
      intro: 'These two tables are the cast of the whole ladder. Meet them once, use them everywhere.',
      example: {
        code: '-- users                              -- orders\n-- one row per person                  -- one row per purchase\nSELECT * FROM users;                   SELECT * FROM orders;',
        output: `${usersTable}\n\n${ordersTable}`,
        explain:
          'SELECT * means every column. The users table has one row per person; orders has one row per purchase, and user_id ties each order to its owner.',
      },
      predicts: [
        {
          question: 'In the orders table, what is a single row?',
          options: ['one customer', 'one purchase', 'one product type'],
          correct: 1,
          why: 'A row is one record of the kind the table holds. The orders table holds purchases, so each row is one purchase.',
        },
        {
          question: 'Who placed order 103?',
          options: ['Sam', 'Kay', 'Lee'],
          correct: 1,
          why: 'Order 103 has user_id 1, and user 1 is Kay. Following ids between tables is the heart of relational data.',
        },
      ],
      tweak: {
        instruction: 'Find every order belonging to Kay by scanning the orders table by eye.',
        reveal: 'Orders 101 and 103 both have user_id 1. In two rungs, WHERE will do this scan for you.',
      },
      recap: [
        'A database keeps data alive, safe, and queryable across restarts.',
        'Table is the kind, row is the record, column is the typed field.',
        'user_id on orders points at the owning row in users.',
      ],
    },
  },
  {
    id: 'sql-rung-select',
    title: 'Rung 2: SELECT: Ask For Columns',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Read data with SELECT, choosing exactly which columns come back.',
    explanation: `SELECT is the read statement, and you will write it more than everything else combined.

**The shape.** SELECT name, role FROM users; lists the columns you want, then the table. The result is itself a table, with only those columns, one row per row that qualified (so far, all of them).

**SELECT \\*.** The star means every column. Fine for exploring by hand; avoided in application code because it silently changes shape when someone adds a column, and it hauls data you do not need.

**Statements end with a semicolon,** and SQL keywords are conventionally written in caps purely for readability: select works the same as SELECT.

The mental model that makes SQL click: every query takes tables in and produces a table out. Each new clause you learn just reshapes that flowing table.`,
    production:
      'Listing columns explicitly is also a performance and contract decision: the API returns what the query selects, so SELECT is where over-fetching starts. Code reviewers flag SELECT * in handlers for exactly this reason.',
    walkthrough: [
      'Write SELECT with two named columns FROM users.',
      'Compare with SELECT * and note the extra columns.',
      'Read the result as a new, smaller table.',
    ],
    questions: [
      'What does the result of a SELECT look like?',
      'Why is SELECT * discouraged in application code?',
    ],
    checklist: [
      'Select named columns from a table.',
      'Explain the table-in, table-out model.',
      'Say why explicit columns beat * in code.',
    ],
    interactive: {
      mental:
        'SELECT is a copy machine with column stencils: you choose which columns it copies, and the original is never touched.',
      diagram: {
        nodes: ['FROM table', 'Pick columns', 'Result table'],
        explanations: [
          'Name the source table. All of its rows are candidates until later clauses narrow them.',
          'List exactly the columns you want back. The star * means all of them, fine for exploring, avoided in code.',
          'Every query returns a table: the columns you picked, the rows that qualified. This table-in, table-out model is all of SQL.',
        ],
      },
      example: {
        code: 'SELECT name, role FROM users;',
        output: ' name | role\n------+--------\n Kay  | admin\n Sam  | viewer\n Lee  | editor',
        explain:
          'Two columns requested, so the result table has exactly those two, with every row since nothing filtered them yet.',
      },
      predicts: [
        {
          question: 'What does SELECT name FROM users; return?',
          options: [
            'one column, three rows',
            'the whole table',
            'one row',
          ],
          correct: 0,
          why: 'You asked for one column. All three rows still qualify, so the result is a one-column, three-row table.',
        },
        {
          question: 'The result of any SELECT is...',
          options: ['a single value', 'a table', 'a file'],
          correct: 1,
          why: 'Tables in, table out. Every clause you learn next just reshapes that result table.',
        },
      ],
      tweak: {
        instruction: 'Change the column list to email, name and predict the column order.',
        reveal: 'Columns come back in the order you list them: email first, then name. The SELECT list is the response shape.',
      },
      recap: [
        'SELECT columns FROM table; is the read statement.',
        'Every query returns a table.',
        'Name columns explicitly in real code.',
      ],
    },
  },
  {
    id: 'sql-rung-where',
    title: 'Rung 3: WHERE: Filter Rows',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Keep only the rows you want with WHERE, combining conditions with AND and OR.',
    explanation: `SELECT chose columns; WHERE chooses rows. Together they are most of daily SQL.

**The shape.** SELECT name FROM users WHERE role = 'admin'; tests every row and keeps the ones where the condition is true. Text values use single quotes in SQL; double quotes mean something else (identifiers), which trips up everyone arriving from JavaScript.

**Operators.** = for equals (one sign, this is SQL), <> or != for not equal, < <= > >= for ranges. AND and OR combine conditions, with parentheses to group when mixing them.

**Each row is judged alone.** The condition runs once per row with that row's values. There is no order to worry about and no loop to write; the database does the scan.

WHERE is also the difference between asking for a cup of water and asking for the ocean: without it, you get every row in the table.`,
    production:
      "A missing or wrong WHERE on a read means a slow query hauling the whole table. The same mistake on a write is catastrophic, as the rung on UPDATE and DELETE will make vivid. Production engineers read the WHERE clause first when reviewing any query.",
    walkthrough: [
      "Filter users to role = 'admin'.",
      'Widen it with OR to include editors.',
      'Note single quotes around text values.',
      'Try a numeric filter on orders: amount > 50.',
    ],
    questions: [
      'How does WHERE decide which rows survive?',
      'Why single quotes for text in SQL?',
    ],
    checklist: [
      'Filter rows with a text equality condition.',
      'Combine two conditions with OR.',
      'Filter on a numeric comparison.',
    ],
    interactive: {
      mental:
        'WHERE is a bouncer checking every row at the door: each row is judged alone, and only true gets in.',
      diagram: {
        nodes: ['All rows', 'Test each row', 'Keep matches', 'Result'],
        explanations: [
          'The FROM table supplies every row as a candidate.',
          'The WHERE condition runs once per row using that row values. There is no loop to write; the engine does the scan.',
          'Rows where the condition is true survive. AND demands both conditions on the same row; OR widens the net.',
          'The survivors flow on to sorting, limiting, or straight to the result.',
        ],
      },
      example: {
        code: "SELECT name, role FROM users\nWHERE role = 'admin' OR role = 'editor';",
        output: ' name | role\n------+--------\n Kay  | admin\n Lee  | editor',
        explain:
          "Each of the three rows is tested. Kay passes the first condition, Lee the second, Sam passes neither and is dropped.",
      },
      predicts: [
        {
          question: "What does SELECT name FROM users WHERE role = 'admin'; return?",
          options: ['Kay', 'Kay and Lee', 'all three names'],
          correct: 0,
          why: 'Only Kay has the admin role, so one row survives the filter.',
        },
        {
          question: 'What does SELECT id FROM orders WHERE amount > 50; return?',
          options: ['orders 102 and 103', 'order 103 only', 'all four orders'],
          correct: 0,
          why: 'Amounts are 40, 75, 120, 15. Only 75 and 120 exceed 50, which is orders 102 and 103.',
        },
      ],
      tweak: {
        instruction: "Change OR to AND in the example and predict the result before running.",
        reveal:
          'Zero rows. No single row has a role that is both admin and editor at once. AND tests one row at a time, a classic early SQL surprise.',
      },
      recap: [
        'WHERE judges every row alone and keeps the true ones.',
        "Text uses single quotes: role = 'admin'.",
        'AND across one row; OR widens the net.',
      ],
    },
  },
  {
    id: 'sql-rung-order-limit',
    title: 'Rung 4: ORDER BY And LIMIT',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Sort results with ORDER BY and cap them with LIMIT, the pair behind every top-N list.',
    explanation: `Rows come back in no guaranteed order unless you ask for one. Two clauses control it.

**ORDER BY.** ORDER BY amount DESC sorts the result by a column, descending. ASC (the default) sorts ascending. You can sort by several columns: ORDER BY status, amount DESC sorts by status first, then amount within each status.

**LIMIT.** LIMIT 2 caps the result at two rows, applied after sorting. Together they answer "top N" questions: largest orders, newest users, slowest requests.

**Order of operations.** The database filters with WHERE first, then sorts, then limits. That sequencing is why LIMIT is cheap: it does not skip the sort, but it stops sending rows once it has enough.

One warning worth carrying: LIMIT without ORDER BY gives you N arbitrary rows. If the order matters, say so explicitly.`,
    production:
      'Every paginated API endpoint is ORDER BY plus LIMIT (with OFFSET or a cursor for later pages). The number one pagination bug is a missing ORDER BY: page two then returns rows that page one already showed, because arbitrary order shifted between queries.',
    walkthrough: [
      'Sort orders by amount descending.',
      'Add LIMIT 2 to keep the top two.',
      'Reverse to ASC and re-read.',
      'Drop ORDER BY and recognize the result order is now arbitrary.',
    ],
    questions: [
      'When does LIMIT run relative to ORDER BY?',
      'Why is LIMIT without ORDER BY risky?',
    ],
    checklist: [
      'Sort by a column in both directions.',
      'Take a top-N with ORDER BY plus LIMIT.',
      'Explain why pagination requires an explicit order.',
    ],
    interactive: {
      mental:
        'ORDER BY lines everyone up; LIMIT takes the first N from the line.',
      diagram: {
        nodes: ['Filter', 'Sort', 'Cut', 'Result'],
        explanations: [
          'WHERE runs first and picks the qualifying rows.',
          'ORDER BY arranges them: DESC for largest first, multiple keys read left to right.',
          'LIMIT keeps the first N after the sort. Without an explicit sort, the N rows are arbitrary.',
          'Top-N answered: largest orders, newest users, slowest queries. Every leaderboard is this shape.',
        ],
      },
      example: {
        code: 'SELECT id, amount FROM orders\nORDER BY amount DESC\nLIMIT 2;',
        output: ' id  | amount\n-----+--------\n 103 |    120\n 102 |     75',
        explain:
          'All four orders are sorted by amount descending (120, 75, 40, 15), then LIMIT keeps the first two.',
      },
      predicts: [
        {
          question: 'With ORDER BY amount ASC LIMIT 1, which order comes back?',
          options: ['103 (120)', '104 (15)', '101 (40)'],
          correct: 1,
          why: 'Ascending puts the smallest first, and 15 is the smallest amount: order 104.',
        },
        {
          question: 'What does LIMIT 2 without any ORDER BY return?',
          options: [
            'the two largest rows',
            'two rows in no guaranteed order',
            'an error',
          ],
          correct: 1,
          why: 'Without ORDER BY the database may return any two rows, and the choice can change between runs. Explicit order or no promises.',
        },
      ],
      tweak: {
        instruction: 'Sort by two keys: ORDER BY status, amount DESC and predict the grouping.',
        reveal:
          'Rows group by status alphabetically (paid before pending), and within each status the amounts run high to low. Multi-key sorts read left to right.',
      },
      recap: [
        'ORDER BY sorts; DESC for largest first.',
        'LIMIT caps the result after the sort.',
        'Pagination without ORDER BY repeats and skips rows.',
      ],
    },
  },
  {
    id: 'sql-rung-write',
    title: 'Rung 5: INSERT, UPDATE, DELETE',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Change data with the three write statements, and respect the WHERE clause that keeps them safe.',
    explanation: `Three statements write data, and two of them are dangerous in a way every engineer learns once.

**INSERT adds rows.** INSERT INTO users (name, role) VALUES ('Ana', 'viewer'); names the columns, then supplies matching values. The id arrives automatically when the column is a generated primary key.

**UPDATE changes rows in place.** UPDATE users SET role = 'viewer' WHERE id = 3; finds the matching rows and rewrites the named columns.

**DELETE removes rows.** DELETE FROM orders WHERE status = 'canceled'; removes everything that matches.

**The WHERE rule.** UPDATE and DELETE apply to every row the WHERE matches, and to the entire table when WHERE is missing. UPDATE users SET role = 'viewer'; with no WHERE makes everyone a viewer in one keystroke. The professional habit: write the WHERE first, run it under a SELECT to see what it matches, then convert to the write.`,
    production:
      'The forgotten WHERE is a genuine production catastrophe class, famous enough to have war stories at every company. Real teams add protections: transactions to make mistakes reversible before commit, and review rules for any UPDATE or DELETE in a migration.',
    walkthrough: [
      'INSERT a new user, naming columns and values.',
      'SELECT with your intended WHERE to preview affected rows.',
      'Convert the preview into the UPDATE.',
      'DELETE with a tight WHERE and check the row count it reports.',
    ],
    questions: [
      'What happens to an UPDATE with no WHERE?',
      'How do you preview what a DELETE will remove?',
    ],
    checklist: [
      'Insert a row with named columns.',
      'Update one row by primary key.',
      'Preview a write with a SELECT first.',
    ],
    interactive: {
      mental:
        'Writes are surgery and the WHERE clause is the aim: INSERT adds, UPDATE rewires, DELETE removes, all exactly where you point.',
      diagram: {
        nodes: ['Preview SELECT', 'Same WHERE', 'Run the write', 'Check count'],
        explanations: [
          'Before any UPDATE or DELETE, run a SELECT with the intended WHERE to see exactly which rows will be hit.',
          'Reuse the identical WHERE in the write statement. The preview and the surgery must aim at the same rows.',
          'Execute. UPDATE rewrites the named columns of every matching row; DELETE removes them; no WHERE means the whole table.',
          'The database reports how many rows changed. A surprising count is your last chance to notice a bad aim.',
        ],
      },
      example: {
        code: "UPDATE users SET role = 'viewer' WHERE id = 3;\n\nSELECT name, role FROM users;",
        output: ' name | role\n------+--------\n Kay  | admin\n Sam  | viewer\n Lee  | viewer',
        explain:
          'The WHERE matched exactly one row (Lee, id 3) and rewrote its role. Kay and Sam are untouched because the filter never matched them.',
      },
      predicts: [
        {
          question: "What does UPDATE users SET role = 'viewer'; (no WHERE) do?",
          options: [
            'updates no rows',
            'updates every row in the table',
            'throws a syntax error',
          ],
          correct: 1,
          why: 'No WHERE means all rows match. The statement is valid SQL and the database will cheerfully obey it.',
        },
        {
          question: "After DELETE FROM orders WHERE status = 'pending'; how many orders remain?",
          options: ['4', '3', '1'],
          correct: 1,
          why: 'Only order 103 is pending. Deleting it leaves the three paid orders.',
        },
      ],
      tweak: {
        instruction: 'Write the safety preview for that DELETE: the SELECT that shows exactly what would be removed.',
        reveal:
          "SELECT * FROM orders WHERE status = 'pending'; shows one row: order 103. Same WHERE, read instead of write. Preview first is the habit that prevents the war story.",
      },
      recap: [
        'INSERT adds, UPDATE rewrites, DELETE removes.',
        'UPDATE and DELETE obey the WHERE, and hit everything without one.',
        'Preview every write with a SELECT using the same WHERE.',
      ],
    },
  },
  {
    id: 'sql-rung-join',
    title: 'Rung 6: JOIN: Combine Tables',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 16,
    prompt: 'Stitch tables together with JOIN ... ON, the move that makes relational databases relational.',
    explanation: `The orders table stores user_id 1, but a human wants to read "Kay". JOIN matches rows across tables so one query answers questions neither table can alone.

**The shape.** FROM orders JOIN users ON orders.user_id = users.id pairs each order row with the user row whose id matches. The result is a wider table carrying columns from both sides, and you SELECT whichever you need.

**The ON condition is the matching rule.** Almost always foreign key equals primary key. Get it wrong (or omit it) and you pair every row with every row, a cross product that explodes in size and nonsense.

**Qualified names.** With two tables in play, write table.column (users.name) so there is no ambiguity about which side a column comes from.

**Row counts.** An inner JOIN (the default) keeps only matched pairs. Kay has two orders, so Kay appears twice in the result: the row count follows the orders side. LEFT JOIN, which you will meet later, also keeps unmatched rows from the left table.`,
    production:
      'Real questions span tables: which customers ordered this product, which orders belong to inactive accounts. The N+1 query bug, the most common ORM performance problem, is code looping one query per row instead of letting a single JOIN do the matching in the database.',
    walkthrough: [
      'Write FROM orders JOIN users ON orders.user_id = users.id.',
      'SELECT users.name with orders.amount and orders.status.',
      'Count result rows and explain why Kay appears twice.',
      'Read the ON clause out loud as the matching rule.',
    ],
    questions: [
      'What does the ON clause decide?',
      'Why does Kay appear twice in the result?',
      'What goes wrong without ON?',
    ],
    checklist: [
      'Join two tables on a foreign key.',
      'Qualify columns with table names.',
      'Predict the row count of an inner join.',
    ],
    interactive: {
      mental:
        'JOIN is a matchmaking party: the ON rule decides which rows pair up, and every pair walks out as one wider row.',
      diagram: {
        nodes: ['orders rows', 'ON rule', 'users rows', 'Matched pairs'],
        explanations: [
          'The left side supplies its rows: every order, each carrying a user_id pointer.',
          'ON orders.user_id = users.id is the matching rule: pair rows where the pointer equals the identity.',
          'The right side supplies its rows: every user, each with a unique id.',
          'Each match becomes one row with columns from both sides. Two orders for Kay means Kay appears twice: the count follows the pairs.',
        ],
      },
      example: {
        code: 'SELECT users.name, orders.amount, orders.status\nFROM orders\nJOIN users ON orders.user_id = users.id;',
        output:
          ' name | amount | status\n------+--------+---------\n Kay  |     40 | paid\n Sam  |     75 | paid\n Kay  |    120 | pending\n Lee  |     15 | paid',
        explain:
          'Each of the four orders found its owner through the ON rule. Kay owns two orders, so her name appears on two rows: the result follows the orders.',
      },
      predicts: [
        {
          question: 'Why does Kay appear twice?',
          options: [
            'a bug in the join',
            'she owns two orders, and each pairs with her user row',
            'the table has duplicate users',
          ],
          correct: 1,
          why: 'Inner joins produce one row per matched pair. Two orders match Kay, so two pairs exist.',
        },
        {
          question: 'What does the ON clause in this join express?',
          options: [
            'which columns to return',
            'the rule for matching an order to its user',
            'the sort order',
          ],
          correct: 1,
          why: 'ON is the matching rule: pair rows where the order’s user_id equals the user’s id.',
        },
        {
          question: "Add WHERE users.name = 'Kay' to the join. How many rows?",
          options: ['1', '2', '4'],
          correct: 1,
          why: 'The join produces four rows, then WHERE keeps the two belonging to Kay. Filters compose with joins naturally.',
        },
      ],
      tweak: {
        instruction: 'Add ORDER BY orders.amount DESC to the join and predict the first row.',
        reveal:
          'Kay with 120 (pending) comes first. Clauses compose: join, then filter, then sort, then limit, in one declarative statement.',
      },
      writeDrillId: 'sql-join-practice',
      recap: [
        'JOIN ... ON pairs rows across tables by the matching rule.',
        'Qualify columns: users.name, orders.amount.',
        'Inner join row count follows the matched pairs.',
      ],
    },
  },
  {
    id: 'sql-rung-group',
    title: 'Rung 7: GROUP BY And Aggregates',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt: 'Summarize many rows into few with GROUP BY, COUNT, and SUM.',
    explanation: `So far every query returned rows. Aggregation answers a different kind of question: how many, how much, on average.

**Aggregate functions.** COUNT(*) counts rows, SUM(amount) totals a column, AVG, MIN, and MAX do what they say. Alone, they collapse the whole table to one row: SELECT COUNT(*) FROM orders; gives 4.

**GROUP BY makes buckets.** GROUP BY status splits rows into one bucket per distinct status, and the aggregates run once per bucket. The result has one row per bucket, which is the dashboard shape: paid orders and their total, pending orders and theirs.

**The golden rule.** Every column in the SELECT must be either inside an aggregate or listed in GROUP BY. Asking for a bare column that varies within a bucket is ambiguous, and PostgreSQL rejects it with an error instead of guessing.

**AS names things.** COUNT(*) AS order_count labels the output column so the result (and the JSON it becomes) reads cleanly.`,
    production:
      'Dashboards, reports, and admin screens are GROUP BY queries: revenue by day, signups by plan, errors by endpoint. Pushing aggregation into the database instead of fetching all rows and counting in code is routinely a hundred-fold performance win.',
    walkthrough: [
      'Collapse the table once: SELECT COUNT(*) FROM orders.',
      'Bucket by status with GROUP BY and count each bucket.',
      'Add SUM(amount) beside the count.',
      'Label outputs with AS.',
    ],
    questions: [
      'What does GROUP BY status do to the rows?',
      'Why must selected columns be aggregated or grouped?',
    ],
    checklist: [
      'Count all rows in a table.',
      'Group by a column and aggregate per bucket.',
      'Name result columns with AS.',
    ],
    interactive: {
      mental:
        'GROUP BY sorts rows into labeled buckets, and the aggregates write one summary line per bucket.',
      diagram: {
        nodes: ['Rows', 'Bucket by column', 'Aggregate per bucket', 'One row each'],
        explanations: [
          'The filtered rows arrive from FROM and WHERE as usual.',
          'GROUP BY status drops each row into the bucket matching its value: paid rows together, pending together.',
          'COUNT, SUM, AVG, MIN, MAX run once per bucket over its members.',
          'The result has one row per bucket. Selecting a bare column that varies inside a bucket is ambiguous, and PostgreSQL rejects it.',
        ],
      },
      example: {
        code: 'SELECT status, COUNT(*) AS order_count, SUM(amount) AS total\nFROM orders\nGROUP BY status;',
        output:
          ' status  | order_count | total\n---------+-------------+-------\n paid    |           3 |   130\n pending |           1 |   120',
        explain:
          'Four rows fall into two buckets by status. Each bucket reports its row count and amount total: three paid orders worth 130, one pending worth 120.',
      },
      predicts: [
        {
          question: 'How many rows does a GROUP BY status query return here?',
          options: ['4, one per order', '2, one per distinct status', '1'],
          correct: 1,
          why: 'One output row per bucket, and there are two distinct statuses in the data.',
        },
        {
          question: 'What does SELECT status, amount FROM orders GROUP BY status; do in PostgreSQL?',
          options: [
            'returns an arbitrary amount per bucket',
            'fails: amount is neither aggregated nor grouped',
            'sums automatically',
          ],
          correct: 1,
          why: 'Each paid bucket holds several different amounts, so a bare amount is ambiguous. PostgreSQL raises an error instead of picking one.',
        },
      ],
      tweak: {
        instruction: 'Group by user_id instead of status and predict the bucket count.',
        reveal:
          'Three buckets: user 1 has 2 orders totaling 160, users 2 and 3 have one each. Joining this back to users for names is exactly rung 6 plus rung 7 composed.',
      },
      writeDrillId: 'db-group-by',
      recap: [
        'Aggregates collapse rows; GROUP BY makes the buckets.',
        'Select only grouped columns or aggregates.',
        'Summarize in the database, never by hauling all rows into code.',
      ],
    },
  },
  {
    id: 'sql-rung-keys-null',
    title: 'Rung 8: Primary Keys, NULL, And Indexes',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'The three ideas behind table design: identity, absence, and speed.',
    explanation: `Three concepts complete the foundation, and each guards against a specific class of bug.

**Primary keys.** Every table declares one column (usually id) as its unique, never-null identifier. The database enforces uniqueness: a second row with id 1 is rejected, which is why ids are safe to point at from other tables. The user_id column on orders is a foreign key, and the database can enforce that too, refusing an order whose user does not exist.

**NULL is absence.** Sam has no email, and that cell holds NULL: no value at all, distinct from an empty string. NULL infects comparisons: email = NULL is never true, even for NULL cells, because nothing equals unknown. The special forms IS NULL and IS NOT NULL exist for exactly this test.

**Indexes are speed.** Without an index, a WHERE scan reads every row. CREATE INDEX ON orders (user_id) builds a sorted lookup structure, turning the scan into a direct jump, like a book index versus reading every page. Primary keys are indexed automatically; columns you filter or join on frequently earn explicit indexes. The cost: each index slows writes slightly, since it must be maintained.`,
    production:
      'The classic production slowdown is a missing index on a foreign key: fine with a thousand rows in development, minutes-long with fifty million in production. And the classic logic bug is = NULL silently matching nothing while the author believes it works. Both are interview staples for good reason.',
    walkthrough: [
      'Identify the primary key of each table you meet.',
      'Find Sam with IS NULL, then fail to find him with = NULL.',
      'Name the columns on orders worth indexing and say why.',
      'State the write cost of an index.',
    ],
    questions: [
      'What two guarantees does a primary key give?',
      'Why does email = NULL match nothing?',
      'What does an index trade away for read speed?',
    ],
    checklist: [
      'Explain primary and foreign keys.',
      'Test for absence with IS NULL.',
      'Decide which column deserves an index and defend it.',
    ],
    interactive: {
      mental:
        'A primary key is a fingerprint, NULL is an empty box (nothing equals it, even another empty box), and an index is the index page of a book.',
      diagram: {
        nodes: ['Primary key', 'Foreign key', 'NULL', 'Index'],
        explanations: [
          'The unique, never-null identity of each row. The database enforces it: duplicate ids are rejected, never overwritten.',
          'A pointer at another table identity, like user_id on orders. The database can refuse orders whose user does not exist.',
          'The absence of a value, distinct from empty string or zero. Comparisons with = never match it; IS NULL and IS NOT NULL exist for exactly this.',
          'A sorted lookup structure that turns full-table scans into direct jumps. Index what you filter and join on; pay a small tax on writes.',
        ],
      },
      example: {
        code: "SELECT name FROM users WHERE email IS NULL;\n\n-- compare with the trap:\nSELECT name FROM users WHERE email = NULL;",
        output: ' name\n------\n Sam\n\n(0 rows)',
        explain:
          'IS NULL finds Sam, whose email is absent. The = NULL form returns zero rows because nothing equals unknown, including unknown itself.',
      },
      predicts: [
        {
          question: "What happens when you INSERT a second user with id 1?",
          options: [
            'it overwrites Kay',
            'the database rejects it with a uniqueness violation',
            'it gets id 4 automatically',
          ],
          correct: 1,
          why: 'The primary key enforces uniqueness. Duplicate identity is an error, never a silent overwrite.',
        },
        {
          question: 'Queries filter orders by user_id constantly. What makes them fast at scale?',
          options: [
            'a LIMIT clause',
            'an index on orders(user_id)',
            'selecting fewer columns',
          ],
          correct: 1,
          why: 'An index turns the full-table scan into a direct lookup. This is the single most common fix for a slow production query.',
        },
        {
          question: 'Is NULL the same as an empty string?',
          options: ['yes', 'no: NULL is absence, "" is a present empty value'],
          correct: 1,
          why: 'An empty string is a value you can compare with =. NULL is the absence of any value and needs IS NULL.',
        },
      ],
      tweak: {
        instruction: 'Write the query for users who DO have an email.',
        reveal: 'SELECT name FROM users WHERE email IS NOT NULL; returns Kay and Lee. Absence and presence each get their own operator.',
      },
      recap: [
        'Primary keys: unique, never null, the anchor other tables point at.',
        'NULL needs IS NULL; = NULL matches nothing ever.',
        'Index the columns you filter and join on; pay a small write tax.',
      ],
    },
  },
]
