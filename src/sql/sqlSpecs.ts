// Real SQL drills, graded by running the learner's query against Postgres
// (PGlite) and comparing the result set to a reference query on the same seeded
// data. Schemas, data, and prompts here are original to this course.
//
// Each spec seeds a small, self-contained database so the expected answer is
// obvious from the data. `solutionSql` is the reference answer; the self-check
// is simply: does the learner's result set equal the reference's?

export type SqlSpec = {
  problemId: string
  title: string
  // What the learner must write, in plain language.
  prompt: string
  // Schema + seed data (CREATE TABLE ... ; INSERT ...).
  setupSql: string
  // Pre-filled editor contents.
  starter: string
  // Reference query that produces the expected result set.
  solutionSql: string
  // For mutation drills: a SELECT run after the statement to capture table state.
  captureSql?: string
  // True when ORDER BY is part of the task and row order is graded.
  orderMatters?: boolean
  hint?: string
}

const PRODUCTS = `CREATE TABLE products (
  id integer PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  stock integer NOT NULL
);
INSERT INTO products (id, name, category, price, stock) VALUES
  (1, 'Aluminum Bottle', 'gear', 24, 40),
  (2, 'Trail Map', 'paper', 8, 150),
  (3, 'Headlamp', 'gear', 35, 12),
  (4, 'Wool Socks', 'apparel', 18, 60),
  (5, 'Rain Jacket', 'apparel', 90, 7),
  (6, 'Notebook', 'paper', 6, 200);`

const EMPLOYEES = `CREATE TABLE employees (
  id integer PRIMARY KEY,
  name text NOT NULL,
  department text NOT NULL,
  salary integer NOT NULL,
  manager_id integer
);
INSERT INTO employees (id, name, department, salary, manager_id) VALUES
  (1, 'Dana', 'engineering', 170000, NULL),
  (2, 'Mateo', 'engineering', 130000, 1),
  (3, 'Priya', 'engineering', 130000, 1),
  (4, 'Sven', 'sales', 95000, 1),
  (5, 'Lena', 'sales', 110000, 4);`

export const sqlSpecs: SqlSpec[] = [
  {
    problemId: 'sqldrill-select-where',
    title: 'SQL: SELECT ... WHERE',
    prompt:
      'Return every column for products that cost more than 20. WHERE filters which rows come back.',
    setupSql: PRODUCTS,
    starter: 'SELECT *\nFROM products\nWHERE ...;',
    solutionSql: 'SELECT * FROM products WHERE price > 20;',
    hint: 'WHERE price > 20 keeps only the rows where the condition is true.',
  },
  {
    problemId: 'sqldrill-project',
    title: 'SQL: SELECT Specific Columns',
    prompt:
      'Return only the name and price columns for every product. Choosing columns is called projection.',
    setupSql: PRODUCTS,
    starter: 'SELECT ...\nFROM products;',
    solutionSql: 'SELECT name, price FROM products;',
    hint: 'List the columns you want after SELECT, separated by commas.',
  },
  {
    problemId: 'sqldrill-order-by',
    title: 'SQL: ORDER BY',
    prompt:
      'Return name and price for all products, most expensive first. Row order is part of the answer here.',
    setupSql: PRODUCTS,
    starter: 'SELECT name, price\nFROM products\nORDER BY ...;',
    solutionSql: 'SELECT name, price FROM products ORDER BY price DESC;',
    orderMatters: true,
    hint: 'ORDER BY price DESC sorts high to low.',
  },
  {
    problemId: 'sqldrill-limit-offset',
    title: 'SQL: LIMIT / OFFSET',
    prompt:
      'Page through products ordered by id: skip the first 2 rows and return the next 2 (rows 3 and 4).',
    setupSql: PRODUCTS,
    starter: 'SELECT *\nFROM products\nORDER BY id\nLIMIT ... OFFSET ...;',
    solutionSql: 'SELECT * FROM products ORDER BY id LIMIT 2 OFFSET 2;',
    orderMatters: true,
    hint: 'OFFSET 2 skips two rows; LIMIT 2 then takes two.',
  },
  {
    problemId: 'sqldrill-distinct',
    title: 'SQL: SELECT DISTINCT',
    prompt: 'Return each distinct product category exactly once (one column named category).',
    setupSql: PRODUCTS,
    starter: 'SELECT ...\nFROM products;',
    solutionSql: 'SELECT DISTINCT category FROM products;',
    hint: 'SELECT DISTINCT category collapses duplicate category values.',
  },
  {
    problemId: 'sqldrill-sum',
    title: 'SQL: SUM',
    prompt:
      'Return the total number of items in stock across all products as a single column named total_stock.',
    setupSql: PRODUCTS,
    starter: 'SELECT SUM(...) AS total_stock\nFROM products;',
    solutionSql: 'SELECT SUM(stock) AS total_stock FROM products;',
    hint: 'SUM(stock) adds the column up; AS total_stock names the output.',
  },
  {
    problemId: 'sqldrill-avg',
    title: 'SQL: AVG',
    prompt:
      "Return the average price of products in the 'apparel' category as a single column named avg_price.",
    setupSql: PRODUCTS,
    starter: "SELECT AVG(price) AS avg_price\nFROM products\nWHERE ...;",
    solutionSql: "SELECT AVG(price) AS avg_price FROM products WHERE category = 'apparel';",
    hint: 'Filter to apparel with WHERE, then AVG(price) over what remains.',
  },
  {
    problemId: 'sqldrill-count-by',
    title: 'SQL: COUNT GROUP BY',
    prompt:
      'For each category, return the category and how many products it has, as columns category and n.',
    setupSql: PRODUCTS,
    starter: 'SELECT category, COUNT(*) AS n\nFROM products\nGROUP BY ...;',
    solutionSql: 'SELECT category, COUNT(*) AS n FROM products GROUP BY category;',
    hint: 'GROUP BY category makes one row per category; COUNT(*) counts each group.',
  },
  {
    problemId: 'sqldrill-update-where',
    title: 'SQL: UPDATE ... WHERE',
    prompt:
      "Raise the price of every 'gear' product by 10. Write the UPDATE; the grader checks the resulting table.",
    setupSql: PRODUCTS,
    starter: 'UPDATE products\nSET price = ...\nWHERE ...;',
    solutionSql: "UPDATE products SET price = price + 10 WHERE category = 'gear';",
    captureSql: 'SELECT id, name, category, price, stock FROM products ORDER BY id;',
    hint: 'SET price = price + 10, and WHERE category = \'gear\' so only gear changes.',
  },
  {
    problemId: 'sqldrill-subquery-in',
    title: 'SQL: WHERE key IN (subquery)',
    prompt:
      'Return the names of employees whose department appears in the sales team. Use a subquery that selects departments where someone earns less than 100000, then return employees IN those departments. Output one column: name.',
    setupSql: EMPLOYEES,
    starter:
      'SELECT name\nFROM employees\nWHERE department IN (\n  SELECT ... \n);',
    solutionSql:
      'SELECT name FROM employees WHERE department IN (SELECT department FROM employees WHERE salary < 100000);',
    hint: 'The inner SELECT returns a set of departments; IN matches rows against that set.',
  },
  {
    problemId: 'sqldrill-having',
    title: 'SQL: GROUP BY ... HAVING',
    prompt:
      'Return each department that has more than one employee, as columns department and headcount. HAVING filters groups after they are formed.',
    setupSql: EMPLOYEES,
    starter:
      'SELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department\nHAVING ...;',
    solutionSql:
      'SELECT department, COUNT(*) AS headcount FROM employees GROUP BY department HAVING COUNT(*) > 1;',
    hint: 'WHERE filters rows; HAVING filters the grouped result by its aggregate.',
  },
  {
    problemId: 'sqldrill-upsert',
    title: 'SQL: UPSERT (insert or update)',
    prompt:
      "Insert product id 3 with name 'Headlamp Pro', category 'gear', price 40, stock 20. If id 3 already exists, update its name, price, and stock to those values. Use INSERT ... ON CONFLICT. The grader checks the table.",
    setupSql: PRODUCTS,
    starter:
      "INSERT INTO products (id, name, category, price, stock)\nVALUES (3, 'Headlamp Pro', 'gear', 40, 20)\nON CONFLICT (id) DO UPDATE\nSET ...;",
    solutionSql:
      "INSERT INTO products (id, name, category, price, stock) VALUES (3, 'Headlamp Pro', 'gear', 40, 20) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, stock = EXCLUDED.stock;",
    captureSql: 'SELECT id, name, category, price, stock FROM products ORDER BY id;',
    hint: 'EXCLUDED refers to the row you tried to insert; assign its columns in DO UPDATE SET.',
  },
  {
    problemId: 'sqldrill-running-total',
    title: 'SQL: Window Running Total',
    prompt:
      'Return id, stock, and a running total of stock ordered by id, as columns id, stock, running. Use SUM(...) OVER (ORDER BY id).',
    setupSql: PRODUCTS,
    starter:
      'SELECT id, stock,\n  SUM(stock) OVER (ORDER BY id) AS running\nFROM products\nORDER BY id;',
    solutionSql:
      'SELECT id, stock, SUM(stock) OVER (ORDER BY id) AS running FROM products ORDER BY id;',
    orderMatters: true,
    hint: 'A window function with OVER (ORDER BY id) accumulates without collapsing rows.',
  },
  {
    problemId: 'sqldrill-left-join',
    title: 'SQL: LEFT JOIN',
    prompt:
      'Return every department name and the count of employees in it, including departments with zero employees. Output columns: name and headcount, ordered by name.',
    setupSql: `CREATE TABLE departments (id integer PRIMARY KEY, name text NOT NULL);
INSERT INTO departments (id, name) VALUES (1, 'engineering'), (2, 'sales'), (3, 'design');
CREATE TABLE staff (id integer PRIMARY KEY, name text NOT NULL, dept_id integer);
INSERT INTO staff (id, name, dept_id) VALUES
  (1, 'Dana', 1), (2, 'Mateo', 1), (3, 'Sven', 2);`,
    starter:
      'SELECT d.name, COUNT(s.id) AS headcount\nFROM departments d\nLEFT JOIN staff s ON ...\nGROUP BY d.name\nORDER BY d.name;',
    solutionSql:
      'SELECT d.name, COUNT(s.id) AS headcount FROM departments d LEFT JOIN staff s ON s.dept_id = d.id GROUP BY d.name ORDER BY d.name;',
    orderMatters: true,
    hint: "LEFT JOIN keeps every department; COUNT(s.id) is 0 where no staff match (design).",
  },
  {
    problemId: 'sqldrill-inner-join',
    title: 'SQL: INNER JOIN',
    prompt:
      'Return each employee name paired with their department name, only where the department exists. Columns: name and department, ordered by name.',
    setupSql: `CREATE TABLE departments (id integer PRIMARY KEY, name text NOT NULL);
INSERT INTO departments (id, name) VALUES (1, 'engineering'), (2, 'sales');
CREATE TABLE staff (id integer PRIMARY KEY, name text NOT NULL, dept_id integer);
INSERT INTO staff (id, name, dept_id) VALUES
  (1, 'Dana', 1), (2, 'Mateo', 1), (3, 'Sven', 2), (4, 'Ghost', 9);`,
    starter:
      'SELECT s.name, d.name AS department\nFROM staff s\nJOIN departments d ON ...\nORDER BY s.name;',
    solutionSql:
      'SELECT s.name, d.name AS department FROM staff s JOIN departments d ON d.id = s.dept_id ORDER BY s.name;',
    orderMatters: true,
    hint: "INNER JOIN drops rows with no match, so 'Ghost' (dept 9) disappears.",
  },
  {
    problemId: 'sqldrill-self-join',
    title: 'SQL: Self Join (manager name)',
    prompt:
      "Return each employee's name and their manager's name as columns employee and manager. Join employees to itself on manager_id. Skip anyone with no manager. Order by employee.",
    setupSql: EMPLOYEES,
    starter:
      'SELECT e.name AS employee, m.name AS manager\nFROM employees e\nJOIN employees m ON ...\nORDER BY e.name;',
    solutionSql:
      'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON m.id = e.manager_id ORDER BY e.name;',
    orderMatters: true,
    hint: 'Use two aliases for the same table: e for the worker, m for the manager.',
  },
  {
    problemId: 'sqldrill-rank',
    title: 'SQL: RANK() With Ties',
    prompt:
      'Rank employees by salary, highest first, with ties sharing a rank. Return name, salary, and rank as column rnk, ordered by rnk then name. (Two engineers tie at 130000.)',
    setupSql: EMPLOYEES,
    starter:
      'SELECT name, salary,\n  RANK() OVER (ORDER BY salary DESC) AS rnk\nFROM employees\nORDER BY rnk, name;',
    solutionSql:
      'SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees ORDER BY rnk, name;',
    orderMatters: true,
    hint: 'RANK() leaves a gap after a tie (1, 2, 2, 4, ...), unlike DENSE_RANK().',
  },
  {
    problemId: 'sqldrill-dedupe-latest',
    title: 'SQL: Latest Row Per Key',
    prompt:
      'Each sensor has several readings. Return the latest reading per sensor as columns sensor and value (the row with the largest ts for that sensor), ordered by sensor. Use DISTINCT ON or a window function.',
    setupSql: `CREATE TABLE readings (sensor text NOT NULL, ts integer NOT NULL, value integer NOT NULL);
INSERT INTO readings (sensor, ts, value) VALUES
  ('a', 1, 10), ('a', 3, 30), ('a', 2, 20),
  ('b', 1, 5), ('b', 2, 7);`,
    starter:
      'SELECT DISTINCT ON (sensor) sensor, value\nFROM readings\nORDER BY sensor, ts DESC;',
    solutionSql:
      'SELECT DISTINCT ON (sensor) sensor, value FROM readings ORDER BY sensor, ts DESC;',
    hint: 'DISTINCT ON (sensor) keeps the first row per sensor after ORDER BY sensor, ts DESC.',
  },
]

export const sqlSpecsByProblemId: Map<string, SqlSpec> = new Map(
  sqlSpecs.map((spec) => [spec.problemId, spec]),
)
