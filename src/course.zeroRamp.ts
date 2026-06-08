import type { Problem } from './course'

export const zeroRampProblems: Record<string, Problem[]> = {
  'js-fundamentals': [
    {
      id: 'js-zero-what-is-code',
      title: 'Start Here: JavaScript From Zero',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 20,
      prompt:
        'Learn what a JavaScript program is before using methods: files, statements, values, variables, functions, parameters, return values, and console output.',
      explanation:
        'JavaScript runs one statement after another. A value is data like 42 or "Kay". A variable is a name that points at a value. A function is a reusable block of code that can receive inputs called parameters and send a result back with return. console.log prints for humans; return gives a value back to code and tests.',
      production:
        'Backend JavaScript is mostly functions wired to HTTP, databases, queues, and files. If you cannot explain variables, function inputs, return values, and control flow, Express routes and Node services feel like magic instead of ordinary code.',
      walkthrough: [
        'Create a file such as app.js.',
        'Declare values with const when the name will not be reassigned and let when it will.',
        'Write a function with function name(parameter) { ... }.',
        'Use return to give the caller a result.',
        'Use console.log only when you want to print while learning or debugging.',
        'Run the file with node app.js.',
      ],
      example:
        'const name = "Kay"; function greet(user) { return "Hello, " + user; } console.log(greet(name));',
      questions: [
        'What is the difference between a value and a variable?',
        'What is the difference between console.log and return?',
        'When should you use const instead of let?',
        'What does a function parameter do?',
      ],
      checklist: [
        'Can create a .js file and run it with node.',
        'Can declare const and let variables.',
        'Can write a function with parameters and a return value.',
        'Can explain why tests check return values, not console output.',
      ],
    },
    {
      id: 'js-zero-variables',
      title: 'Variables: const And let',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Practice binding names to values. Return an object with a constant name, a mutable count after incrementing it, and a combined label.',
      example: "makeProfile() should return { name: 'backend', count: 2, label: 'backend:2' }.",
      checklist: [
        'Use const for a name that is not reassigned.',
        'Use let for a value you increment.',
        'Return the object instead of logging it.',
      ],
    },
    {
      id: 'js-zero-function-return',
      title: 'Function: Parameters And Return',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Write a function that accepts firstName and lastName parameters and returns one full name string.',
      example: "fullName('Ada', 'Lovelace') should return 'Ada Lovelace'.",
      checklist: [
        'Define a function with two parameters.',
        'Combine strings with a space between them.',
        'Use return, not console.log.',
      ],
    },
    {
      id: 'js-zero-if-else',
      title: 'If / Else: Choose A Branch',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Write a tiny access decision function. Return "allow" when a user is active and has the admin role; otherwise return "deny".',
      example: "canAccess({ active: true, role: 'admin' }) should return 'allow'.",
      checklist: [
        'Use if/else to choose a path.',
        'Check both active and role.',
        'Return a stable string from every branch.',
      ],
    },
  ],
  'python-fundamentals': [
    {
      id: 'python-zero-files-imports-run',
      title: 'Start Here: Python Files, Imports, And Running Code',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 22,
      prompt:
        'Learn how Python code exists on disk and runs: .py files, indentation, variables, functions, imports, __name__, print, return, and python file.py.',
      explanation:
        'A Python program usually lives in a .py file. Python runs the file top to bottom. Indentation creates blocks for functions, if statements, and loops. import brings in code from another module. print shows text to a human; return sends a value back to the caller. The if __name__ == "__main__" block is code that runs only when the file is executed directly.',
      production:
        'Python backend apps are many files importing each other: app setup, routes/views, services, repositories, settings, and tests. Import-time side effects are a common production trap, so beginners need to know what runs when a file is imported versus executed.',
      walkthrough: [
        'Create a file such as app.py.',
        'Declare a variable with name = value.',
        'Define a function with def name(params): and indented body.',
        'Use return for testable results and print for human debugging.',
        'Import standard-library code with import json or from pathlib import Path.',
        'Run the file with python app.py or python3 app.py.',
      ],
      example:
        'def greet(name):\n    return f"Hello, {name}"\n\nif __name__ == "__main__":\n    print(greet("Kay"))',
      questions: [
        'What does indentation mean in Python?',
        'What is the difference between importing a file and running it directly?',
        'Why is return better than print for code you want to test?',
        'What does import do?',
      ],
      checklist: [
        'Can create and run a .py file.',
        'Can define variables and functions.',
        'Can explain import and __name__.',
        'Can separate print from return.',
      ],
    },
    {
      id: 'py-zero-variable-return',
      title: 'Variables And Return',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Practice assigning names and returning a value. Return a dict with a name, count, and label.',
      example: "make_profile() should return {'name': 'backend', 'count': 2, 'label': 'backend:2'}.",
      checklist: [
        'Assign values to names.',
        'Update count before returning.',
        'Return a dict, not printed text.',
      ],
    },
    {
      id: 'py-zero-function-params',
      title: 'Function Parameters',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Write a function that accepts first_name and last_name and returns one full name string.',
      example: "full_name('Ada', 'Lovelace') should return 'Ada Lovelace'.",
      checklist: [
        'Use def with two parameters.',
        'Return a string with a space between names.',
        'Do not print inside the function.',
      ],
    },
    {
      id: 'py-zero-if-else',
      title: 'If / Else: Choose A Branch',
      type: 'coding',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Write a tiny access decision function. Return "allow" when a user is active and has role admin; otherwise return "deny".',
      example: "can_access({'active': True, 'role': 'admin'}) should return 'allow'.",
      checklist: [
        'Use if/else to choose a path.',
        'Check both active and role.',
        'Return a stable string from every branch.',
      ],
    },
  ],
  flask: [
    {
      id: 'flask-zero-install-file-run',
      title: 'Start Here: Create And Run A Flask App',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 28,
      prompt:
        'Learn the absolute first Flask workflow: create a folder, install Flask, create app.py, import Flask, define a route, return text or JSON, and run the development server.',
      explanation:
        'A Flask app starts as ordinary Python code. You install the flask package, import Flask, create an app object, attach route functions with @app.get or @app.route, and run the app with flask --app app run or python app.py during learning. Flask maps an HTTP request to your Python function and turns the function return value into an HTTP response.',
      production:
        'The built-in Flask development server is for learning and local work, not production. Production uses a WSGI server such as Gunicorn. Also, Flask does not automatically validate JSON, manage your database schema, or create a service layer; those are choices you add deliberately.',
      walkthrough: [
        'Create a project folder and a virtual environment.',
        'Install Flask with pip install flask.',
        'Create app.py.',
        'Write from flask import Flask, jsonify, request.',
        'Create app = Flask(__name__).',
        'Add @app.get("/health") above a function that returns {"ok": True}.',
        'Run flask --app app run and open /health in the browser or curl.',
      ],
      example:
        'from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.get("/health")\ndef health():\n    return jsonify({"ok": True})',
      questions: [
        'What does from flask import Flask do?',
        'What is the app object?',
        'What does @app.get("/health") connect?',
        'Why is the Flask dev server not the production server?',
      ],
      checklist: [
        'Can create app.py and import Flask.',
        'Can define one route function.',
        'Can run the local Flask server.',
        'Can explain route function to HTTP response.',
      ],
    },
  ],
  django: [
    {
      id: 'django-zero-install-project-run',
      title: 'Start Here: Create And Run A Django Project',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 32,
      prompt:
        'Learn the absolute first Django workflow: install Django, create a project, run manage.py, create an app, wire a URL to a view, and run the development server.',
      explanation:
        'A Django project is a Python package with settings, URL configuration, and server entrypoints. A Django app is a feature module inside the project, such as users or billing. You create a project with django-admin startproject, run commands with python manage.py, create feature apps with startapp, map URLs in urls.py, and write views that receive a request and return a response.',
      production:
        'Django gives more structure than Flask, but you still need to know the files. settings.py controls installed apps, database, security, and middleware. urls.py maps paths to views. manage.py runs local commands. Production does not use runserver; it uses WSGI/ASGI with a real web server and production settings.',
      walkthrough: [
        'Install Django with pip install django.',
        'Run django-admin startproject config .',
        'Run python manage.py runserver to start locally.',
        'Create a feature app with python manage.py startapp core.',
        'Add core to INSTALLED_APPS in settings.py.',
        'Write a view function that returns JsonResponse.',
        'Add a path in urls.py that points to the view.',
      ],
      example:
        'from django.http import JsonResponse\n\ndef health(request):\n    return JsonResponse({"ok": True})\n\n# urls.py\npath("health/", health)',
      questions: [
        'What is the difference between a Django project and a Django app?',
        'What does manage.py do?',
        'Where do URLs get mapped to views?',
        'Why is runserver not the production server?',
      ],
      checklist: [
        'Can create a Django project and feature app.',
        'Can explain manage.py, settings.py, urls.py, and views.py.',
        'Can wire one URL to one view.',
        'Can explain dev server versus production server.',
      ],
    },
  ],
}
