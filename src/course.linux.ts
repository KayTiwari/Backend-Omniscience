import type { Subject } from './course'
import { TerminalIcon } from './TechIcons'

// Linux & the Shell. A from-zero ladder for the command line: you type a command,
// the shell runs a program, you read its output, you chain programs together.
// Every lesson is DOING-first (cold open, live artifact = real terminal output,
// build-then-break, do-this-now with real commands you run in your own terminal,
// war story, receipt). There is no in-browser shell, so the DOING is authentic
// commands you paste into a real terminal (macOS Terminal, WSL, or any Linux box).
//
// PHASE 1 COVERAGE CHECKLIST (this file):
//   shell mental model · terminal · prompt
//   pwd · ls · cd · working directory
//   absolute vs relative paths · home (~) · root (/) · . · ..
//   cat · less · head · tail
//   mkdir · touch · cp · mv · rm
//   permissions: rwx · user/group/other · chmod (octal) · chown
//   pipes (|) · redirection (> >> <) · stdin/stdout/stderr
//   grep (basics)
//   find (basics)

export const linuxSubject: Subject = {
  id: 'linux',
  title: 'Linux & the Shell',
  subtitle: 'From your first prompt to a fluent command line: navigate, read and manage files, set permissions, pipe and redirect, and search with grep and find.',
  icon: TerminalIcon,
  color: '#2f80ed',
  problems: [
    {
      id: 'linux-rung-shell',
      title: 'Module 1: What Is The Shell?',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 10,
      prompt: 'Explain what the shell is in one sentence, and why "the terminal" and "the shell" are two different things.',
      explanation: `The shell is a program that reads a line of text, runs the program you named, and shows you its output. That loop (read a command, run it, print the result) is the entire command line.

**Terminal vs shell.** The terminal is the window that shows text and takes your keystrokes. The shell (bash, zsh, sh) is the program running inside it that interprets what you type. The terminal is the screen; the shell is the brain. People say "the terminal" to mean both, but when something behaves oddly it helps to know which one you are talking to.

**A command is just a program plus arguments.** When you type \`ls -l /etc\`, the shell finds the \`ls\` program, hands it the argument \`-l\` (an option) and \`/etc\` (a target), runs it, and prints whatever it writes out. Almost everything on the command line is this same shape: a program name, then options and targets.

**The prompt is the shell waiting.** The text before your cursor (often ending in \`$\`) is the prompt: the shell telling you it is idle and ready for the next command. When the prompt is gone, a program is still running.`,
      production:
        'Every server you ever deploy to, every CI runner, every Docker container is reached through a shell. Knowing whether you are talking to the terminal, the shell, or the program running inside it is the difference between fixing a problem and guessing at it.',
      walkthrough: [
        'Define the shell as a read-run-print loop for commands.',
        'Separate the terminal (the window) from the shell (the interpreter).',
        'Break one command into program + options + targets.',
        'Identify the prompt and what it tells you.',
      ],
      questions: [
        'What does the shell actually do with a line you type?',
        'What is the difference between the terminal and the shell?',
        'In `ls -l /etc`, which part is the program, the option, and the target?',
      ],
      checklist: [
        'Explain the shell in one sentence.',
        'Distinguish terminal from shell.',
        'Decompose a command into its parts.',
      ],
      interactive: {
        coldOpen:
          'Open a terminal and you are staring at a blinking cursor after a dollar sign. That is not "the computer". It is one specific program, waiting, that will take the next line you type as the name of another program to run. Type one word and press enter, and you have just commanded the machine the same way every sysadmin and deploy script does.',
        mental:
          'The shell is a read-run-print loop: it reads the line you type, runs the program you named with the arguments you gave, prints whatever that program outputs, then shows the prompt and waits again.',
        diagram: {
          nodes: ['You type a line', 'Shell parses it', 'Shell runs the program', 'Program prints output', 'Prompt returns'],
          explanations: [
            'You enter a command and press Enter.',
            'The shell splits it into a program name plus options and targets.',
            'The shell locates and launches that program with those arguments.',
            'The program writes its result to the screen.',
            'The shell prints the prompt and waits for the next line.',
          ],
        },
        example: {
          code: '$ whoami\nabhi\n$ echo "hello from the shell"\nhello from the shell\n$ ls -l /etc/hosts\n-rw-r--r--  1 root  wheel  213 Jun 21 10:02 /etc/hosts',
          output:
            'whoami            -> a program that prints your username\necho "..."        -> a program that prints its argument\nls -l /etc/hosts  -> program=ls, option=-l, target=/etc/hosts',
          explain:
            'Each line is the same shape: the shell takes the first word as the program, the rest as arguments, runs it, and prints what it returns. Then the $ prompt comes back.',
        },
        build: {
          simple: 'The shell runs the command you type and shows the result.',
          actually:
            'The shell parses your line into a program name plus arguments, finds that program on disk (using the PATH), runs it as a process, streams its output to your screen, and then prints the prompt again. "bash" and "zsh" are two such shells with slightly different features.',
          breaks:
            'When a command "hangs", the prompt does not return because the program has not exited (it may be waiting on input or stuck). When you get "command not found", the shell could not find a program by that name on the PATH. Knowing it is the shell looking up a program tells you where to look.',
        },
        doThisNow: [
          {
            task: 'Open your terminal and ask the shell what it is and who you are.',
            command: 'echo "$0"; whoami',
            reveal:
              'echo "$0" prints the name of the shell you are in (for example -zsh or bash). whoami prints your username. You just confirmed which interpreter is reading your commands.',
          },
          {
            task: 'Run one command three ways to see program + arguments: a bare program, a program with an option, and a program with an option and a target.',
            command: 'date; date -u; ls -a .',
            reveal:
              'date prints local time, date -u prints UTC (the -u option changed its behavior), and ls -a . lists everything (including hidden files) in the current directory (the . target). Same shape every time: program, options, target.',
          },
        ],
        warStory:
          'A new engineer pasted a long-running data import into a terminal, saw no prompt come back, assumed it had frozen, and closed the window, killing the import halfway and corrupting a table. The prompt was missing because the program was still running, exactly as designed. Reading the prompt is reading the machine.',
        tweak: {
          instruction: 'Explain to a teammate why "command not found" is not the same kind of error as a program that runs and fails.',
          reveal:
            '"command not found" means the shell never located a program by that name (a lookup failure, before anything ran). A program that runs and exits with an error did get found and executed; its own logic failed. Different layer, different fix.',
        },
        receipt: {
          explain: [
            'The shell reads a line, runs the named program, prints output, repeats.',
            'The terminal is the window; the shell is the interpreter inside it.',
          ],
          command: 'echo "$0"',
          question: 'The shell ran ls "in the current directory". Where is "here", and how do you see it and move?',
        },
        recap: [
          'The shell is a read-run-print loop for commands.',
          'A command is a program plus options and targets.',
          'The prompt means the shell is idle and waiting.',
        ],
      },
    },

    {
      id: 'linux-rung-navigation',
      title: 'Module 2: Where Am I? (pwd, ls, cd)',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 10,
      prompt: 'You always sit in exactly one directory. Name the three commands that tell you where you are, what is here, and how to move.',
      explanation: `At every moment your shell sits inside exactly one directory, called the working directory. Three commands manage it: \`pwd\` prints it, \`ls\` lists what is in it, and \`cd\` changes it.

**pwd: print working directory.** It answers "where am I right now" with a full path from the top of the filesystem. When a command behaves unexpectedly, the first question is almost always "what directory am I in", and \`pwd\` answers it.

**ls: list.** By itself it shows the names in the current directory. \`ls -l\` shows the long form (permissions, owner, size, date). \`ls -a\` shows hidden entries (names starting with a dot). \`ls -la\` combines both, the single most-typed listing in practice.

**cd: change directory.** \`cd projects\` moves into a subdirectory; \`cd ..\` moves up one level; \`cd\` with no argument jumps to your home directory. After every \`cd\`, your working directory changed and every relative command now means something different.`,
      production:
        'Most "the script deleted the wrong files" and "it cannot find the file" incidents are really "I was in the wrong directory". A reflexive pwd before any destructive command is a habit that saves outages.',
      walkthrough: [
        'State that the shell always has one working directory.',
        'Use pwd to print it.',
        'Use ls, ls -l, and ls -a to inspect it.',
        'Use cd, cd .., and cd to move and reset.',
      ],
      questions: [
        'What does the working directory mean?',
        'What is the difference between ls -l and ls -a?',
        'What does cd with no argument do?',
      ],
      checklist: [
        'Print the current directory with pwd.',
        'List contents including hidden files.',
        'Move down, up, and home with cd.',
      ],
      interactive: {
        coldOpen:
          'Two engineers run the exact same command, rm -rf build, and one frees disk space while the other deletes a customer report. Same command, different working directory. The command line has no "you are here" map pinned to the wall, so you carry it in your head and confirm it with one keystroke before anything dangerous.',
        mental:
          'You are always standing in exactly one directory. pwd says where, ls says what is here, cd walks you somewhere else.',
        diagram: {
          nodes: ['/', '/home', '/home/abhi (you are here)', '/home/abhi/projects'],
          explanations: [
            'The filesystem is a tree with a single root, /.',
            '/home holds user directories.',
            'Your working directory: pwd prints this full path.',
            'cd projects moves you down into here; cd .. moves you back up.',
          ],
        },
        example: {
          code: '$ pwd\n/home/abhi\n$ ls\nprojects  notes.txt  .bashrc\n$ ls -la\ndrwxr-xr-x  4 abhi abhi 4096 Jun 21 09:10 projects\n-rw-r--r--  1 abhi abhi  812 Jun 20 22:01 notes.txt\n-rw-r--r--  1 abhi abhi  220 Jun 01 08:00 .bashrc\n$ cd projects\n$ pwd\n/home/abhi/projects',
          output:
            'pwd     -> the full path you are standing in\nls      -> visible names only\nls -la  -> long form + hidden (.bashrc) + permissions/owner/size/date\ncd      -> changes the working directory; pwd confirms the move',
          explain:
            'Notice .bashrc only appears with -a (it starts with a dot, so it is hidden). After cd projects, pwd shows you moved one level down.',
        },
        build: {
          simple: 'pwd shows where you are, ls shows what is here, cd moves you.',
          actually:
            'The working directory is per-shell state: each terminal tab has its own. Paths in ls -l decode to permissions, link count, owner, group, size, modified time, and name. cd updates a variable the shell keeps ($PWD) that every relative path is resolved against.',
          breaks:
            'Open a second tab and it may start in a different directory, so a relative command that worked in tab one does nothing useful in tab two. A script that assumes a directory without cd-ing there first runs against whatever directory it happened to launch from.',
        },
        doThisNow: [
          {
            task: 'Find out where you are and what is around you, hidden files included.',
            command: 'pwd; ls -la',
            reveal:
              'pwd prints your full path; ls -la shows every entry with permissions, owner, size, and date, including dotfiles like .bashrc or .git that plain ls hides.',
          },
          {
            task: 'Move into a subdirectory, confirm the move, then jump straight back to home.',
            command: 'cd /tmp && pwd && cd && pwd',
            reveal:
              'pwd after cd /tmp prints /tmp; cd with no argument returns you to your home directory, and the final pwd proves it. cd .. would instead move up exactly one level.',
          },
        ],
        warStory:
          'A deploy script ran rm -rf ./* to clean a build folder, but a missing cd meant it executed from the repository root in CI. It wiped the checkout mid-job. The fix was one line: cd into the build directory first, and pwd-echo it to the log. Always know the directory before you delete from it.',
        tweak: {
          instruction: 'Your teammate says "ls shows nothing but the folder is not empty". What flag do they need and why?',
          reveal:
            'They need ls -a. The directory likely contains only hidden entries (names starting with a dot), which plain ls omits. -a reveals them.',
        },
        receipt: {
          explain: [
            'The shell always has one working directory; pwd prints it.',
            'ls -la shows everything here with permissions and owners.',
          ],
          command: 'pwd; ls -la',
          question: 'cd projects and cd /home/abhi/projects can land in the same place. What is the difference between those two kinds of paths?',
        },
        recap: [
          'You always occupy exactly one working directory.',
          'pwd prints it, ls lists it, cd changes it.',
          'ls -a reveals hidden dotfiles; ls -l shows details.',
        ],
      },
    },

    {
      id: 'linux-rung-paths',
      title: 'Module 3: Paths (absolute, relative, ~, /, ., ..)',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt: 'Explain the difference between an absolute path and a relative path, and what ~, /, ., and .. each mean.',
      explanation: `A path is an address for a file or directory. There are two kinds: absolute paths start from the root and are the same no matter where you stand; relative paths start from your current directory and change meaning as you move.

**Absolute paths start with /.** \`/home/abhi/notes.txt\` names that file from the top of the tree down. It works identically from anywhere, which is why scripts and config files prefer it.

**Relative paths start from where you are.** \`notes.txt\` or \`projects/app.js\` is resolved against your working directory. The same relative path points at different files depending on your \`pwd\`.

**The shorthand symbols.** \`/\` is the root of the whole filesystem. \`~\` is your home directory (\`/home/abhi\`). \`.\` is the current directory. \`..\` is the parent directory. So \`../config\` means "config in the directory above me" and \`./run.sh\` means "the run.sh right here".`,
      production:
        'Hardcoding a relative path in a cron job or systemd service is a classic outage: the job runs from a different directory than your shell, so the relative path resolves somewhere unexpected. Absolute paths (or an explicit cd first) remove the ambiguity.',
      walkthrough: [
        'Define a path as an address for a file.',
        'Contrast absolute (from /) with relative (from here).',
        'Decode /, ~, ., and ..',
        'Predict where a relative path resolves given a working directory.',
      ],
      questions: [
        'How do you tell an absolute path from a relative one at a glance?',
        'What do ~ and .. mean?',
        'Why might the same relative path open different files?',
      ],
      checklist: [
        'Identify absolute vs relative paths.',
        'Expand ~, ., and ..',
        'Resolve a relative path against a working directory.',
      ],
      interactive: {
        coldOpen:
          'A backup script ran every night for a year writing to logs/backup.log, until someone scheduled it from a different directory and a year of logs silently started landing somewhere nobody looked. The path was relative, so "where it wrote" depended on "where it ran". One leading slash would have pinned it forever.',
        mental:
          'Absolute paths start at the root / and never change; relative paths start at your current directory and shift as you move. ~ is home, . is here, .. is up one.',
        diagram: {
          nodes: ['/ (root)', '~ = /home/abhi (home)', '. (current dir)', '.. (parent dir)'],
          explanations: [
            'The single top of the filesystem; absolute paths begin here.',
            'Shorthand for your home directory, expanded by the shell.',
            'The directory you are standing in right now.',
            'The directory one level up from where you are.',
          ],
        },
        example: {
          code: '$ pwd\n/home/abhi/projects\n$ cat notes.txt              # relative: /home/abhi/projects/notes.txt\n$ cat ./notes.txt            # same thing, . = here\n$ cat ../notes.txt           # /home/abhi/notes.txt (one level up)\n$ cat ~/notes.txt            # /home/abhi/notes.txt (home)\n$ cat /etc/hostname          # absolute: same from anywhere',
          output:
            'notes.txt      -> resolved against pwd (/home/abhi/projects/notes.txt)\n../notes.txt   -> parent directory (/home/abhi/notes.txt)\n~/notes.txt    -> home (/home/abhi/notes.txt)\n/etc/hostname  -> absolute, identical no matter your pwd',
          explain:
            'The same name notes.txt means different files depending on the . / .. / ~ prefix and your working directory. Only the absolute /etc/hostname is location-proof.',
        },
        build: {
          simple: 'Absolute paths start with /; relative paths start from where you are.',
          actually:
            'The shell expands ~ to your home before the program ever sees it, and the kernel resolves . and .. while walking the directory tree. A relative path is silently prefixed with your $PWD. Trailing components are resolved left to right, so ../../etc walks up twice then into etc.',
          breaks:
            'A relative path inside a script is resolved against whatever directory the script is invoked from, not where the script file lives. Run it from the wrong place and it reads or writes the wrong file with no error.',
        },
        doThisNow: [
          {
            task: 'Reach the same file three ways: by home shortcut, by absolute path, and by a relative path from /tmp.',
            command: 'echo hi > ~/phase1.txt; cat ~/phase1.txt; cat "$HOME/phase1.txt"; cd /tmp && cat ~/phase1.txt',
            reveal:
              '~ and $HOME both expand to your home directory, so all three cat calls read the same file even though the last one runs from /tmp. The shell resolved ~ before cat saw it.',
          },
          {
            task: 'Watch a relative path change meaning. Make two dirs with same-named files, then cat the relative name from each.',
            command: 'mkdir -p /tmp/a /tmp/b; echo A > /tmp/a/x; echo B > /tmp/b/x; cd /tmp/a && cat x; cd /tmp/b && cat x',
            reveal:
              'The exact same command cat x printed A in /tmp/a and B in /tmp/b. The relative path x resolved against the working directory each time. An absolute /tmp/a/x would always print A.',
          },
        ],
        warStory:
          'A systemd timer ran a relative-path cleanup and worked on the developer machine, where it was always launched from the project folder. In production systemd started it from /, so the relative path matched nothing and the cleanup silently no-opped for weeks until the disk filled. Absolute paths in services are not pedantry; they are reliability.',
        tweak: {
          instruction: 'You are in /home/abhi/projects/app. Write the path to /home/abhi/notes.txt using .. and explain it.',
          reveal:
            '../../notes.txt. From app, .. goes to projects, another .. goes to /home/abhi, then notes.txt. Two levels up, then the file.',
        },
        receipt: {
          explain: [
            'Absolute paths begin at / and are location-independent.',
            'Relative paths resolve against your working directory; ~ is home, . here, .. up.',
          ],
          command: 'cd /tmp && echo "$PWD" && cd ~ && echo "$PWD"',
          question: 'Now that you can address any file, how do you read what is inside one without opening an editor?',
        },
        recap: [
          'Absolute paths start at /; relative paths start from pwd.',
          '~ = home, . = here, .. = parent, / = root.',
          'Relative paths in scripts depend on where the script is run.',
        ],
      },
    },

    {
      id: 'linux-rung-read-files',
      title: 'Module 4: Reading Files (cat, less, head, tail)',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 11,
      prompt: 'You need to read a 2-line config and a 2-gigabyte log. Name the right tool for each and why cat is wrong for one of them.',
      explanation: `Four commands cover almost all file reading: \`cat\` dumps the whole file, \`less\` pages through it, \`head\` shows the start, and \`tail\` shows the end (and can follow a file live).

**cat: dump it all.** \`cat file\` prints the entire file to the screen. Perfect for short files; a mistake for huge ones, which will flood your terminal.

**less: page through it.** \`less file\` opens a scrollable view (arrow keys, /search, q to quit) without loading the whole file into memory. The right tool for large files.

**head and tail: the ends.** \`head file\` shows the first 10 lines, \`tail file\` the last 10. \`tail -f file\` follows the file, printing new lines as they are written, the standard way to watch a live log.`,
      production:
        'tail -f on a service log while you reproduce a bug is one of the most-used debugging moves in operations. And cat on a multi-gigabyte log is one of the most common ways to lock up a terminal session on a server.',
      walkthrough: [
        'Use cat for a short file.',
        'Use less to page a large file and quit with q.',
        'Use head and tail for the ends.',
        'Use tail -f to follow a live log.',
      ],
      questions: [
        'When is cat the wrong choice?',
        'How do you quit less?',
        'What does tail -f do that tail does not?',
      ],
      checklist: [
        'Read a whole short file with cat.',
        'Page a large file with less.',
        'Watch a log live with tail -f.',
      ],
      interactive: {
        coldOpen:
          'You SSH into a struggling production box, type cat application.log to see what is wrong, and the terminal freezes solid: the log is 4 GB and you just asked it to print every byte. The right keystrokes would have shown you the last 20 lines instantly. Reading files well is a survival skill, not a convenience.',
        mental:
          'Match the tool to the size and the question: cat for whole small files, less to scroll big ones, head/tail for the ends, tail -f to watch new lines arrive.',
        diagram: {
          nodes: ['cat: entire file', 'less: scroll a page at a time', 'head: first lines', 'tail: last lines', 'tail -f: follow live'],
          explanations: [
            'Prints the whole file at once; fine when it is small.',
            'Opens a pager you scroll through; safe for huge files.',
            'Shows the beginning (default 10 lines).',
            'Shows the end (default 10 lines).',
            'Keeps printing new lines as they are appended.',
          ],
        },
        example: {
          code: '$ cat hosts.txt\n127.0.0.1 localhost\n10.0.0.5 db\n$ head -n 2 access.log\n10.0.0.5 - - [21/Jun] "GET / HTTP/1.1" 200\n10.0.0.7 - - [21/Jun] "GET /a HTTP/1.1" 404\n$ tail -n 1 access.log\n10.0.0.9 - - [21/Jun] "POST /pay HTTP/1.1" 500\n$ tail -f access.log\n... (prints new lines as requests arrive; Ctrl-C to stop)',
          output:
            'cat        -> the entire (small) file\nhead -n 2  -> first 2 lines\ntail -n 1  -> last 1 line\ntail -f    -> streams new lines until you press Ctrl-C',
          explain:
            'head -n N and tail -n N choose how many lines. tail -f does not exit; it follows the file, which is why it is the go-to for live logs.',
        },
        build: {
          simple: 'cat shows all of it, less scrolls it, head/tail show the ends.',
          actually:
            'less reads the file lazily, so it opens a huge file instantly and never loads it all into memory. tail -f keeps the file open and prints appended bytes as they land. cat is fine to pipe small files into other commands too (cat file | grep x), though many tools can read the file directly.',
          breaks:
            'cat on a multi-gigabyte file floods the terminal and can hang a slow SSH session. tail -f on a log that has been rotated (renamed and recreated) may keep following the old, now-deleted file; tail -F follows the name instead to survive rotation.',
        },
        doThisNow: [
          {
            task: 'Create a small numbered file, then read its start, end, and whole.',
            command: 'seq 1 50 > /tmp/nums.txt; head -n 3 /tmp/nums.txt; tail -n 3 /tmp/nums.txt; wc -l /tmp/nums.txt',
            reveal:
              'head -n 3 prints 1 2 3, tail -n 3 prints 48 49 50, and wc -l confirms 50 lines. You read both ends without dumping the middle.',
          },
          {
            task: 'Watch a file update live. In one terminal follow it; in another, append to it.',
            command: 'tail -f /tmp/live.log   # then in a second terminal: echo "new line" >> /tmp/live.log',
            reveal:
              'The tail -f window prints each new line the instant the second terminal appends it. Press Ctrl-C to stop following. This is exactly how you watch a server log during a bug repro.',
          },
        ],
        warStory:
          'During an incident an engineer ran tail -f on a log to watch errors, fixed the bug, and saw the errors stop, but the log had rotated at midnight and tail was following the old deleted file, so the "errors stopped" was an illusion. Switching to tail -F (follow by name) showed the real, still-erroring new log. Know which file your tool is actually holding.',
        tweak: {
          instruction: 'A colleague keeps cat-ing a 1 GB log to "find the latest errors". Give them a one-line better habit.',
          reveal:
            'Use tail (for example tail -n 100 file, or tail -f file to watch live). It reads only the end you care about instead of streaming the entire gigabyte.',
        },
        receipt: {
          explain: [
            'cat dumps whole files; less pages large ones safely.',
            'head/tail read the ends; tail -f follows a live log.',
          ],
          command: 'tail -n 20 /var/log/system.log 2>/dev/null || tail -n 20 /tmp/nums.txt',
          question: 'You can read files now. How do you create, copy, move, and delete them?',
        },
        recap: [
          'cat for whole small files; less to scroll big ones.',
          'head/tail show the first/last lines.',
          'tail -f follows a file as it grows; tail -F survives rotation.',
        ],
      },
    },

    {
      id: 'linux-rung-manage-files',
      title: 'Module 5: Creating, Copying, Moving, Deleting (mkdir, touch, cp, mv, rm)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Name the commands to make a directory, make an empty file, copy, rename/move, and delete, and explain why rm deserves more respect than the others.',
      explanation: `Five commands shape the filesystem: \`mkdir\` makes directories, \`touch\` makes empty files (or updates timestamps), \`cp\` copies, \`mv\` moves and renames, and \`rm\` deletes.

**mkdir and touch: create.** \`mkdir logs\` makes a directory; \`mkdir -p a/b/c\` makes a whole nested path at once. \`touch file\` creates an empty file if it does not exist, or bumps its modified time if it does.

**cp and mv: copy and move.** \`cp a b\` copies a to b; \`cp -r dir1 dir2\` copies a directory and everything in it. \`mv a b\` moves a to b, which is also how you rename (move to a new name in the same directory).

**rm: delete, and it does not ask.** \`rm file\` removes a file; \`rm -r dir\` removes a directory and all its contents; \`rm -rf dir\` forces it without prompting. There is no recycle bin. Deletion is immediate and usually unrecoverable, so rm is the one command you slow down for.`,
      production:
        'rm -rf with a variable that expands to empty (rm -rf "$DIR"/ where DIR is unset becomes rm -rf /) has caused real production wipes. Quoting variables, checking pwd, and never running rm -rf from a path you have not printed first are habits that prevent disasters.',
      walkthrough: [
        'Create directories with mkdir and mkdir -p.',
        'Create or touch files with touch.',
        'Copy with cp and cp -r.',
        'Move/rename with mv and delete carefully with rm.',
      ],
      questions: [
        'What does mkdir -p do that mkdir does not?',
        'How do you rename a file?',
        'Why is rm more dangerous than cp or mv?',
      ],
      checklist: [
        'Make nested directories in one command.',
        'Copy a directory recursively.',
        'Rename a file and delete one safely.',
      ],
      interactive: {
        coldOpen:
          'There is no trash can on the command line. rm does not move a file aside to be restored later; it unlinks it and the space is free for the next write. The most experienced engineers are the most careful with rm, because they have all watched someone (sometimes themselves) erase the wrong thing in a tenth of a second.',
        mental:
          'mkdir/touch create, cp copies, mv moves and renames, rm deletes permanently. Four are routine; rm is the one you respect.',
        diagram: {
          nodes: ['mkdir / touch: create', 'cp: duplicate', 'mv: move or rename', 'rm: delete (no undo)'],
          explanations: [
            'mkdir makes directories, touch makes empty files.',
            'cp leaves the original and writes a copy.',
            'mv removes the original and recreates it at the destination (also how you rename).',
            'rm unlinks the file; there is no recycle bin.',
          ],
        },
        example: {
          code: '$ mkdir -p site/css\n$ touch site/index.html site/css/main.css\n$ cp site/index.html site/about.html      # copy\n$ mv site/about.html site/contact.html     # rename (move within dir)\n$ ls -R site\nsite:\ncss  contact.html  index.html\nsite/css:\nmain.css\n$ rm site/contact.html                     # gone, no prompt',
          output:
            'mkdir -p   -> makes site/ and site/css/ together\ntouch      -> creates empty files\ncp         -> original + copy both exist\nmv         -> original replaced by new name (rename)\nrm         -> file removed immediately, no confirmation',
          explain:
            'mv is both "move" and "rename": renaming is moving a file to a new name in the same directory. rm gave no warning and no recovery.',
        },
        build: {
          simple: 'mkdir/touch make things, cp copies, mv renames/moves, rm deletes.',
          actually:
            'mv within the same filesystem just relinks the name (instant, even for huge files); across filesystems it copies then deletes. cp -r and rm -r recurse into directories. rm -i prompts before each delete; rm -f forces and silences errors. mkdir -p is idempotent: it succeeds even if the path already exists.',
          breaks:
            'rm -rf $VAR where VAR is empty or unset becomes rm -rf with no target boundary and can walk far more than you intended. Globs expand before rm runs, so rm * in the wrong directory deletes everything there. cp without -r silently skips directories.',
        },
        doThisNow: [
          {
            task: 'Build a small tree, copy a file, rename it, then list the result recursively.',
            command: 'cd /tmp; mkdir -p demo/src; touch demo/src/app.js demo/README; cp demo/README demo/README.bak; mv demo/README demo/README.md; ls -R demo',
            reveal:
              'You get demo/ with src/app.js, README.md (renamed from README), and README.bak (the copy). mkdir -p built two levels at once; mv renamed in place; cp left both files.',
          },
          {
            task: 'Practice safe deletion: use rm -i so it asks before removing, then confirm it is gone.',
            command: 'cd /tmp; rm -i demo/README.bak; ls demo',
            reveal:
              'rm -i prompts y/n before deleting README.bak. After you confirm, ls shows it is gone with no way back. On real systems many people alias rm to rm -i for exactly this safety.',
          },
        ],
        warStory:
          'A widely shared 2011 bug report described a desktop installer that ran rm -rf "$STEAMROOT"/* where, in a rare case, STEAMROOT was empty, so it expanded to rm -rf /* and deleted the user files it could reach. The lesson spread far: always quote variables and never trust an unverified path in front of rm -rf.',
        tweak: {
          instruction: 'Explain why mv bigfile.iso newname.iso is instant even for a 4 GB file, but cp bigfile.iso copy.iso is slow.',
          reveal:
            'Within one filesystem, mv just changes the directory entry pointing at the existing data (no bytes move), so it is instant. cp must read all 4 GB and write a second copy, so it takes real time and disk.',
        },
        receipt: {
          explain: [
            'mkdir -p builds nested dirs; touch makes empty files.',
            'cp -r copies trees, mv renames/moves, rm deletes with no undo.',
          ],
          command: 'cd /tmp && mkdir -p t && touch t/a && cp t/a t/b && ls t && rm -r t',
          question: 'These files now exist, but who is allowed to read, write, or run them? How are permissions decided?',
        },
        recap: [
          'mkdir/touch create; mkdir -p makes nested paths.',
          'cp -r copies trees; mv renames and moves.',
          'rm is permanent: quote variables, verify pwd, prefer rm -i.',
        ],
      },
    },

    {
      id: 'linux-rung-permissions',
      title: 'Module 6: Permissions (rwx, user/group/other, chmod, chown)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt: 'Decode -rwxr-xr-- into who can do what, and name the commands that change permissions and ownership.',
      explanation: `Every file carries permissions: three actions (read, write, execute) for three classes of people (the owning user, the owning group, everyone else). \`chmod\` changes the permission bits; \`chown\` changes who owns the file.

**Read the ten characters.** In \`-rwxr-xr--\`, the first character is the type (\`-\` file, \`d\` directory). The next nine are three groups of rwx: owner (rwx), group (r-x), other (r--). A dash means that action is not allowed for that class.

**rwx means different things for files and directories.** On a file: read its contents, write/change it, execute it as a program. On a directory: read means list names, write means create/delete entries inside, execute means enter (cd into) it.

**chmod with octal.** Each rwx group is a number: r=4, w=2, x=1, summed. So rwx=7, r-x=5, r--=4, giving \`chmod 754 file\`. \`chmod 755\` (rwx for owner, r-x for everyone) is the standard for scripts and directories; \`chmod 644\` (rw for owner, r for others) is standard for plain files.

**chown changes ownership.** \`chown alice file\` makes alice the owner; \`chown alice:devs file\` sets owner and group. Changing ownership usually needs sudo.`,
      production:
        'Two of the most common deploy failures are a script that will not run ("Permission denied" because it lacks the execute bit, fixed with chmod +x) and a web server that cannot read its files (wrong owner or group, fixed with chown). Permissions are not academic; they are most of "why will this not run on the server".',
      walkthrough: [
        'Split the ten-character string into type + three rwx groups.',
        'Explain rwx for files vs directories.',
        'Convert rwx groups to octal and back.',
        'Use chmod and chown to change bits and ownership.',
      ],
      questions: [
        'What do the three rwx groups correspond to?',
        'What does the execute bit mean on a directory?',
        'What octal is rwxr-xr-x?',
      ],
      checklist: [
        'Decode a permission string.',
        'Convert between rwx and octal.',
        'Use chmod +x and chmod 644; explain chown.',
      ],
      interactive: {
        coldOpen:
          'You write a perfect deploy script, copy it to the server, run it, and get one line back: "Permission denied". The script is fine. The problem is a single missing bit, the execute bit, that tells the kernel this file is allowed to run. One chmod fixes it. Permissions are the gate every file on a multi-user system sits behind.',
        mental:
          'Three actions (read, write, execute) for three classes (owner, group, other). Read the ten characters left to right; chmod changes the bits, chown changes the owner.',
        diagram: {
          nodes: ['- (type)', 'rwx (owner)', 'r-x (group)', 'r-- (other)'],
          explanations: [
            'First char: - for file, d for directory.',
            'What the owning user may do: here read, write, execute.',
            'What the owning group may do: here read and execute, not write.',
            'What everyone else may do: here read only.',
          ],
        },
        example: {
          code: '$ ls -l deploy.sh data.csv\n-rw-r--r--  1 abhi staff  812 Jun 21 deploy.sh\n-rw-r--r--  1 abhi staff  4096 Jun 21 data.csv\n$ ./deploy.sh\nbash: ./deploy.sh: Permission denied\n$ chmod +x deploy.sh           # add execute\n$ ls -l deploy.sh\n-rwxr-xr-x  1 abhi staff  812 Jun 21 deploy.sh\n$ ./deploy.sh\n(running...)',
          output:
            '-rw-r--r--  = 644: owner read/write, group/other read\nPermission denied = no execute bit, so it cannot run\nchmod +x    -> adds execute for all classes\n-rwxr-xr-x  = 755: owner rwx, group/other r-x',
          explain:
            'The file was readable but not executable, so running it failed. chmod +x added the execute bit and ls -l shows it flip from 644 to 755.',
        },
        build: {
          simple: 'rwx for owner/group/other; chmod sets the bits, chown sets the owner.',
          actually:
            'chmod takes symbolic (chmod u+x, chmod g-w, chmod o=r) or octal (chmod 644) forms. Octal sums r=4, w=2, x=1 per class. On directories, execute is "may enter", so a directory with read but not execute lets you see names but not cd in or read the files. umask controls the default bits new files get.',
          breaks:
            'chmod 777 (everyone can do everything) is a frequent insecure "fix" that opens files to all users on the box and is flagged by every audit. Removing execute from a directory (chmod -x dir) can lock you out of files inside it even if their own permissions are fine.',
        },
        doThisNow: [
          {
            task: 'Make a script, watch it fail without the execute bit, then add it and watch it run.',
            command: 'cd /tmp; printf "#!/bin/sh\\necho it ran\\n" > hi.sh; ./hi.sh; chmod +x hi.sh; ./hi.sh; ls -l hi.sh',
            reveal:
              'The first ./hi.sh fails with Permission denied (no x bit). After chmod +x, it prints "it ran" and ls -l shows -rwxr-xr-x. You toggled one bit and changed whether the kernel will execute the file.',
          },
          {
            task: 'Convert by hand, then verify: set a file to owner rw, group r, other none, and read back the string.',
            command: 'cd /tmp; touch secret.txt; chmod 640 secret.txt; ls -l secret.txt',
            reveal:
              'chmod 640 produces -rw-r-----: owner rw (6), group r (4), other nothing (0). You computed the octal from the rwx you wanted and ls -l confirms it.',
          },
        ],
        warStory:
          'A team could not figure out why their web app returned blank pages until they noticed the deploy had copied files owned by root into a directory the web server user could not read. No error in the app logs, just empty responses. One chown -R www-data:www-data on the directory fixed it. Half of "works locally, breaks on the server" is ownership and permissions.',
        tweak: {
          instruction: 'A teammate "fixed" a permissions problem with chmod 777. Explain the risk in one sentence and give the usual correct value for a script.',
          reveal:
            'chmod 777 lets every user on the machine read, modify, and run the file, a security hole; a script normally wants chmod 755 (owner full, others read and execute).',
        },
        receipt: {
          explain: [
            'Ten chars = type + rwx for owner, group, other.',
            'chmod sets bits (755/644 or +x); chown sets ownership.',
          ],
          command: 'cd /tmp && touch p.txt && chmod 600 p.txt && ls -l p.txt',
          question: 'Commands so far each did one job. How do you connect them so one command feeds the next?',
        },
        recap: [
          'Permissions = read/write/execute for owner/group/other.',
          'Octal: r=4, w=2, x=1; 755 for scripts, 644 for files.',
          'chmod changes bits; chown changes owner (often needs sudo).',
        ],
      },
    },

    {
      id: 'linux-rung-pipes-redirection',
      title: 'Module 7: Pipes and Redirection (|, >, >>, <, stdin/stdout/stderr)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt: 'Explain the difference between a pipe and a redirect, and what stdout and stderr are.',
      explanation: `Every program has three default streams: standard input (stdin), standard output (stdout), and standard error (stderr). Pipes and redirects rewire where those streams go, which is the source of the command line's power.

**The three streams.** A program reads from stdin (by default your keyboard), writes normal results to stdout (by default your screen), and writes errors to stderr (also the screen, but a separate channel). They are numbered 0, 1, and 2.

**Redirection sends a stream to a file.** \`cmd > out.txt\` sends stdout to a file (overwriting it); \`cmd >> out.txt\` appends instead; \`cmd < in.txt\` feeds a file in as stdin; \`cmd 2> err.txt\` captures stderr separately.

**Pipes connect programs.** \`cmd1 | cmd2\` sends cmd1's stdout straight into cmd2's stdin, with no temp file. Chaining small programs this way (\`cat log | grep ERROR | wc -l\`) is the Unix philosophy: each tool does one thing, and you compose them.`,
      production:
        'Logging and observability are built on these streams: services write logs to stdout/stderr and the platform redirects them to files or aggregators. "Why is nothing in my log file" is often "the errors went to stderr and you only captured stdout".',
      walkthrough: [
        'Name the three streams and their numbers.',
        'Use > and >> to write and append stdout.',
        'Use 2> to capture stderr separately.',
        'Chain programs with | into a pipeline.',
      ],
      questions: [
        'What is the difference between stdout and stderr?',
        'How is > different from >>?',
        'What does a pipe connect?',
      ],
      checklist: [
        'Redirect stdout to a file (overwrite and append).',
        'Separate stderr from stdout.',
        'Build a three-stage pipeline.',
      ],
      interactive: {
        coldOpen:
          'You run a command, redirect its output to a file with > result.txt, open the file, and the error you saw on screen is not there. It did not vanish: errors travel on a separate channel (stderr) that > never touched. Once you can see the three streams, you can route any program output anywhere, and most of the shell’s power opens up.',
        mental:
          'Programs read stdin, write stdout (results) and stderr (errors). Redirects (> >> < 2>) point a stream at a file; a pipe (|) points one program’s stdout into the next program’s stdin.',
        diagram: {
          nodes: ['stdin (0): input', 'program', 'stdout (1): results', 'stderr (2): errors', '| pipe to next program'],
          explanations: [
            'Where the program reads from (keyboard, file, or a pipe).',
            'The running command.',
            'Normal output; > and >> redirect this.',
            'Error output; a separate channel, redirected with 2>.',
            'A pipe wires stdout into the next program’s stdin.',
          ],
        },
        example: {
          code: '$ ls /etc /nope > out.txt 2> err.txt\n$ cat out.txt\n/etc:\nhosts\npasswd\n$ cat err.txt\nls: /nope: No such file or directory\n$ echo one > log; echo two >> log; cat log\none\ntwo\n$ cat log | grep two | wc -l\n1',
          output:
            '> out.txt   -> stdout (the /etc listing) into a file\n2> err.txt  -> stderr (the /nope error) into a separate file\n>           -> overwrite; >> -> append\n|           -> cat -> grep -> wc, each feeding the next',
          explain:
            'One command produced both normal output and an error; > and 2> sent them to different files. The pipeline counted matching lines by composing three tiny tools.',
        },
        build: {
          simple: '> writes a file, >> appends, | connects two programs.',
          actually:
            'Streams are file descriptors: 0 stdin, 1 stdout, 2 stderr. cmd > f is shorthand for cmd 1> f. To merge stderr into stdout use 2>&1 (for example cmd > all.txt 2>&1). A pipe runs both programs at once and streams data between them, so cmd1 | cmd2 needs no temp file and starts producing output immediately.',
          breaks:
            'cmd > out.txt 2>&1 and cmd 2>&1 > out.txt are not the same: order matters, because 2>&1 copies wherever stdout points at that moment. > truncates the file the instant the command starts, so cmd > file where file is also the input can erase your data before it is read. And errors slip past a plain > because they ride stderr.',
        },
        doThisNow: [
          {
            task: 'Split a command’s normal output from its errors into two files, then read both.',
            command: 'cd /tmp; ls . /does-not-exist > out.txt 2> err.txt; echo "--- OUT ---"; cat out.txt; echo "--- ERR ---"; cat err.txt',
            reveal:
              'out.txt holds the listing of . (stdout); err.txt holds "No such file or directory" (stderr). The same command fed two separate channels, and you routed each one independently.',
          },
          {
            task: 'Build a pipeline that counts how many processes you are running, without writing any temp file.',
            command: 'ps -e | wc -l',
            reveal:
              'ps -e lists every process on stdout; the pipe feeds that straight into wc -l, which counts the lines. Two small tools composed into an answer, with no intermediate file. Add more stages (| grep something) to filter first.',
          },
        ],
        warStory:
          'A cron job redirected only stdout to a log (job >> job.log) and "ran clean" for months. When it finally started failing, the errors went to stderr, which cron emailed to an unread mailbox, so the log looked healthy while the job silently broke. The fix was 2>&1 to capture both streams in one place. Capture stderr or you are blind to failures.',
        tweak: {
          instruction: 'Explain why command > file 2>&1 captures everything but command 2>&1 > file does not.',
          reveal:
            '2>&1 means "send stderr to wherever stdout currently points". In the first, stdout is already the file, so stderr follows it into the file. In the second, stderr is pointed at the screen (stdout’s original target) before > moves stdout to the file, so errors still go to the screen.',
        },
        receipt: {
          explain: [
            'Programs use stdin (0), stdout (1), stderr (2).',
            '> overwrites, >> appends, 2> captures errors, | chains programs.',
          ],
          command: 'echo hi | tr a-z A-Z',
          question: 'Pipelines often start by filtering for matching lines. What tool searches text, and how far can it go?',
        },
        recap: [
          'Three streams: stdin, stdout, stderr (0, 1, 2).',
          '> overwrite, >> append, < input, 2> errors, 2>&1 merge.',
          'A pipe wires one program’s stdout into the next’s stdin.',
        ],
      },
    },

    {
      id: 'linux-rung-grep',
      title: 'Module 8: Searching Text (grep)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain what grep does and three flags that turn it from a toy into a daily tool.',
      explanation: `grep searches text for lines that match a pattern and prints those lines. It is the single most-used search tool on the command line, whether you point it at files or pipe text into it.

**The basic shape.** \`grep PATTERN file\` prints every line in the file containing PATTERN. \`grep ERROR app.log\` shows just the error lines. Pipe into it to filter any command's output: \`ps -e | grep node\`.

**The flags that matter.** \`-i\` ignores case (ERROR matches error). \`-r\` searches a whole directory tree recursively. \`-n\` prints line numbers. \`-v\` inverts the match (lines that do not contain the pattern). \`-c\` counts matches instead of printing them.

**Patterns are regular expressions.** The pattern is not just literal text; it is a regex. \`grep "^ERROR"\` matches lines starting with ERROR, \`grep "5[0-9][0-9]"\` matches a 5xx status code. You can start with plain words and grow into regex as needed.`,
      production:
        'grep -rin "TODO" src/ to audit a codebase, journalctl | grep -i error to scan logs, ps -e | grep myservice to check a process: grep is in a working engineer’s hands dozens of times a day. Fluency here pays back immediately.',
      walkthrough: [
        'Match lines in a file with grep PATTERN file.',
        'Filter piped output with | grep.',
        'Apply -i, -r, -n, -v, -c.',
        'Use a simple regex anchor like ^.',
      ],
      questions: [
        'What does grep print?',
        'What do -i and -r do?',
        'How do you show lines that do NOT match?',
      ],
      checklist: [
        'Search a file and piped input.',
        'Use -i, -n, and -r.',
        'Invert and count matches.',
      ],
      interactive: {
        coldOpen:
          'A 200,000-line log, a production incident, and the clock running. You do not scroll. You type grep -i -n "timeout" app.log and the screen fills with exactly the lines that matter, each tagged with its line number. grep turns "somewhere in this haystack" into an instant answer, which is why it is reached for more than almost any other command.',
        mental:
          'grep prints the lines that match a pattern. Point it at files or pipe text into it, and a few flags (-i, -r, -n, -v, -c) cover most real searches.',
        diagram: {
          nodes: ['Input text (file or pipe)', 'grep PATTERN', 'Matching lines kept', 'Non-matching lines dropped'],
          explanations: [
            'A file argument or text piped in from another command.',
            'grep tests each line against the pattern (a regex).',
            'Lines that contain a match are printed.',
            'Everything else is discarded (unless you use -v to invert).',
          ],
        },
        example: {
          code: '$ cat app.log\n2026-06-21 INFO  started\n2026-06-21 ERROR db timeout\n2026-06-21 error retrying\n2026-06-21 INFO  ok\n$ grep ERROR app.log\n2026-06-21 ERROR db timeout\n$ grep -in error app.log\n2:2026-06-21 ERROR db timeout\n3:2026-06-21 error retrying\n$ grep -c -i error app.log\n2',
          output:
            'grep ERROR     -> case-sensitive: only the uppercase line\ngrep -in error -> -i case-insensitive (both), -n line numbers\ngrep -c        -> counts matches (2) instead of printing them',
          explain:
            'Plain grep ERROR missed the lowercase "error" line; -i caught both, -n tagged line numbers, and -c returned the count. Same pattern, very different output per flag.',
        },
        build: {
          simple: 'grep prints lines that contain your pattern.',
          actually:
            'The pattern is a regular expression: ^ anchors the start, $ the end, [0-9] a digit class, . any character. grep -E enables extended regex (a|b, +, ?). grep -r walks directories; grep -l prints only the names of files that match; grep -o prints just the matched text, not the whole line.',
          breaks:
            'Unquoted patterns with spaces or shell characters (*, ?, $) get mangled by the shell before grep sees them, so always quote the pattern. Regex metacharacters bite: grep "1.5" also matches 1x5 because . means any char; use grep -F (fixed strings) or escape the dot when you mean a literal.',
        },
        doThisNow: [
          {
            task: 'Make a tiny log and pull only the error lines, case-insensitively, with line numbers.',
            command: 'printf "INFO start\\nERROR boom\\nerror again\\nINFO done\\n" > /tmp/a.log; grep -in error /tmp/a.log',
            reveal:
              'You get 2:ERROR boom and 3:error again. -i matched both cases, -n prefixed the line numbers. Without -i you would have missed the lowercase line.',
          },
          {
            task: 'Filter a live command instead of a file: list processes, keep only ones mentioning your shell.',
            command: 'ps -e | grep -i sh',
            reveal:
              'grep filtered the piped process list down to lines containing "sh" (zsh, bash, sh, and anything else matching). This pattern, command | grep something, is how you search any program’s output.',
          },
        ],
        warStory:
          'An engineer grepped a log for "1.0.0" to confirm a release and saw matches, so they declared success, but . in a regex matches any character, so "1x0y0" and timestamps also matched and the real version was still old. grep -F "1.0.0" (literal) told the truth. Knowing the pattern is a regex prevents false confidence.',
        tweak: {
          instruction: 'You want every line that is NOT a comment (does not start with #) in a config. Write the grep.',
          reveal:
            'grep -v "^#" config. -v inverts to keep non-matching lines, and ^# matches lines beginning with #, so you get everything that is not a comment line.',
        },
        receipt: {
          explain: [
            'grep prints lines matching a pattern, from files or pipes.',
            '-i ignore case, -r recurse, -n line numbers, -v invert, -c count.',
          ],
          command: 'ps -e | grep -ic .',
          question: 'grep finds matching lines inside files. How do you find the files themselves by name, size, or age?',
        },
        recap: [
          'grep prints lines that match a (regex) pattern.',
          '-i, -r, -n, -v, -c cover most daily searches.',
          'Quote patterns; remember . and * are regex, not literal.',
        ],
      },
    },

    {
      id: 'linux-rung-find',
      title: 'Module 9: Finding Files (find)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain how find differs from grep, and how to find files by name, by size, and then act on them.',
      explanation: `find walks a directory tree and returns paths matching tests you give it: by name, type, size, age, and more. Where grep searches inside files for matching lines, find searches the filesystem for matching files.

**The shape: where, then what.** \`find PATH TESTS\`. \`find . -name "*.log"\` searches from the current directory down for files named with a .log extension. The first argument is where to start; the rest are filters.

**Common tests.** \`-name "*.js"\` matches by name (quote it so the shell does not expand the *). \`-type f\` restricts to files, \`-type d\` to directories. \`-size +10M\` matches files larger than 10 megabytes. \`-mtime -1\` matches files modified in the last day.

**Acting on results.** \`find . -name "*.tmp" -delete\` deletes matches. \`find . -name "*.log" -exec gzip {} \\;\` runs a command on each match, where \`{}\` is the file. find is how you do bulk operations across a tree safely and precisely.`,
      production:
        'find . -name "*.log" -mtime +30 -delete to clean old logs, find / -size +1G to hunt what filled a disk, find . -name "*.test.ts" to locate tests: find is the tool for "do something to every file matching these criteria", which is a daily operations need.',
      walkthrough: [
        'State find searches the filesystem, grep searches contents.',
        'Find by name and type.',
        'Find by size and modification time.',
        'Act on matches with -delete or -exec.',
      ],
      questions: [
        'How is find different from grep?',
        'Why must you quote the pattern in -name "*.log"?',
        'How do you run a command on every match?',
      ],
      checklist: [
        'Find files by name and type.',
        'Find by size and age.',
        'Act on matches with -exec or -delete.',
      ],
      interactive: {
        coldOpen:
          'The disk is 98% full and climbing, and "something" is writing huge files somewhere in a tree with thousands of directories. You do not open folders one by one. One line, find / -type f -size +500M, and the offenders print themselves, full paths and all. find is how you ask the filesystem a precise question and get every answer.',
        mental:
          'grep looks inside files for matching lines; find looks across the tree for matching files. You give it a starting path and tests (name, type, size, age), and optionally an action.',
        diagram: {
          nodes: ['find PATH', 'tests: -name -type -size -mtime', 'matching paths', 'action: print / -delete / -exec'],
          explanations: [
            'Where to start walking the directory tree.',
            'Filters each file must pass to match.',
            'The full paths of everything that matched.',
            'What to do with them: print (default), delete, or run a command.',
          ],
        },
        example: {
          code: '$ find . -type f -name "*.log"\n./app.log\n./logs/2026/june.log\n$ find . -type f -size +1M\n./logs/2026/june.log\n$ find . -name "*.tmp" -delete\n$ find . -type f -name "*.log" -exec wc -l {} \\;\n  42 ./app.log\n 9183 ./logs/2026/june.log',
          output:
            '-type f -name "*.log" -> files ending in .log, anywhere below .\n-size +1M             -> files larger than 1 megabyte\n-delete               -> removes each match (careful!)\n-exec wc -l {} \\;      -> runs wc -l on each match ({} = the file)',
          explain:
            'find returned full paths from a whole subtree. -exec ran a command per match, substituting {} with each file. -delete acts directly, with no confirmation, so test with a plain find first.',
        },
        build: {
          simple: 'find lists files matching tests; -exec or -delete acts on them.',
          actually:
            'Tests combine: find . -type f -name "*.log" -size +1M -mtime +7 means files, named *.log, over 1MB, older than 7 days, all at once. Sizes use +/- and units (k, M, G). Times: -mtime -1 is within a day, +30 is older than 30 days. -exec ... {} \\; runs once per file; -exec ... {} + batches many files into fewer command runs.',
          breaks:
            'An unquoted -name *.log lets the shell expand *.log against the current directory before find runs, so it behaves unpredictably; always quote it. -delete is irreversible and evaluated with the other tests, so a too-broad set of tests deletes too much. Always run the find without -delete first to see exactly what would go.',
        },
        doThisNow: [
          {
            task: 'Build a small tree, then find only the .txt files in it by name and type.',
            command: 'cd /tmp; mkdir -p tree/a tree/b; touch tree/a/one.txt tree/b/two.txt tree/b/skip.md; find tree -type f -name "*.txt"',
            reveal:
              'You get tree/a/one.txt and tree/b/two.txt, but not skip.md. find walked the whole tree and returned full paths for just the files matching both tests.',
          },
          {
            task: 'Preview-then-act safely: list matches first, then run a command on each with -exec.',
            command: 'cd /tmp; find tree -type f -name "*.txt"; echo "--- now count lines in each ---"; find tree -type f -name "*.txt" -exec wc -l {} \\;',
            reveal:
              'The first find shows exactly which files would be touched; the second runs wc -l on each via -exec, with {} standing in for each path. This preview-first habit is how you use -delete or -exec without regret.',
          },
        ],
        warStory:
          'A cleanup ran find . -name "*.bak" -delete from what the author thought was the project directory but was actually the home directory, and quietly deleted backup files across many projects. Running the same find without -delete first would have shown the surprising list before anything was lost. With find, look before you act.',
        tweak: {
          instruction: 'Write a find that lists files over 100 MB anywhere under /var, files only, to hunt a full disk.',
          reveal:
            'find /var -type f -size +100M. Start at /var, restrict to files (-type f), keep only those larger than 100 megabytes (-size +100M). Add -exec ls -lh {} + to see human-readable sizes.',
        },
        receipt: {
          explain: [
            'find walks the tree for files matching name, type, size, age.',
            '-exec cmd {} \\; runs a command per match; -delete removes them.',
          ],
          command: 'find /tmp -maxdepth 1 -type f -name "*.txt"',
          question: 'You can now navigate, read, manage, permission, pipe, and search. What lives in the encyclopedia for each command you have met?',
        },
        recap: [
          'find searches the filesystem; grep searches file contents.',
          'Filter by -name, -type, -size, -mtime; quote -name patterns.',
          'Preview before -delete or -exec; {} is each matched path.',
        ],
      },
    },

    {
      id: 'linux-rung-system-info',
      title: 'Module 10: Knowing The Box (uname, uptime, hostname, df, free)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 11,
      prompt: 'You SSH into an unfamiliar server. Name the commands that tell you what it is, how long it has been up, and whether it is out of disk or memory.',
      explanation: `Before you change anything on a machine, you find out what it is and how healthy it is. A handful of commands answer that: \`uname\` (what kind of system), \`uptime\` (how long up and how loaded), \`hostname\` (its name), \`df\` (disk), and \`free\` (memory).

**Identity.** \`uname -a\` prints the kernel, architecture, and OS in one line. \`uname -r\` is just the kernel release. \`hostname\` prints the machine name; \`whoami\` prints which user you are; \`date\` prints the clock.

**Load and uptime.** \`uptime\` shows how long the machine has run and the load average (roughly, how many processes are competing for CPU over the last 1, 5, and 15 minutes). A load far above the CPU count means the box is saturated.

**Resources.** \`df -h\` shows disk space per mounted filesystem in human units; a filesystem at 100% is a common outage cause. \`free -m\` shows memory used and available in megabytes. These two are the first things you check when a server "feels slow".`,
      production:
        'The first five minutes on a sick server are almost always uname/uptime/df -h/free -m: confirm what it is, whether the disk is full, and whether it is out of memory. A surprising share of incidents are simply "disk at 100%".',
      walkthrough: [
        'Identify the system with uname -a and hostname.',
        'Read uptime and the load average.',
        'Check disk with df -h and memory with free -m.',
        'Spot a full filesystem or saturated load.',
      ],
      questions: [
        'What does uname -r tell you?',
        'What is the load average roughly measuring?',
        'Which command shows a filesystem that is 100% full?',
      ],
      checklist: [
        'Print kernel, hostname, and uptime.',
        'Read disk usage per filesystem.',
        'Read free and used memory.',
      ],
      interactive: {
        coldOpen:
          'A pager goes off: "API down". You SSH in, and before touching the app you type four commands. df -h shows / at 100%. That is the whole incident: the disk filled with logs and the database could not write. You did not read a line of application code; you read the box. Knowing the machine is faster than guessing at the app.',
        mental:
          'Before changing a server, characterize it: what it is (uname, hostname), how loaded (uptime), and whether it has disk and memory left (df -h, free -m).',
        diagram: {
          nodes: ['uname / hostname: what', 'uptime: how long + load', 'df -h: disk', 'free -m: memory'],
          explanations: [
            'Kernel, architecture, OS, and machine name.',
            'How long it has run and how many processes compete for CPU.',
            'Space used and free per mounted filesystem.',
            'Memory used and available, in megabytes.',
          ],
        },
        example: {
          code: '$ uname -r\n6.8.0-40-generic\n$ uptime\n 14:22:01 up 37 days,  3:11,  2 users,  load average: 0.42, 0.55, 0.60\n$ df -h\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/root        49G   47G  1.8G  97% /\n$ free -m\n               total        used        free\nMem:            7976        6210         420',
          output:
            'uname -r  -> kernel release\nuptime    -> 37 days up, load ~0.5 (healthy on a multi-core box)\ndf -h     -> / is 97% full (warning sign)\nfree -m   -> ~420 MB free of ~8 GB',
          explain:
            'In seconds you learned the kernel, that it has been stable for 37 days, that the root filesystem is nearly full (the thing to fix), and that memory is tight but not gone.',
        },
        build: {
          simple: 'uname says what, uptime says how loaded, df/free say how full.',
          actually:
            'Load average counts processes running or waiting (including for disk), so compare it to your core count: 1.0 on 1 core is busy, 1.0 on 8 cores is idle. df -h reports per-filesystem, so a full / can coexist with an empty /data. free shows "available" (what apps can still use including reclaimable cache), which matters more than raw "free".',
          breaks:
            'Reading df total instead of per-mount hides that one filesystem is full while others are empty. Reading free "free" instead of "available" makes a healthy box look starved, because Linux uses spare RAM as disk cache on purpose. A full disk often shows up first as weird, unrelated errors (cannot write, cannot log).',
        },
        doThisNow: [
          {
            task: 'Characterize your own machine in one shot: identity, uptime, disk, memory.',
            command: 'uname -a; uptime; df -h; free -m 2>/dev/null || vm_stat',
            reveal:
              'You get the kernel/OS line, how long the machine has been up with its load average, disk usage per filesystem, and memory. On macOS free does not exist, so vm_stat is the fallback; the concepts map across.',
          },
          {
            task: 'Find which mounted filesystem has the least room left.',
            command: 'df -h | sort -k5 -n',
            reveal:
              'df -h lists each filesystem with a Use% column; sorting brings the fullest to the bottom (or top). On a real server this is how you spot the one mount that is about to cause an outage.',
          },
        ],
        warStory:
          'A service started returning 500s with no code change. The app logs were empty, which was itself the clue: the disk was 100% full, so the app could not even write its own error logs. df -h showed it in two seconds; rotating old logs freed space and the 500s stopped. Check the box before you debug the app.',
        tweak: {
          instruction: 'A teammate says "load average is 3, the server is dying". What one fact do you need before agreeing?',
          reveal:
            'The core count. Load 3 on a 1-core box is overloaded, but on an 8-core box it is comfortable. nproc (or uptime next to the core count) gives the context that makes load average meaningful.',
        },
        receipt: {
          explain: [
            'uname/hostname identify the box; uptime shows load over 1/5/15 min.',
            'df -h finds a full filesystem; free -m shows real available memory.',
          ],
          command: 'uname -a; uptime; df -h',
          question: 'You know the machine. Who is logged into it, and how do you become a user with the rights to fix things?',
        },
        recap: [
          'uname/hostname/date identify the system and clock.',
          'uptime load average is meaningful only against the core count.',
          'df -h finds full disks; free -m shows available memory.',
        ],
      },
    },

    {
      id: 'linux-rung-users',
      title: 'Module 11: Users, Groups, and sudo',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain the difference between a regular user and root, and what sudo actually does.',
      explanation: `Linux is multi-user from the ground up. Every process runs as some user, every file is owned by some user and group, and one special user, root, can do anything. \`id\`, \`who\`, and \`whoami\` tell you who is who; \`sudo\` lets a permitted user run one command as root.

**Who am I, who is here.** \`whoami\` prints your username, \`id\` prints your user id, group id, and group memberships, and \`who\` (or \`w\`) lists who is currently logged in.

**root is the superuser.** User id 0, allowed to read, write, and kill anything. You rarely log in as root directly; instead you run individual commands with \`sudo\`, which checks a permission file (sudoers) and runs that one command as root, leaving an audit trail.

**Users and groups.** \`sudo adduser sam\` (or \`useradd\`) creates a user; \`groupadd devs\` creates a group; \`usermod -aG devs sam\` adds sam to the devs group. Group membership is how several users share access to the same files via the group permission bits.`,
      production:
        'Production access is built on this: services run as their own low-privilege users (never root), deploys use a dedicated user in the right group, and sudo gives humans temporary elevation with a log. "Run everything as root" is how a small mistake becomes a total compromise.',
      walkthrough: [
        'Print your identity with whoami and id.',
        'List logged-in users with who.',
        'Explain root (uid 0) and least privilege.',
        'Use sudo to run one command as root; add a user to a group.',
      ],
      questions: [
        'What does id show that whoami does not?',
        'What does sudo do, and why is it safer than logging in as root?',
        'How do you give a user access to a group resource?',
      ],
      checklist: [
        'Read your user, group, and memberships.',
        'Explain root and least privilege.',
        'Use sudo and add a user to a group.',
      ],
      interactive: {
        coldOpen:
          'You try to edit a system config and get "Permission denied". You are not root, and that is the system protecting itself. One word in front of your command, sudo, checks whether you are allowed, runs that single command with full power, and logs it. The whole multi-user security model lives in that gap between "you" and "root".',
        mental:
          'Every process runs as a user; root (uid 0) can do anything; sudo lets a permitted user borrow root for one command, with a log.',
        diagram: {
          nodes: ['regular user', 'sudo (check sudoers)', 'runs as root (uid 0)', 'logged for audit'],
          explanations: [
            'Your normal, limited account: cannot touch system files.',
            'sudo checks whether you are permitted to elevate.',
            'The single command runs with full privileges.',
            'The elevation is recorded, so there is a trail.',
          ],
        },
        example: {
          code: '$ whoami\nabhi\n$ id\nuid=1000(abhi) gid=1000(abhi) groups=1000(abhi),27(sudo),998(docker)\n$ cat /etc/shadow\ncat: /etc/shadow: Permission denied\n$ sudo cat /etc/shadow\n[sudo] password for abhi:\nroot:!:19700:0:99999:7:::',
          output:
            'whoami  -> your username\nid      -> uid, gid, and every group you belong to (sudo, docker...)\ncat     -> denied: a normal user cannot read the password hashes\nsudo    -> after your password, the command runs as root and succeeds',
          explain:
            'The same cat failed as you and succeeded under sudo. id showed you are in the sudo group, which is what permits the elevation in the first place.',
        },
        build: {
          simple: 'root can do anything; sudo runs one command as root.',
          actually:
            'Permission to use sudo comes from membership in a group (sudo on Debian/Ubuntu, wheel on RHEL) and the /etc/sudoers policy. sudo asks for your own password, not root password, caches it briefly, and logs every use. Files are shared between users through groups: chgrp/chmod g+rw plus usermod -aG put several people on the same files.',
          breaks:
            'Adding a user to a group with usermod does not affect their already-open sessions; they must log out and back in to pick up new group membership. Running a service as root "to avoid permission issues" turns any bug in that service into full machine compromise. sudo su - drops you into a root shell where nothing is logged per-command, which defeats the audit trail.',
        },
        doThisNow: [
          {
            task: 'Read your full identity: user, primary group, and every group you belong to.',
            command: 'whoami; id; groups',
            reveal:
              'whoami is just the name; id shows uid, gid, and all group memberships (look for sudo or wheel, which grant elevation); groups lists the group names. These memberships are what decide which shared files you can touch.',
          },
          {
            task: 'See who is logged in and what they are doing, then prove a privileged file is off-limits without sudo.',
            command: 'who; w; head -n1 /etc/shadow 2>&1 || true',
            reveal:
              'who/w list current sessions. Reading /etc/shadow (the password hashes) fails with Permission denied as a normal user. With sudo head -n1 /etc/shadow it would succeed, which is exactly the elevation sudo provides, only for users the policy allows.',
          },
        ],
        warStory:
          'A deploy script ran the application as root "to avoid permission errors". Months later a dependency had a remote-code-execution bug; because the process was root, the attacker owned the entire host instead of one sandboxed app user. The fix was a one-line systemd User= directive. Least privilege is not bureaucracy; it is blast-radius control.',
        tweak: {
          instruction: 'You added alice to the deploy group but she still cannot write the shared files in her current session. Why, and what fixes it?',
          reveal:
            'Group membership changes do not apply to already-open sessions. Alice must log out and back in (or start a fresh login shell) so her new deploy group membership takes effect.',
        },
        receipt: {
          explain: [
            'Every process runs as a user; root (uid 0) is unrestricted.',
            'sudo runs one command as root with your password and a log; groups share access.',
          ],
          command: 'id; who',
          question: 'Those logged-in users are running programs. How do you see every running process and stop a misbehaving one?',
        },
        recap: [
          'whoami/id/who answer who you are and who is here.',
          'root is uid 0; sudo elevates one command with an audit trail.',
          'Groups share file access; membership applies on next login.',
        ],
      },
    },

    {
      id: 'linux-rung-processes',
      title: 'Module 12: Processes, Jobs, and Signals (ps, top, kill)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt: 'A process is eating all the CPU. Name how you find it, how you stop it politely, and how you force it if it ignores you.',
      explanation: `Every running program is a process with a numeric process id (PID). You list them with \`ps\` and \`top\`, and you stop them by sending signals with \`kill\`.

**Seeing processes.** \`ps aux\` lists every process with its user, PID, CPU, and memory. \`ps aux | grep node\` filters to the ones you care about. \`top\` (or \`htop\`) is a live, sorted view that updates every second, the fastest way to spot what is burning CPU or memory.

**Stopping processes with signals.** \`kill PID\` sends SIGTERM (15), a polite "please shut down" the program can catch to clean up. \`kill -9 PID\` sends SIGKILL, which the kernel enforces immediately and the program cannot catch, used only when SIGTERM is ignored. \`pkill name\` and \`killall name\` signal by name instead of PID.

**Jobs in your shell.** A long command can run in the background with \`&\`; \`Ctrl-Z\` suspends the foreground job, \`bg\` resumes it in the background, \`fg\` brings it back, and \`jobs\` lists them. \`nice\`/\`renice\` change a process's CPU priority.`,
      production:
        'Graceful shutdown depends on this: orchestrators send SIGTERM and give a process a few seconds to finish in-flight work before SIGKILL. A service that ignores SIGTERM (or a kill -9 habit) drops requests and corrupts state on every deploy.',
      walkthrough: [
        'List processes with ps aux and filter with grep.',
        'Watch live load with top.',
        'Send SIGTERM with kill, then SIGKILL with kill -9 only if needed.',
        'Manage shell jobs with &, Ctrl-Z, bg, fg, jobs.',
      ],
      questions: [
        'What is a PID?',
        'What is the difference between kill and kill -9?',
        'How do you bring a suspended job back to the foreground?',
      ],
      checklist: [
        'Find a process by name and PID.',
        'Stop it politely, then forcibly.',
        'Background, suspend, and foreground a job.',
      ],
      interactive: {
        coldOpen:
          'top shows one process pinned at 100% CPU, dragging the whole box down. You note its PID, send it a polite shutdown, and watch it refuse. One stronger signal, kill -9, and the kernel ends it instantly, no negotiation. Knowing the difference between "please stop" and "you are stopped" is the difference between a clean shutdown and a corrupted file.',
        mental:
          'Every program is a process with a PID. ps/top find them; kill sends a signal: SIGTERM asks politely, SIGKILL (-9) forces, last resort.',
        diagram: {
          nodes: ['ps / top: find PID', 'kill PID = SIGTERM', 'process cleans up + exits', 'kill -9 = SIGKILL (forced)'],
          explanations: [
            'List processes and note the PID of the offender.',
            'SIGTERM (15) asks the process to shut down; it can catch and clean up.',
            'A well-behaved process flushes, closes files, and exits.',
            'If it ignores SIGTERM, SIGKILL (9) is enforced by the kernel, no cleanup.',
          ],
        },
        example: {
          code: '$ ps aux | grep [n]ode\nabhi  4471  98.7  2.1  ... node server.js\n$ kill 4471          # SIGTERM: please shut down\n$ ps -p 4471         # still there? it is ignoring TERM\n  PID TTY      TIME CMD\n 4471 ?    00:01:12 node\n$ kill -9 4471       # SIGKILL: enforced, cannot be caught\n$ ps -p 4471\n  PID TTY      TIME CMD            (gone)',
          output:
            'ps aux | grep -> find the PID (98.7% CPU here)\nkill 4471     -> SIGTERM, the polite request\nstill running -> the process ignored TERM\nkill -9 4471  -> SIGKILL, the kernel ends it immediately',
          explain:
            'The [n]ode trick stops grep from matching its own line. SIGTERM was ignored, so SIGKILL was the escalation. Reach for -9 only after TERM fails.',
        },
        build: {
          simple: 'ps/top find processes; kill stops them, kill -9 forces it.',
          actually:
            'Signals are numbered messages: SIGTERM (15) and SIGINT (2, what Ctrl-C sends) are catchable so a program can clean up; SIGKILL (9) and SIGSTOP cannot be caught. A process that will not die even with -9 is usually stuck in uninterruptible I/O (state D) waiting on disk or network. pgrep finds PIDs by name; pkill/killall signal by name.',
          breaks:
            'kill -9 as a habit skips cleanup: open files are not flushed, locks are not released, in-flight requests are dropped. A zombie (state Z) is a finished process whose parent has not collected its exit status; you cannot kill it, you fix or restart the parent. Backgrounding with & but then closing the terminal can send SIGHUP and kill the job unless you use nohup or disown.',
        },
        doThisNow: [
          {
            task: 'Start a harmless background job, find it, then stop it politely.',
            command: 'sleep 300 & echo "started PID $!"; ps -p $!; kill $!; echo "sent TERM"',
            reveal:
              'sleep 300 & runs in the background; $! is its PID. ps -p confirms it is running, and kill $! sends SIGTERM, which sleep obeys and exits. You launched, located, and stopped a process by PID.',
          },
          {
            task: 'Practice job control: suspend a foreground job, background it, then foreground it again.',
            command: 'sleep 120   # press Ctrl-Z to suspend, then: bg ; jobs ; fg',
            reveal:
              'Ctrl-Z suspends the running sleep and returns the prompt; bg resumes it in the background; jobs lists it; fg pulls it back to the foreground (Ctrl-C then ends it). That is the same flow you use to park a long task and reclaim your terminal.',
          },
        ],
        warStory:
          'A team aliased their restart script to kill -9 because TERM "was too slow". Every deploy then hard-killed the app mid-write, and once a month it corrupted a queue file and dropped jobs. Switching to SIGTERM with a 10-second grace period (and a handler that finishes in-flight work) ended the corruption. -9 is an escalation, not a default.',
        tweak: {
          instruction: 'A process survives kill -9 and shows state D in ps. What does that mean and what do you do?',
          reveal:
            'State D is uninterruptible sleep: the process is blocked in a kernel I/O call (often a hung disk or network mount) and cannot receive any signal, even SIGKILL. You fix the underlying I/O (or reboot); you cannot kill it directly.',
        },
        receipt: {
          explain: [
            'Processes have PIDs; ps/top list them, top shows live load.',
            'kill sends SIGTERM (catchable); kill -9 forces SIGKILL (last resort).',
          ],
          command: 'ps aux | head -n 5',
          question: 'Processes and the box look healthy. How do you check whether the disk is filling and what is eating it?',
        },
        recap: [
          'A process has a PID; ps/top find it, top updates live.',
          'kill = SIGTERM (graceful); kill -9 = SIGKILL (forced, no cleanup).',
          '&, Ctrl-Z, bg, fg, jobs manage shell jobs.',
        ],
      },
    },

    {
      id: 'linux-rung-disk',
      title: 'Module 13: Disk and Storage (df, du, lsblk, mount)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 11,
      prompt: 'The disk is full. Name the command that shows which filesystem is full and the one that finds what is eating the space inside it.',
      explanation: `Two questions come up constantly: how full is each filesystem, and what is taking the space. \`df\` answers the first, \`du\` the second, and \`lsblk\`/\`mount\` show how the storage is wired up.

**df: free space per filesystem.** \`df -h\` lists each mounted filesystem with size, used, available, and use percent in human units. This tells you which mount is full, not what filled it.

**du: usage per directory.** \`du -sh *\` shows the total size of each item in the current directory; \`du -sh /var/*\` drills into a tree. This is how you hunt down the directory that ate the disk.

**lsblk and mount: the layout.** \`lsblk\` shows block devices (disks and partitions) as a tree. \`mount\` and \`findmnt\` show what is mounted where. A filesystem must be mounted to a directory before you can read or write it.`,
      production:
        'A full disk is one of the most common production incidents, and it is sneaky: it surfaces as unrelated write errors, failed logs, and crashing databases. df -h to find the full mount, then du -sh to find the culprit directory, is a drill worth having in muscle memory.',
      walkthrough: [
        'Use df -h to find a full filesystem.',
        'Use du -sh to find the big directory inside it.',
        'Use lsblk to see disks and partitions.',
        'Explain that storage must be mounted to be used.',
      ],
      questions: [
        'What is the difference between df and du?',
        'How do you find which directory is eating space?',
        'What does it mean for a filesystem to be mounted?',
      ],
      checklist: [
        'Read per-filesystem usage.',
        'Drill into a tree to find big directories.',
        'List block devices and mounts.',
      ],
      interactive: {
        coldOpen:
          'df -h says / is 100% full, but where did 49 gigabytes go? df only names the full mount, not the cause. One more command, du -sh /var/* sorted by size, points straight at /var/log eating 40 GB of an un-rotated log. Two commands, full to fixed. Disk triage is a fixed two-step you run on autopilot.',
        mental:
          'df shows how full each filesystem is; du shows what is taking the space inside one. df finds the symptom, du finds the cause.',
        diagram: {
          nodes: ['df -h: which mount is full', 'du -sh: which directory is big', 'delete / rotate / move', 'lsblk: how disks are laid out'],
          explanations: [
            'Per-filesystem usage; finds the full mount.',
            'Per-directory usage; finds what filled it.',
            'Free space by removing, rotating, or moving the culprit.',
            'The block devices and partitions underneath the filesystems.',
          ],
        },
        example: {
          code: '$ df -h\nFilesystem  Size  Used Avail Use% Mounted on\n/dev/root    49G   49G    0  100% /\n$ du -sh /var/* 2>/dev/null | sort -h | tail -3\n1.2G  /var/lib\n3.0G  /var/cache\n40G   /var/log\n$ du -sh /var/log/* | sort -h | tail -1\n39G   /var/log/app.log',
          output:
            'df -h         -> / is 100% full (the symptom)\ndu -sh /var/* -> /var/log is 40G (the cause)\ndu deeper     -> one un-rotated app.log is 39G',
          explain:
            'df told you the filesystem was full; du -sh with sort -h walked down to the exact 39 GB file. Truncating or rotating it frees the disk immediately.',
        },
        build: {
          simple: 'df = how full each filesystem is; du = what is using the space.',
          actually:
            'df reads filesystem metadata so it is instant; du walks the tree summing file sizes so it is slower on big trees. sort -h sorts the human-readable sizes correctly (so 2G > 900M). A deleted file still held open by a running process keeps using disk until that process closes it, so df can stay full after rm until you restart the holder (lsof finds it).',
          breaks:
            'du and df can disagree: du counts files you can see, df counts blocks in use, so a large deleted-but-open file shows in df but not du. Filling the filesystem that holds / can wedge the whole machine. Running du -sh / from the top is slow and noisy; start at likely culprits like /var and /tmp.',
        },
        doThisNow: [
          {
            task: 'Run the disk-triage two-step on your own machine: which mount, then what is big in your home.',
            command: 'df -h; echo "--- biggest items in home ---"; du -sh ~/* 2>/dev/null | sort -h | tail -5',
            reveal:
              'df -h shows usage per filesystem; du -sh ~/* | sort -h | tail -5 lists your five largest top-level items in home. That is the exact pattern (df to find the full mount, du to find the culprit) you run during a real disk incident.',
          },
          {
            task: 'See how the storage is physically laid out into devices and partitions.',
            command: 'lsblk 2>/dev/null || diskutil list',
            reveal:
              'lsblk prints disks and their partitions as a tree, each with a mount point. (On macOS, diskutil list is the analog.) This shows the layer beneath filesystems: the actual block devices df reports on.',
          },
        ],
        warStory:
          'After an incident, df -h still showed the disk full even though the team had rm-ed the giant log. The log file had been deleted but a running process still held it open, so the space was not reclaimed. lsof | grep deleted found the holder; restarting it freed 39 GB instantly. Deleting a file the kernel still has open does not free space.',
        tweak: {
          instruction: 'du says /var/log is only 2 GB but df still shows the filesystem 100% full. What is the likely cause?',
          reveal:
            'A large file was deleted while a process still had it open, so df counts the still-allocated blocks but du cannot see the now-unlinked file. Find the holding process (lsof | grep deleted) and restart it to release the space.',
        },
        receipt: {
          explain: [
            'df -h finds the full filesystem; du -sh finds the big directory.',
            'sort -h orders sizes; deleted-but-open files keep space until released.',
          ],
          command: 'df -h; du -sh ~/* 2>/dev/null | sort -h | tail -3',
          question: 'Storage is local. How does this machine talk to the network, and how do you check connectivity and DNS?',
        },
        recap: [
          'df -h shows per-filesystem usage; du -sh shows per-directory.',
          'sort -h orders human sizes; start du at /var or /tmp.',
          'A deleted-but-open file keeps using disk until the holder exits.',
        ],
      },
    },

    {
      id: 'linux-rung-networking',
      title: 'Module 14: Networking (ip, ping, ss, dig, curl)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt: 'A service cannot reach another host. Name the commands that check your address, basic reachability, DNS, and the actual HTTP response.',
      explanation: `Network debugging is a ladder: confirm your own address, then reachability, then name resolution, then the actual application response. \`ip\`, \`ping\`, \`dig\`, \`ss\`, and \`curl\` cover the rungs.

**Your address and routes.** \`ip addr\` shows your interfaces and IP addresses (the modern replacement for \`ifconfig\`). \`ip route\` shows how packets leave the machine.

**Reachability and ports.** \`ping host\` sends ICMP echoes to check if a host answers at all. \`ss -tlnp\` (or the older \`netstat -tlnp\`) lists which ports are listening locally, the fast way to confirm your service is actually bound.

**Names and the real response.** \`dig example.com\` resolves a name to IP addresses via DNS; \`host\` is a shorter version. \`curl -v https://example.com\` makes the real HTTP request and shows headers and status, and \`wget\` downloads a file. Working down this ladder isolates whether a problem is the network, DNS, the port, or the app.`,
      production:
        'Most "service A cannot reach service B" tickets are solved by walking this ladder: is B resolving (dig), is it reachable (ping), is the port open (ss/curl), and what does the app actually return (curl -v). Guessing wastes hours; the ladder takes minutes.',
      walkthrough: [
        'Find your own IP with ip addr.',
        'Test reachability with ping.',
        'Resolve a name with dig.',
        'Check listening ports with ss and the real response with curl.',
      ],
      questions: [
        'What does ip addr show?',
        'What does ss -tlnp tell you?',
        'How do you see the actual HTTP status a server returns?',
      ],
      checklist: [
        'Read your interfaces and IPs.',
        'Test reachability and DNS.',
        'List listening ports and fetch a URL.',
      ],
      interactive: {
        coldOpen:
          'Service A logs "connection refused" to service B. Before blaming the network, you walk four rungs: dig B (it resolves), ping B (it answers), curl B:8080 (refused), ss on B (nothing listening on 8080). The app never bound the port. Two minutes of laddering beat an afternoon of guessing, because each rung rules out a layer.',
        mental:
          'Debug the network as a ladder: your address (ip), reachability (ping), name resolution (dig), open ports and real response (ss, curl). Each rung isolates one layer.',
        diagram: {
          nodes: ['ip addr: my address', 'ping: reachable?', 'dig: DNS resolves?', 'ss / curl: port + response'],
          explanations: [
            'Confirm your own interfaces and IP first.',
            'Check whether the target host answers at all.',
            'Check that the name resolves to the right IP.',
            'Confirm the port is open and see the actual HTTP response.',
          ],
        },
        example: {
          code: '$ ip addr show | grep "inet "\n    inet 127.0.0.1/8 scope host lo\n    inet 10.0.0.12/24 scope global eth0\n$ ping -c1 example.com\n64 bytes from 93.184.216.34: time=11.2 ms\n$ dig +short example.com\n93.184.216.34\n$ ss -tlnp | grep :8080\nLISTEN 0 511 0.0.0.0:8080 users:(("node",pid=4471))\n$ curl -sI http://localhost:8080 | head -n1\nHTTP/1.1 200 OK',
          output:
            'ip addr  -> your IPs (lo loopback, eth0 10.0.0.12)\nping     -> host answers in 11ms\ndig      -> name resolves to 93.184.216.34\nss       -> node is listening on 8080\ncurl -I  -> the server returns 200 OK',
          explain:
            'Each command answered one layer: address, reachability, DNS, listening port, and the real HTTP status. When one rung fails, you have found the layer to fix.',
        },
        build: {
          simple: 'ip addr (your IP), ping (reachable), dig (DNS), ss/curl (port + response).',
          actually:
            'ip replaces the deprecated ifconfig; ss replaces netstat and is faster. ping uses ICMP, which some hosts and firewalls block, so a failed ping does not always mean "down". curl -v shows the full handshake (DNS, TCP, TLS, request, response) which is the single most useful command for HTTP debugging. ss -tlnp needs privileges to show the owning process.',
          breaks:
            'A blocked ICMP makes ping fail on a perfectly healthy host, so do not conclude "unreachable" from ping alone; try curl to the actual port. Binding to 127.0.0.1 instead of 0.0.0.0 makes a service reachable locally but not from other machines, a classic "works on the box, not from outside". DNS caching can make dig and the app disagree until the TTL expires.',
        },
        doThisNow: [
          {
            task: 'Find your own addresses, then resolve and reach a public host.',
            command: 'ip addr show 2>/dev/null | grep "inet " || ipconfig getifaddr en0; ping -c1 example.com; dig +short example.com 2>/dev/null || host example.com',
            reveal:
              'You see your loopback and real IP, a ping round-trip time proving reachability, and the IP that example.com resolves to. (On macOS ip/dig may be absent; ipconfig and host are the analogs.) That is rungs one through three of the ladder.',
          },
          {
            task: 'See what is listening on your machine, then make a real HTTP request and read just the status line.',
            command: 'ss -tlnp 2>/dev/null | head || netstat -an | grep LISTEN | head; curl -sI https://example.com | head -n1',
            reveal:
              'ss/netstat lists the local ports in LISTEN state (your bound services); curl -sI fetches headers only and head -n1 shows HTTP/1.1 200 OK. Those are rungs four and five: is the port open, and what does the app actually say.',
          },
        ],
        warStory:
          'A new service was "down from other machines" but curl localhost worked on the box. ss showed it listening on 127.0.0.1:8080, not 0.0.0.0:8080, so it only accepted local connections. One config change to bind all interfaces fixed it. The ladder (it resolves, it pings, the port is local-only) found it in minutes.',
        tweak: {
          instruction: 'ping to a server times out, but curl to its HTTPS port returns 200. Is the server down? Explain.',
          reveal:
            'No, it is up and serving. The host (or a firewall) is simply blocking ICMP, so ping fails while real TCP/HTTPS traffic works fine. Never declare a host down from a failed ping alone; test the actual port.',
        },
        receipt: {
          explain: [
            'Debug networking as a ladder: ip, ping, dig, ss, curl.',
            'ping can fail on a healthy host (ICMP blocked); test the real port.',
          ],
          command: 'dig +short example.com 2>/dev/null || host example.com; curl -sI https://example.com | head -n1',
          question: 'You can reach other hosts. How do you log into one securely and copy files to it?',
        },
        recap: [
          'ip addr (address), ping (reachable), dig (DNS), ss (ports), curl (response).',
          'ip/ss replace ifconfig/netstat; curl -v is the HTTP debugger.',
          'Blocked ICMP and 127.0.0.1-only binds cause false "down" reports.',
        ],
      },
    },

    {
      id: 'linux-rung-ssh',
      title: 'Module 15: SSH and File Transfer (ssh, scp, rsync)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain how SSH lets you log into a remote machine securely, and the difference between scp and rsync for copying files.',
      explanation: `SSH (secure shell) gives you an encrypted shell on a remote machine, and the same protocol moves files with \`scp\` and \`rsync\`. It is how you reach every server you do not sit in front of.

**ssh: a remote shell.** \`ssh user@host\` opens an encrypted session and drops you at that machine's prompt. \`ssh -p 2222 user@host\` uses a non-default port. After connecting, every command runs on the remote box.

**Keys beat passwords.** An SSH key pair (a private key you keep, a public key you put on the server in \`~/.ssh/authorized_keys\`) lets you log in without typing a password and is far harder to brute-force. \`ssh-keygen\` makes the pair; \`ssh-copy-id\` installs the public key.

**scp and rsync: copy files.** \`scp file user@host:/path\` copies a file over SSH. \`rsync -a local/ user@host:/remote/\` synchronizes directories, copying only what changed and preserving permissions, which is far faster for repeated transfers and large trees.`,
      production:
        'Deploys, backups, and log retrieval all ride SSH. Key-based auth (no passwords), a non-root deploy user, and rsync for incremental file sync are the backbone of moving code and data to servers safely.',
      walkthrough: [
        'Open a remote shell with ssh user@host.',
        'Explain key pairs vs passwords.',
        'Copy a single file with scp.',
        'Sync a directory efficiently with rsync.',
      ],
      questions: [
        'What does ssh give you on the remote machine?',
        'Why are SSH keys better than passwords?',
        'When would you use rsync instead of scp?',
      ],
      checklist: [
        'Connect to a host with ssh.',
        'Explain public/private key auth.',
        'Copy with scp and sync with rsync.',
      ],
      interactive: {
        coldOpen:
          'You type ssh deploy@prod-1 and, a second later, your terminal is a shell on a machine a thousand miles away, encrypted end to end. Every deploy, every server fix, every backup rides this one tunnel. And the moment you swap your password for a key, you stop typing secrets and start logging in with math.',
        mental:
          'SSH is an encrypted remote shell; scp and rsync copy over the same tunnel. Keys (a private half you keep, a public half on the server) replace passwords.',
        diagram: {
          nodes: ['your machine (private key)', 'SSH tunnel (encrypted)', 'server (public key)', 'scp / rsync over the same tunnel'],
          explanations: [
            'You hold the private key; never share it.',
            'SSH encrypts the whole session end to end.',
            'The server has your public key in authorized_keys and verifies you.',
            'File copies (scp, rsync) travel through the same secure channel.',
          ],
        },
        example: {
          code: '$ ssh-keygen -t ed25519        # make a key pair (once)\n$ ssh-copy-id deploy@prod-1    # install your public key on the server\n$ ssh deploy@prod-1           # log in, no password\ndeploy@prod-1:~$ exit\n$ scp build.tar.gz deploy@prod-1:/tmp/      # copy one file\n$ rsync -a --delete dist/ deploy@prod-1:/var/www/   # sync a tree',
          output:
            'ssh-keygen   -> creates ~/.ssh/id_ed25519 (private) + .pub (public)\nssh-copy-id  -> puts the public key in the server authorized_keys\nssh          -> encrypted shell on the remote box\nscp          -> copy a single file over SSH\nrsync -a     -> sync a directory, only changed files, preserving perms',
          explain:
            'After ssh-copy-id, ssh logs in with the key, no password. scp moves one file; rsync -a --delete makes the remote directory match the local one, transferring only differences.',
        },
        build: {
          simple: 'ssh = remote shell; scp = copy a file; rsync = sync a tree efficiently.',
          actually:
            'The private key never leaves your machine; the server stores only the public half and challenges you to prove you hold the private one. rsync -a preserves permissions, timestamps, and symlinks and only sends changed blocks, so re-syncing a large tree is fast; --delete removes files on the remote that are gone locally. A trailing slash on the rsync source (dist/) means "contents of", which changes where files land.',
          breaks:
            'A world-readable private key is rejected: SSH refuses keys with loose permissions, so chmod 600 the private key. rsync src vs rsync src/ differ: the slash decides whether you copy the directory or its contents, a frequent cause of nested or misplaced files. Logging in as root over SSH is a common, avoidable risk; use a deploy user.',
        },
        doThisNow: [
          {
            task: 'Create an SSH key pair (safe, local only) and look at the public half you would put on a server.',
            command: 'ssh-keygen -t ed25519 -f /tmp/demo_key -N "" -q && echo "--- public key ---" && cat /tmp/demo_key.pub && ls -l /tmp/demo_key',
            reveal:
              'You get /tmp/demo_key (private) and /tmp/demo_key.pub (public). The .pub line is exactly what goes in a server ~/.ssh/authorized_keys. Note the private key permissions are tight (600); SSH refuses keys that others can read.',
          },
          {
            task: 'Try rsync locally to feel the slash rule and the "only changed" behavior.',
            command: 'mkdir -p /tmp/src /tmp/dst; echo one > /tmp/src/a; rsync -av /tmp/src/ /tmp/dst/; echo two > /tmp/src/b; rsync -av /tmp/src/ /tmp/dst/',
            reveal:
              'The first rsync copies a; the second copies only the new b (it skips the unchanged a), printing just what changed. The trailing slash on src/ copied the contents into dst/. Over SSH this same command syncs to a remote host efficiently.',
          },
        ],
        warStory:
          'A backup job used scp in a loop to copy a large directory every night, re-sending every file each time and taking hours. Switching to rsync -a cut it to minutes because only changed files moved. For anything you copy repeatedly, scp re-sends everything and rsync sends the difference.',
        tweak: {
          instruction: 'SSH refuses your key with "permissions are too open". What is wrong and the fix?',
          reveal:
            'The private key file is readable by others. SSH ignores keys that are not private. Fix with chmod 600 ~/.ssh/id_ed25519 (and ensure ~/.ssh is 700).',
        },
        receipt: {
          explain: [
            'SSH is an encrypted remote shell; keys replace passwords.',
            'scp copies one file; rsync -a syncs trees, sending only changes.',
          ],
          command: 'ssh-keygen -t ed25519 -f /tmp/demo_key2 -N "" -q && cat /tmp/demo_key2.pub',
          question: 'You can move files to a server. How do you bundle many files into one archive and compress them first?',
        },
        recap: [
          'ssh user@host opens an encrypted remote shell.',
          'Key pairs (private kept, public on server) beat passwords; chmod 600 the key.',
          'scp copies a file; rsync -a syncs trees efficiently.',
        ],
      },
    },

    {
      id: 'linux-rung-archives',
      title: 'Module 16: Compression and Archives (tar, gzip, zip)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 10,
      prompt: 'Explain the difference between archiving and compressing, and decode the flags in tar -czf backup.tar.gz folder.',
      explanation: `Two separate jobs are often done together: archiving bundles many files into one, and compression shrinks bytes. \`tar\` archives, \`gzip\` compresses, and \`tar\` can do both at once.

**tar bundles.** \`tar -cf archive.tar folder\` creates (c) a single file (f) from a folder. \`tar -xf archive.tar\` extracts (x) it. By itself tar does not compress; it just packs.

**Add compression with z.** \`tar -czf backup.tar.gz folder\` creates a gzip-compressed (z) archive in one step; \`tar -xzf backup.tar.gz\` extracts it. The flags read as create-gzip-file. Add \`v\` (verbose) to watch the file list: \`tar -czvf\`.

**gzip and zip.** \`gzip file\` compresses a single file in place to file.gz (\`gunzip\` reverses it). \`zip -r archive.zip folder\` makes a cross-platform zip (archive and compress together), which is what Windows users expect.`,
      production:
        'Backups, log bundles, and release artifacts are almost always tarballs (.tar.gz). Knowing the four flag letters (c create, x extract, z gzip, f file, v verbose) means you never have to look up tar mid-incident.',
      walkthrough: [
        'Separate archiving (bundling) from compression (shrinking).',
        'Create and extract a plain tar.',
        'Create and extract a gzip-compressed tarball.',
        'Use gzip on a single file and zip for cross-platform.',
      ],
      questions: [
        'What is the difference between tar and gzip?',
        'What do c, x, z, f, and v mean in tar?',
        'How do you extract a .tar.gz?',
      ],
      checklist: [
        'Create and extract a tarball.',
        'Decode tar flag letters.',
        'Compress a single file and make a zip.',
      ],
      interactive: {
        coldOpen:
          'Someone hands you logs.tar.gz and you need what is inside. The flags are not random: tar -xzf reads as extract, gzip, file. Once the five letters click (c create, x extract, z gzip, f file, v verbose), tar stops being the command everyone looks up and becomes one you just type.',
        mental:
          'Archiving bundles many files into one (tar); compression shrinks bytes (gzip). tar -czf does both: create, gzip, file.',
        diagram: {
          nodes: ['many files', 'tar: bundle into one .tar', 'gzip (z): compress to .tar.gz', 'tar -xzf: reverse both'],
          explanations: [
            'A folder full of files you want to move or store.',
            'tar packs them into a single archive (no compression yet).',
            'The z flag pipes through gzip to shrink the archive.',
            'Extraction undoes compression and unpacks in one command.',
          ],
        },
        example: {
          code: '$ tar -czvf site.tar.gz site/\nsite/\nsite/index.html\nsite/css/main.css\n$ ls -lh site.tar.gz\n-rw-r--r--  1 abhi  staff   1.2K site.tar.gz\n$ tar -xzvf site.tar.gz -C /tmp/restore\nsite/\nsite/index.html\n$ gzip big.log        # -> big.log.gz (original replaced)\n$ gunzip big.log.gz   # -> big.log',
          output:
            'tar -czvf -> create (c), gzip (z), verbose (v), file (f)\nls -lh    -> the compressed archive size\ntar -xzvf -> extract; -C chooses where to unpack\ngzip/gunzip -> compress/decompress a single file in place',
          explain:
            'tar -czvf bundled and compressed the folder while listing files; -xzvf reversed it into a chosen directory with -C. gzip works on one file at a time, replacing it with a .gz.',
        },
        build: {
          simple: 'tar bundles; gzip shrinks; tar -czf does both.',
          actually:
            'The flag order is flexible (tar -czf and tar czf both work); f must be followed by the filename. .tgz is just .tar.gz. gzip compresses one stream, which is why you tar first then gzip for a folder. tar -tzf lists contents without extracting, useful to peek before unpacking. Other compressors swap in: j for bzip2, J for xz, often smaller but slower.',
          breaks:
            'tar -xzf into the current directory can scatter files everywhere if the archive was made without a top folder; tar -tzf first to see the layout, and use -C to control where it lands. gzip replaces the original with the .gz by default, so the uncompressed file is gone unless you used gzip -k. A .zip from Windows may carry CRLF line endings that surprise Unix tools.',
        },
        doThisNow: [
          {
            task: 'Make a small folder, archive-and-compress it, peek inside without extracting, then extract to a fresh directory.',
            command: 'cd /tmp; mkdir -p pack/sub; echo hi > pack/a; echo yo > pack/sub/b; tar -czf pack.tar.gz pack; echo "--- contents ---"; tar -tzf pack.tar.gz; mkdir -p out; tar -xzf pack.tar.gz -C out; find out',
            reveal:
              'tar -czf created pack.tar.gz; tar -tzf listed its contents without unpacking; tar -xzf ... -C out extracted into out/. find out shows the restored tree. You bundled, inspected, and restored without guessing the flags.',
          },
          {
            task: 'Compress a single file with gzip and watch it shrink, then restore it.',
            command: 'cd /tmp; seq 1 100000 > nums.txt; ls -lh nums.txt; gzip nums.txt; ls -lh nums.txt.gz; gunzip nums.txt.gz; ls -lh nums.txt',
            reveal:
              'ls -lh shows the file shrink dramatically as .gz (repetitive numbers compress well), then return to full size after gunzip. gzip replaced the original with the .gz and gunzip reversed it.',
          },
        ],
        warStory:
          'An engineer ran tar -xzf release.tar.gz in their home directory; the archive had no top-level folder, so it dumped dozens of files directly into home, mixed with everything else. tar -tzf first would have shown the flat layout, and -C /tmp/release would have contained it. Look before you extract.',
        tweak: {
          instruction: 'You want to see what is inside backup.tar.gz before extracting it. Which command?',
          reveal:
            'tar -tzf backup.tar.gz. The t flag lists the archive contents (with z for gzip, f for the file) without writing anything to disk.',
        },
        receipt: {
          explain: [
            'tar bundles files; gzip compresses; tar -czf does both.',
            'c create, x extract, t list, z gzip, f file, v verbose; -C sets target.',
          ],
          command: 'cd /tmp && tar -czf demo.tgz nums.txt 2>/dev/null; tar -tzf demo.tgz 2>/dev/null || echo "make a file first"',
          question: 'You can bundle software. How do you install software, and what is a package manager doing for you?',
        },
        recap: [
          'Archiving (tar) bundles; compression (gzip) shrinks.',
          'tar -czf create, -xzf extract, -tzf list; -C picks the directory.',
          'gzip works on one file and replaces it unless you use -k.',
        ],
      },
    },

    {
      id: 'linux-rung-packages',
      title: 'Module 17: Installing Software (apt, dnf, and from source)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain what a package manager does for you, and the three steps to build software from source.',
      explanation: `You rarely copy binaries around by hand. A package manager installs software and everything it depends on, from a trusted repository, and can update or remove it cleanly. Debian/Ubuntu use \`apt\`; RHEL/Fedora use \`dnf\` (older \`yum\`).

**Package managers.** \`sudo apt update\` refreshes the list of available packages; \`sudo apt install nginx\` installs nginx and its dependencies; \`sudo apt remove nginx\` removes it. On RHEL/Fedora the same flow is \`sudo dnf install nginx\`. The manager resolves dependencies, verifies signatures, and tracks what is installed so removal is clean.

**Finding things.** \`which node\` shows the path of an installed program; \`apt list --installed\` (or \`dnf list installed\`) shows everything the manager put on the box.

**Building from source.** When there is no package, you compile: \`./configure\` checks your system and prepares the build, \`make\` compiles, and \`sudo make install\` copies the result into place. This is the classic three-step, and it is what package managers automate for you.`,
      production:
        'Reproducible servers come from package managers and pinned versions, not hand-installed binaries. "It works on my machine" is often an undocumented from-source install that nothing else can reproduce; a package (or a Dockerfile that uses one) makes it repeatable.',
      walkthrough: [
        'Explain what a package manager resolves for you.',
        'Update, install, and remove with apt (or dnf).',
        'Locate an installed program with which.',
        'Build from source with configure, make, make install.',
      ],
      questions: [
        'What does a package manager do besides copy files?',
        'What is the difference between apt and dnf?',
        'What do ./configure, make, and make install each do?',
      ],
      checklist: [
        'Update and install a package.',
        'Find an installed binary path.',
        'Explain the configure/make/make install steps.',
      ],
      interactive: {
        coldOpen:
          'Installing software by hand means hunting down every library it needs, in the right version, and remembering all of it when you uninstall. A package manager does that for you in one line: sudo apt install nginx pulls nginx and every dependency, verified and tracked. The day there is no package, you fall back to the three-step that package managers automate: configure, make, make install.',
        mental:
          'A package manager installs software plus its dependencies from a trusted repo and tracks it for clean updates and removal. From source, the three-step is configure, make, make install.',
        diagram: {
          nodes: ['apt update: refresh list', 'apt install pkg: resolve + fetch + verify', 'installed + tracked', 'no package -> configure/make/make install'],
          explanations: [
            'Refresh the catalog of available packages and versions.',
            'Resolve dependencies, download, verify signatures, install.',
            'The manager records what it installed for clean removal/update.',
            'When nothing is packaged, compile from source in three steps.',
          ],
        },
        example: {
          code: '$ sudo apt update\n$ sudo apt install -y jq\n$ which jq\n/usr/bin/jq\n$ jq --version\njq-1.7\n# RHEL/Fedora equivalent:\n$ sudo dnf install -y jq\n# From source (no package available):\n$ ./configure && make && sudo make install',
          output:
            'apt update   -> refresh available packages\napt install  -> install jq + dependencies, verified\nwhich jq     -> where it landed (/usr/bin/jq)\ndnf install  -> the same on RHEL/Fedora\nconfigure/make/make install -> the from-source fallback',
          explain:
            'apt resolved and installed jq with its dependencies; which confirmed the path. dnf is the same idea on a different distro. The configure/make/make install line is what you run when no package exists.',
        },
        build: {
          simple: 'apt/dnf install software and its dependencies; from source it is configure, make, make install.',
          actually:
            'apt update refreshes metadata; apt upgrade installs newer versions; apt install resolves the dependency graph and verifies package signatures against trusted keys. dpkg/rpm are the lower-level tools apt/dnf drive. ./configure inspects your system and generates a Makefile, make compiles using it, and make install copies binaries to system paths (often /usr/local). Pinning versions (apt install nginx=1.24.*) makes installs reproducible.',
          breaks:
            'Forgetting apt update means apt install can fetch stale versions or fail to find a package. make install as root scatters files outside the package manager record, so it is invisible to apt and hard to remove cleanly. Mixing from-source installs with packaged ones leads to two copies on the PATH and confusing version mismatches (which tells you which one wins).',
        },
        doThisNow: [
          {
            task: 'See which package manager your system has and what a real binary path looks like.',
            command: 'command -v apt dnf yum brew 2>/dev/null; echo "--- where is your shell? ---"; which sh bash zsh 2>/dev/null',
            reveal:
              'command -v prints the package managers available (apt/dnf/yum on Linux, brew on macOS). which shows the on-disk path of installed programs like your shells. That path is exactly what a package manager manages for you.',
          },
          {
            task: 'List what is installed and confirm a tool came from the manager.',
            command: 'apt list --installed 2>/dev/null | head || dnf list installed 2>/dev/null | head || brew list 2>/dev/null | head',
            reveal:
              'The manager prints its inventory of installed packages. Everything in that list it can update or remove cleanly, because it tracked the files it placed. A from-source make install would not appear here, which is exactly why it is harder to manage.',
          },
        ],
        warStory:
          'A server had nginx installed from source by a long-gone engineer, plus a packaged nginx from apt. Two binaries, two config paths, and a restart that started the wrong one. Hours were lost before which nginx revealed the duplicate. Pick one path (prefer the package manager) and keep from-source installs out of system directories.',
        tweak: {
          instruction: 'apt install foo says "Unable to locate package foo" right after a fresh server boot. What did you likely skip?',
          reveal:
            'sudo apt update. Without refreshing the package list first, apt has no current catalog to find foo in. Run apt update, then apt install foo.',
        },
        receipt: {
          explain: [
            'Package managers install software + dependencies and track it.',
            'apt (Debian) / dnf (Fedora); from source it is configure, make, make install.',
          ],
          command: 'command -v apt dnf yum brew 2>/dev/null; which bash',
          question: 'You can install tools and reach servers. How do you make the shell remember settings and find your own programs every session?',
        },
        recap: [
          'apt/dnf install software and dependencies from trusted repos.',
          'apt update before install; which finds an installed binary.',
          'From source: ./configure, make, sudo make install.',
        ],
      },
    },

    {
      id: 'linux-rung-env',
      title: 'Module 18: Environment Variables and PATH',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt: 'Explain what an environment variable is, what $PATH does, and why a freshly installed program is sometimes "command not found".',
      explanation: `Environment variables are named values the shell and the programs it launches can read. They configure behavior without code changes, and one of them, \`PATH\`, decides which programs you can run by name.

**Reading and setting.** \`echo $HOME\` prints a variable; \`env\` lists them all. \`export NAME=value\` sets one for this shell and every program it launches; without export, the variable stays local to the shell and child programs do not see it.

**PATH is the program search list.** When you type \`node\`, the shell looks through the colon-separated directories in \`$PATH\`, left to right, and runs the first \`node\` it finds. "command not found" means the program is not in any PATH directory; two copies on the PATH means the earlier one wins (\`which\` shows which).

**Making it stick.** Variables set in a shell vanish when it closes. To persist them, add the \`export\` lines to a startup file (\`~/.bashrc\` or \`~/.zshrc\` for interactive shells, \`~/.profile\` for login shells), which the shell reads on start.`,
      production:
        'Twelve-factor apps read config (database URLs, API keys, ports) from environment variables, so the same image runs in dev, staging, and prod with different env. A wrong or missing env var is one of the most common "works locally, breaks deployed" causes.',
      walkthrough: [
        'Read a variable with echo $NAME and list all with env.',
        'Set one for child processes with export.',
        'Explain PATH as the program search order.',
        'Persist a variable in a startup file.',
      ],
      questions: [
        'What is the difference between NAME=value and export NAME=value?',
        'What does PATH control?',
        'Why does a variable disappear when you close the terminal?',
      ],
      checklist: [
        'Read and list environment variables.',
        'Export a variable and see it in a child process.',
        'Explain PATH lookup and persistence.',
      ],
      interactive: {
        coldOpen:
          'You install a tool, type its name, and the shell says "command not found", even though it is right there on disk. Nothing is broken: the shell only runs programs it can find on PATH, and the install landed somewhere PATH does not list. One variable decides which commands exist for you, and understanding it turns a baffling error into a one-line fix.',
        mental:
          'Environment variables are named values programs read. PATH is the list of directories the shell searches to turn a command name into a program; export shares a variable with child processes.',
        diagram: {
          nodes: ['type: node', 'search $PATH left to right', 'first match wins', 'not in PATH = command not found'],
          explanations: [
            'You enter a bare program name.',
            'The shell checks each colon-separated PATH directory in order.',
            'It runs the first matching program it finds.',
            'If no directory contains it, you get command not found.',
          ],
        },
        example: {
          code: '$ echo $HOME\n/home/abhi\n$ echo $PATH\n/usr/local/bin:/usr/bin:/bin\n$ GREETING=hi\n$ bash -c \'echo $GREETING\'        # child does NOT see it\n\n$ export GREETING=hi\n$ bash -c \'echo $GREETING\'        # now it does\nhi',
          output:
            'echo $VAR     -> read a variable\necho $PATH    -> the colon-separated program search list\nNAME=value    -> local to this shell; children do not inherit it\nexport NAME   -> exported; child processes inherit it',
          explain:
            'Without export, the child bash printed an empty line: the variable was shell-local. After export, the child inherited it. PATH is just one such variable, the one the shell uses to find programs.',
        },
        build: {
          simple: 'env vars configure programs; PATH lists where to find commands; export shares them.',
          actually:
            'The shell keeps shell variables and a subset marked for export (the environment) that child processes inherit. PATH is searched left to right, so prepending a directory overrides later ones. Startup files differ: login shells read ~/.profile (or ~/.bash_profile), interactive shells read ~/.bashrc / ~/.zshrc; this is why a variable set in one context is missing in another (cron, for example, has a minimal environment).',
          breaks:
            'Setting a variable without export means scripts and programs you launch never see it. cron jobs run with a bare environment and a short PATH, so a command that works in your shell fails in cron unless you use absolute paths or set PATH in the job. Editing the wrong startup file (.bashrc vs .profile) makes a change that only applies to some sessions.',
        },
        doThisNow: [
          {
            task: 'Read key variables, then prove the export difference with a child process.',
            command: 'echo "HOME=$HOME"; echo "PATH=$PATH"; X=local; bash -c \'echo "child sees: [$X]"\'; export X=shared; bash -c \'echo "child sees: [$X]"\'',
            reveal:
              'The first child prints an empty [] because X was not exported; after export, the child prints [shared]. That is exactly why scripts and tools sometimes cannot see a variable you set: it was never exported into the environment.',
          },
          {
            task: 'See how the shell finds a command, and add a directory to PATH for this session.',
            command: 'which ls; mkdir -p /tmp/bin; printf "#!/bin/sh\\necho custom hi\\n" > /tmp/bin/hi; chmod +x /tmp/bin/hi; export PATH="/tmp/bin:$PATH"; hi; which hi',
            reveal:
              'which ls shows where ls lives. After putting a hi script in /tmp/bin and prepending that dir to PATH, typing hi runs it and which hi points at /tmp/bin/hi. You just controlled what "command not found" means by editing PATH.',
          },
        ],
        warStory:
          'A cron job ran a backup that worked perfectly by hand but produced empty files at 2am. cron runs with a minimal PATH, so the aws binary the script called was not found, and the error went to an unread mailbox. Setting an absolute path (and PATH) in the job fixed it. Your interactive environment is not the environment your scripts get.',
        tweak: {
          instruction: 'A new CLI you installed is "command not found" but the file exists at /opt/tool/bin/mytool. Give a one-line fix and a permanent one.',
          reveal:
            'For now: export PATH="/opt/tool/bin:$PATH" then run mytool. Permanently: add that export line to your ~/.bashrc (or ~/.zshrc) so every new shell includes the directory.',
        },
        receipt: {
          explain: [
            'Env vars are named values programs read; export shares them with children.',
            'PATH is the left-to-right search list that turns a name into a program.',
          ],
          command: 'echo "$PATH"; which sh',
          question: 'Commands produce streams of text. How do you slice, sort, and transform that text on the command line?',
        },
        recap: [
          'Environment variables configure programs; env lists them.',
          'export shares a variable with child processes; PATH finds commands.',
          'Persist in ~/.bashrc / ~/.profile; cron has a minimal environment.',
        ],
      },
    },

    {
      id: 'linux-rung-text',
      title: 'Module 19: Text Processing (wc, sort, uniq, cut, sed, awk)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt: 'Name the small tools that count, sort, dedupe, slice columns, and transform text, and explain why they are usually used together.',
      explanation: `The command line is built for text. A handful of small filters, combined with pipes, turn raw output into answers: \`wc\` counts, \`sort\` orders, \`uniq\` collapses duplicates, \`cut\` slices columns, \`sed\` edits streams, and \`awk\` does field-aware processing.

**Count, sort, dedupe.** \`wc -l\` counts lines (\`-w\` words, \`-c\` bytes). \`sort\` orders lines (\`-n\` numeric, \`-r\` reverse, \`-k\` by column). \`uniq\` collapses adjacent duplicate lines, so it is almost always preceded by \`sort\`; \`uniq -c\` adds counts.

**Slice and transform.** \`cut -d',' -f1\` extracts the first comma-separated field. \`sed 's/old/new/g'\` substitutes text in a stream. \`awk '{print $2}'\` prints the second whitespace-separated field, and awk can filter and compute too (\`awk '$3 > 100'\`).

**The classic pipeline.** \`sort | uniq -c | sort -rn\` is the "count and rank" idiom: count occurrences of each line and list the most common first. Composing these tiny tools is how you analyze logs without writing a program.`,
      production:
        'Ad hoc log analysis lives here: top IP addresses hitting an endpoint, most common error messages, request counts per status code. A one-line pipeline answers questions in seconds that would otherwise need a script or a dashboard.',
      walkthrough: [
        'Count with wc, order with sort, dedupe with uniq.',
        'Slice columns with cut and fields with awk.',
        'Substitute text with sed.',
        'Build the sort | uniq -c | sort -rn ranking idiom.',
      ],
      questions: [
        'Why must uniq usually follow sort?',
        'What does awk \'{print $2}\' do?',
        'What does sed \'s/a/b/g\' do?',
      ],
      checklist: [
        'Count lines and sort numerically.',
        'Extract a column with cut or awk.',
        'Rank occurrences with sort | uniq -c | sort -rn.',
      ],
      interactive: {
        coldOpen:
          'Which IP hammered your API the most today? No dashboard, no script: one pipe. Pull the IP column, sort it, count duplicates, rank the counts, and the answer prints in a second. Six tiny tools, each doing one job, compose into log analysis on demand. This is the command line at its most powerful.',
        mental:
          'Small text filters compose with pipes: wc counts, sort orders, uniq dedupes, cut/awk slice fields, sed substitutes. sort | uniq -c | sort -rn is the count-and-rank workhorse.',
        diagram: {
          nodes: ['extract field (cut/awk)', 'sort', 'uniq -c (count)', 'sort -rn (rank)'],
          explanations: [
            'Pull the column you care about (an IP, a status code).',
            'Sort so identical lines sit next to each other.',
            'Collapse duplicates and count each group.',
            'Sort the counts descending to rank the most common.',
          ],
        },
        example: {
          code: '$ cat access.log\n10.0.0.5 GET /a 200\n10.0.0.5 GET /b 200\n10.0.0.7 GET /a 404\n$ wc -l access.log\n3 access.log\n$ awk \'{print $1}\' access.log | sort | uniq -c | sort -rn\n      2 10.0.0.5\n      1 10.0.0.7\n$ cut -d" " -f4 access.log | sort | uniq -c\n      1 404\n      2 200',
          output:
            'wc -l        -> 3 lines\nawk {print $1} -> first field (the IP)\nsort|uniq -c|sort -rn -> count per IP, most frequent first\ncut -d" " -f4 -> the status-code column, then counted',
          explain:
            'awk pulled the IP column, the sort/uniq/sort idiom ranked the busiest client, and cut sliced the status field. No program written, just composed filters.',
        },
        build: {
          simple: 'wc counts, sort orders, uniq dedupes, cut/awk slice, sed substitutes.',
          actually:
            'uniq only collapses adjacent duplicates, which is why sort comes first. sort -n compares numerically (so 9 < 10), sort -k2 sorts by the second field, sort -t, sets a delimiter. awk splits on whitespace by default into $1, $2, ... ($0 is the whole line) and can filter (awk \'$4==500\') and sum (awk \'{s+=$1} END{print s}\'). sed \'s/old/new/g\' substitutes globally per line; sed -i edits the file in place.',
          breaks:
            'uniq without a preceding sort silently misses duplicates that are not adjacent. cut -f defaults to tab-delimited, so on space-separated data you must set -d" " (or use awk, which handles runs of whitespace). sed -i rewrites the file with no backup unless you give sed -i.bak, so a bad pattern can destroy data. Locale settings can change sort order surprisingly.',
        },
        doThisNow: [
          {
            task: 'Build the count-and-rank idiom on a tiny log: which value appears most?',
            command: 'printf "200\\n200\\n404\\n200\\n500\\n404\\n" > /tmp/codes.txt; sort /tmp/codes.txt | uniq -c | sort -rn',
            reveal:
              'You get 3 200, 2 404, 1 500, ranked most-frequent first. sort grouped identical lines, uniq -c counted each group, and sort -rn ordered the counts. This exact pipe answers "what is most common" on any column.',
          },
          {
            task: 'Slice a column and transform text: pull a field with awk, then rewrite it with sed.',
            command: 'printf "alice,42\\nbob,17\\n" > /tmp/people.csv; cut -d"," -f1 /tmp/people.csv; awk -F, \'{print $2, $1}\' /tmp/people.csv; sed \'s/alice/ALICE/\' /tmp/people.csv',
            reveal:
              'cut -d"," -f1 prints the names column; awk -F, swaps the two fields; sed substitutes alice with ALICE. Three different ways to slice and reshape text, each a building block you pipe together.',
          },
        ],
        warStory:
          'During an incident an engineer needed the top error messages from a 2 GB log. Instead of opening it, they ran grep ERROR log | sed pattern | sort | uniq -c | sort -rn | head and had the ranked top ten in seconds. The same question via a one-off Python script would have taken ten minutes to write and run. Knowing the filters is leverage.',
        tweak: {
          instruction: 'Your uniq -c shows duplicates that should have been merged. What did you forget?',
          reveal:
            'sort before uniq. uniq only collapses adjacent duplicate lines, so the input must be sorted first: sort file | uniq -c.',
        },
        receipt: {
          explain: [
            'wc/sort/uniq/cut/sed/awk are composable text filters.',
            'sort | uniq -c | sort -rn counts and ranks; uniq needs sorted input.',
          ],
          command: 'printf "a\\nb\\na\\n" | sort | uniq -c | sort -rn',
          question: 'You can run pipelines by hand. How do you save a sequence of commands as a reusable program?',
        },
        recap: [
          'Compose small filters with pipes to analyze text.',
          'uniq needs sorted input; sort -n is numeric, awk is field-aware.',
          'sort | uniq -c | sort -rn is the count-and-rank idiom.',
        ],
      },
    },

    {
      id: 'linux-rung-scripting',
      title: 'Module 20: Shell Scripting (shebang, variables, args, exit codes)',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 14,
      prompt: 'Name the parts of a runnable shell script: how it knows which interpreter to use, how it reads arguments, and how it reports success or failure.',
      explanation: `A shell script is a file of commands the shell runs top to bottom. It turns a sequence you keep retyping into a single program, with variables, arguments, conditionals, and an exit status.

**Shebang and execute bit.** The first line, \`#!/bin/sh\` (or \`#!/usr/bin/env bash\`), tells the system which interpreter to run the file with. Make it runnable with \`chmod +x script.sh\`, then run \`./script.sh\`.

**Variables and arguments.** \`name="value"\` sets a variable (no spaces around =), \`$name\` reads it. Positional arguments are \`$1\`, \`$2\`, ...; \`$@\` is all of them; \`$#\` is the count. Always quote expansions ("$name") so spaces and empties do not break the command.

**Exit codes and control flow.** Every command returns an exit code: 0 means success, non-zero means failure, and \`$?\` holds the last one. Scripts branch on it: \`if command; then ...; fi\`, loops with \`for x in ...; do ...; done\`, and end with \`exit 0\` or \`exit 1\`. Start scripts with \`set -euo pipefail\` so they stop on the first error instead of charging ahead.`,
      production:
        'Deploy scripts, health checks, and CI steps are shell scripts. The difference between a safe one and a dangerous one is often a single line: set -euo pipefail (stop on errors, undefined variables, and failed pipes) prevents a script from continuing after a step has already failed.',
      walkthrough: [
        'Add a shebang and the execute bit.',
        'Read arguments with $1 and $@, quote expansions.',
        'Check exit codes with $? and branch with if.',
        'Add set -euo pipefail for safety.',
      ],
      questions: [
        'What does the shebang line do?',
        'What does an exit code of 0 mean?',
        'Why start a script with set -euo pipefail?',
      ],
      checklist: [
        'Write a runnable script with a shebang.',
        'Use arguments and quote variables.',
        'Branch on exit codes and fail safely.',
      ],
      interactive: {
        coldOpen:
          'A deploy script copies files, then restarts the service, then clears the cache. One day the copy fails, but the script charges ahead and restarts a half-copied app into production. The missing line was set -e: stop the instant a step fails. Scripting is easy; scripting safely is the skill, and it comes down to exit codes and a few habits.',
        mental:
          'A script is commands run top to bottom. The shebang picks the interpreter, $1/$@ read arguments, every command returns an exit code (0 = success), and set -euo pipefail makes failures stop the script.',
        diagram: {
          nodes: ['#!/bin/sh (shebang)', 'read $1, $@ (args)', 'run commands', 'exit code: 0 ok / non-zero fail'],
          explanations: [
            'The first line selects the interpreter to run the file.',
            'Positional arguments and all-args are available as variables.',
            'Commands execute top to bottom; quote your expansions.',
            'Each command (and the script) returns 0 for success, non-zero for failure.',
          ],
        },
        example: {
          code: '#!/usr/bin/env bash\nset -euo pipefail\n\nname="${1:-world}"          # first arg, default "world"\necho "Hello, ${name}!"\n\nif ping -c1 -W1 "$name" >/dev/null 2>&1; then\n  echo "$name is reachable"\nelse\n  echo "$name did not answer" >&2\n  exit 1\nfi',
          output:
            'shebang        -> run with bash\nset -euo pipefail -> stop on error, unset var, or failed pipe\n${1:-world}    -> first argument, or "world" if none\n$? / exit 1    -> report failure to the caller',
          explain:
            'The script defaults its argument, checks reachability, and exits non-zero on failure so a caller (or CI) knows it failed. set -euo pipefail means any unexpected error stops it immediately.',
        },
        build: {
          simple: 'A script runs commands top to bottom; exit code 0 means success.',
          actually:
            'set -e exits on any command that fails, set -u errors on an unset variable, set -o pipefail makes a pipeline fail if any stage fails (not just the last). "${1:-default}" supplies a fallback. Exit codes chain: cmd1 && cmd2 runs cmd2 only if cmd1 succeeded, cmd1 || cmd2 runs cmd2 only if cmd1 failed. Functions and loops return the exit code of their last command.',
          breaks:
            'Without quotes, "$file" with a space splits into two arguments and breaks the command (or worse, with rm). Without set -e a failed step is ignored and the script continues into a bad state. set -e has surprising exceptions (commands in if conditions, in pipelines without pipefail), so still check critical results explicitly. Forgetting the execute bit gives "permission denied"; running with sh script.sh sidesteps the shebang.',
        },
        doThisNow: [
          {
            task: 'Write, make executable, and run a tiny script that takes an argument and reports an exit code.',
            command: 'cd /tmp; cat > greet.sh <<\'EOF\'\n#!/usr/bin/env bash\nset -euo pipefail\nname="${1:-world}"\necho "Hello, ${name}!"\nEOF\nchmod +x greet.sh; ./greet.sh Abhi; echo "exit code: $?"',
            reveal:
              'The script prints Hello, Abhi! and exit code: 0 (success). With no argument it would print Hello, world! thanks to the ${1:-world} default. You built a real, runnable program from a few lines.',
          },
          {
            task: 'See exit codes drive control flow: chain commands with && and || and read $?.',
            command: 'true && echo "ran because true"; false || echo "ran because false"; false; echo "last exit: $?"',
            reveal:
              'true (exit 0) lets the && branch run; false (exit 1) triggers the || branch; and $? after false is 1. This is how scripts decide what to do next: success and failure are just exit codes you can test.',
          },
        ],
        warStory:
          'A backup script did cd /data/backups; rm -rf ./* with no set -e. One night the cd failed because the mount was missing, so the script ran rm -rf ./* from the home directory it started in. set -e (and checking the cd) would have stopped it the instant the cd failed. Two missing safety lines turned a failed mount into data loss.',
        tweak: {
          instruction: 'Your script keeps going after a command fails, leaving a half-done state. What one line at the top helps, and what does each letter do?',
          reveal:
            'set -euo pipefail. -e exits on any failed command, -u errors on unset variables, -o pipefail makes a pipeline fail if any stage fails. It makes the script stop at the first real problem instead of charging ahead.',
        },
        receipt: {
          explain: [
            'Shebang picks the interpreter; chmod +x makes the script runnable.',
            'Exit 0 = success; set -euo pipefail stops on the first failure.',
          ],
          command: 'bash -c \'set -e; true; echo ok; false; echo "not reached"\'',
          question: 'You can write a script. How do you make it run automatically on a schedule?',
        },
        recap: [
          'Shebang + execute bit make a file a runnable program.',
          'Arguments are $1/$@; quote every expansion.',
          'Exit code 0 = success; set -euo pipefail fails fast.',
        ],
      },
    },

    {
      id: 'linux-rung-cron',
      title: 'Module 21: Scheduling with cron',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 11,
      prompt: 'Explain how cron schedules jobs, how to read the five time fields, and the number-one reason a cron job that works by hand fails on schedule.',
      explanation: `cron runs commands automatically on a schedule. You edit your job table with \`crontab -e\`, and each line is five time fields plus a command.

**The five fields.** Minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6). A \`*\` means "every". So \`0 2 * * *\` is "at 02:00 every day", and \`*/15 * * * *\` is "every 15 minutes". \`crontab -l\` lists your jobs.

**The minimal environment trap.** cron runs jobs with a bare environment and a short PATH, not your interactive shell setup. A command that works when you type it can fail under cron because a tool is not on cron PATH or an environment variable is missing. The fixes: use absolute paths, set PATH at the top of the crontab, and source any needed env explicitly.

**Capture the output.** cron mails job output to a mailbox nobody reads, so failures stay invisible. Redirect to a log instead: \`... >> /var/log/job.log 2>&1\` captures both stdout and stderr where you can see them. (systemd timers are a modern alternative with better logging.)`,
      production:
        'Backups, cleanups, report generation, and cert renewals are classic cron jobs, and "the cron job silently stopped working" is a classic incident. Absolute paths plus logging output (2>&1 to a file) prevent both the environment trap and the silent-failure trap.',
      walkthrough: [
        'Edit and list jobs with crontab -e and -l.',
        'Read the five time fields.',
        'Avoid the minimal-environment trap with absolute paths.',
        'Capture output to a log instead of email.',
      ],
      questions: [
        'What do the five cron fields mean?',
        'Why does a cron job that works by hand fail on schedule?',
        'How do you avoid silent cron failures?',
      ],
      checklist: [
        'Write a cron schedule expression.',
        'Use absolute paths in a job.',
        'Redirect job output to a log.',
      ],
      interactive: {
        coldOpen:
          'Your backup runs flawlessly when you type it, so you put it in cron and forget it. Months later you need the backup and the directory is empty: cron ran the job every night with a stripped-down PATH that could not find the tool, and mailed the error to a void. cron is simple to write and infamous for silent failure, and two habits prevent almost all of it.',
        mental:
          'cron runs commands on a schedule set by five time fields. The catch: it runs them in a minimal environment, so use absolute paths and redirect output to a log so failures are visible.',
        diagram: {
          nodes: ['crontab -e: edit jobs', '5 fields: min hr dom mon dow', 'cron runs on schedule', 'log output: >> file 2>&1'],
          explanations: [
            'Edit your personal job table.',
            'Minute, hour, day-of-month, month, day-of-week; * = every.',
            'cron fires the command when the time matches, in a bare environment.',
            'Redirect stdout and stderr to a file so failures are not silent.',
          ],
        },
        example: {
          code: '# crontab -e\n# min hour dom mon dow  command\n0   2    *   *   *   /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1\n*/15 *   *   *   *   /usr/bin/curl -s https://health/ping >> /var/log/ping.log 2>&1\n\n$ crontab -l        # list jobs\n$ crontab -e        # edit jobs',
          output:
            '0 2 * * *    -> 02:00 every day\n*/15 * * * * -> every 15 minutes\nabsolute path -> survives cron minimal PATH\n>> log 2>&1   -> capture stdout + stderr where you can read it',
          explain:
            'Both jobs use absolute paths (so cron can find the command) and redirect both streams to a log (so a failure leaves a trace instead of vanishing into mail).',
        },
        build: {
          simple: 'cron runs commands on a five-field schedule; log the output.',
          actually:
            'Fields support lists (1,15), ranges (1-5), and steps (*/10). Day-of-month and day-of-week together are an OR, which surprises people. The crontab runs with a minimal PATH (often just /usr/bin:/bin) and no ~/.bashrc, so interactive aliases and functions do not exist. systemd timers are the modern alternative: they log to the journal, support dependencies and randomized delays, and are easier to monitor.',
          breaks:
            'A bare command (backup.sh) instead of an absolute path fails because cron PATH does not include your directory. % characters in a cron command are special and must be escaped. Forgetting 2>&1 captures only stdout, so errors (on stderr) are lost. A job that overruns its interval can pile up overlapping runs unless you add a lock (flock).',
        },
        doThisNow: [
          {
            task: 'Read your current crontab and practice writing schedule expressions (no install needed).',
            command: 'crontab -l 2>/dev/null || echo "(no crontab yet)"; echo "--- decode these ---"; echo "0 0 * * 0  = midnight on Sunday"; echo "30 8 1 * * = 08:30 on the 1st of each month"; echo "*/5 * * * * = every 5 minutes"',
            reveal:
              'crontab -l shows your jobs (or none yet). The decoded examples are the five fields in action: day-of-week 0 is Sunday, */5 is a step. Reading these fluently is most of using cron.',
          },
          {
            task: 'Prove the environment trap idea: compare your interactive PATH with a minimal one like cron gets.',
            command: 'echo "interactive PATH: $PATH"; env -i /bin/sh -c \'echo "minimal PATH: $PATH"; which curl || echo "curl not found in minimal env"\'',
            reveal:
              'Your interactive PATH is long; the minimal environment (env -i, similar to cron) has a tiny PATH and may not find curl at all. That is exactly why cron jobs need absolute paths or an explicit PATH set in the crontab.',
          },
        ],
        warStory:
          'A TLS certificate auto-renewal ran in cron and "worked" for a year, then the site went down with an expired cert. The renew command had started failing months earlier because of a PATH change, but the error was mailed to an unmonitored local mailbox. A single >> /var/log/renew.log 2>&1 would have made the failures visible. Always capture cron output.',
        tweak: {
          instruction: 'Write a cron line that runs /opt/app/cleanup.sh every day at 3:30 AM and logs everything.',
          reveal:
            '30 3 * * * /opt/app/cleanup.sh >> /var/log/cleanup.log 2>&1. Minute 30, hour 3, every day-of-month/month/day-of-week, absolute path, both streams to a log.',
        },
        receipt: {
          explain: [
            'cron schedules with five fields: minute, hour, day-of-month, month, day-of-week.',
            'Use absolute paths (minimal PATH) and >> log 2>&1 (avoid silent failure).',
          ],
          command: 'crontab -l 2>/dev/null || echo "no crontab"',
          question: 'cron starts one-off jobs. How do long-running services get started, kept alive, and logged?',
        },
        recap: [
          'crontab -e edits jobs; five fields set the schedule.',
          'cron has a minimal environment: use absolute paths.',
          'Redirect output (2>&1 to a log) or failures stay silent.',
        ],
      },
    },

    {
      id: 'linux-rung-systemd',
      title: 'Module 22: Services and Logs (systemd, journalctl)',
      type: 'lesson',
      difficulty: 'Hard',
      minutes: 13,
      prompt: 'Explain what systemd manages, the commands to start/stop/enable a service, and how to read its logs.',
      explanation: `On most modern Linux systems, systemd starts services at boot, keeps them running, restarts them on failure, and collects their logs. You drive it with \`systemctl\` and read logs with \`journalctl\`.

**Managing a service.** \`systemctl status nginx\` shows whether it is running, its recent logs, and its PID. \`start\`, \`stop\`, and \`restart\` do what they say; \`reload\` re-reads config without a full restart. \`enable\` makes a service start at boot (\`disable\` undoes it); \`is-enabled\` and \`is-active\` answer yes/no.

**A unit defines the service.** A small unit file (in /etc/systemd/system) declares what to run, which user to run as (\`User=\`), and a restart policy (\`Restart=on-failure\`). After editing one, \`systemctl daemon-reload\` reloads the definitions.

**Logs via journalctl.** systemd captures each service stdout/stderr into the journal. \`journalctl -u nginx\` shows that service logs, \`-f\` follows them live, \`-e\` jumps to the end, \`--since "1 hour ago"\` filters by time, and \`-p err\` filters by priority. This is the first place to look when a service will not start.`,
      production:
        'Running an app under systemd (the right user, restart-on-failure, logs in the journal) is the standard way to operate a service on a Linux host. status plus journalctl -u is the muscle-memory pair for "the service is down": is it running, and what does its log say.',
      walkthrough: [
        'Check a service with systemctl status.',
        'Start, stop, restart, reload, and enable services.',
        'Explain a unit file (User=, Restart=).',
        'Read logs with journalctl -u, -f, --since.',
      ],
      questions: [
        'What is the difference between start and enable?',
        'What does systemctl status show you?',
        'How do you follow a service logs live?',
      ],
      checklist: [
        'Read a service status.',
        'Start/restart and enable a service.',
        'Tail and filter logs with journalctl.',
      ],
      interactive: {
        coldOpen:
          'A service is down. Two commands answer almost everything: systemctl status app tells you if it is running, when it died, and why; journalctl -u app -e shows its last log lines. Before this, "the service crashed" was a mystery; with systemd it is a status line and a log you read in ten seconds.',
        mental:
          'systemd starts, supervises, restarts, and logs services. systemctl controls them (start/stop/enable); journalctl reads their logs. "Is it running, and what did it say" is status + journalctl -u.',
        diagram: {
          nodes: ['systemctl start/restart', 'systemctl enable (boot)', 'systemd supervises + restarts', 'journalctl -u: read logs'],
          explanations: [
            'Control a running service now.',
            'enable makes it start automatically at boot.',
            'systemd keeps it alive and restarts it on failure per its policy.',
            'journalctl reads the service captured stdout/stderr.',
          ],
        },
        example: {
          code: '$ systemctl status nginx\n● nginx.service - A high performance web server\n   Active: active (running) since Sat 14:02; 3h ago\n Main PID: 812 (nginx)\n$ sudo systemctl restart nginx\n$ sudo systemctl enable nginx        # start at boot\n$ journalctl -u nginx -e --no-pager | tail -3\nnginx[812]: started worker process\n$ journalctl -u nginx -f             # follow live',
          output:
            'status   -> running? since when? PID? recent logs\nrestart  -> stop then start now\nenable   -> start automatically at every boot\njournalctl -u nginx -> that service logs; -f follows, -e jumps to end',
          explain:
            'status answered "is it up and since when"; enable made it survive reboots (different from a one-time start); journalctl -u showed the service own log stream, the first place to look when it misbehaves.',
        },
        build: {
          simple: 'systemctl controls services; journalctl reads their logs.',
          actually:
            'start/stop act now; enable/disable control boot behavior; they are independent (a service can be enabled but stopped, or running but not enabled). A unit file sets ExecStart, User= (run unprivileged), Restart=on-failure, and environment; after editing, systemctl daemon-reload picks up changes. journalctl filters by unit (-u), time (--since/--until), priority (-p err), and boot (-b); it is persistent across restarts if configured.',
          breaks:
            'start without enable means the service runs now but does not come back after a reboot, a classic "it was fine until the server restarted". Editing a unit file without daemon-reload runs the old definition. Running the service as root in the unit (no User=) makes any compromise a full takeover. journalctl without -u dumps the whole system journal, which is overwhelming; always scope by unit.',
        },
        doThisNow: [
          {
            task: 'If you are on a systemd Linux box, inspect a real service and read its recent logs (safe, read-only).',
            command: 'systemctl --version 2>/dev/null | head -1 && systemctl status systemd-journald --no-pager 2>/dev/null | head -8 && journalctl -u systemd-journald -n 5 --no-pager 2>/dev/null || echo "(not a systemd system, e.g. macOS) - on Linux: systemctl status <svc>; journalctl -u <svc> -e"',
            reveal:
              'On a systemd host you see the journald service status (active, since, PID) and its last five log lines via journalctl -u. That status + journalctl -u pair is exactly how you triage any down service. (macOS uses launchctl/log instead; the concepts map.)',
          },
          {
            task: 'Reason about start vs enable: predict what survives a reboot.',
            command: 'echo "systemctl start app   -> running now, NOT after reboot"; echo "systemctl enable app  -> starts at boot, not necessarily now"; echo "enable --now app      -> both: start now AND at boot"',
            reveal:
              'start and enable are independent: start affects now, enable affects boot. The common mistake is start without enable, so the service vanishes after the next reboot. systemctl enable --now does both at once.',
          },
        ],
        warStory:
          'A team manually started a new service with systemctl start app after deploy and it ran fine for weeks, until a routine kernel update rebooted the box and the service never came back, because it was never enabled. The site was down until someone ran systemctl enable app. start is for now; enable is for boot, and you almost always want both.',
        tweak: {
          instruction: 'A service is "running fine" but disappears after every reboot. What did the operator forget?',
          reveal:
            'systemctl enable (or enable --now). They started it but never enabled it, so systemd does not launch it at boot. enable makes it start automatically on every boot.',
        },
        receipt: {
          explain: [
            'systemd starts, supervises, and logs services; systemctl controls them.',
            'start = now, enable = at boot; journalctl -u reads a service logs.',
          ],
          command: 'systemctl --version 2>/dev/null | head -1 || echo "not systemd here"',
          question: 'You can run and inspect almost anything now. How do you get help on a command and move faster every day?',
        },
        recap: [
          'systemctl start/stop/restart/reload control services; enable = at boot.',
          'A unit file sets User= and Restart=; daemon-reload after edits.',
          'journalctl -u reads a service logs; -f follows, --since filters.',
        ],
      },
    },

    {
      id: 'linux-rung-help',
      title: 'Module 23: Getting Help and Moving Fast (man, --help, history, alias)',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 10,
      prompt: 'Name the two ways to look up what a command does without leaving the terminal, and two habits that make you faster every day.',
      explanation: `You do not memorize every flag; you look them up fast and build shortcuts. \`man\` and \`--help\` answer "what does this do", and \`history\` plus \`alias\` make you faster.

**man and --help.** \`man ls\` opens the manual page (it uses less: /search, q to quit). \`ls --help\` prints a shorter usage summary inline, which is quicker for a flag reminder. \`apropos word\` searches man pages by keyword when you do not know the command name.

**history and recall.** \`history\` lists your past commands; \`Ctrl-R\` searches them interactively (type a few letters of an old command and it appears); \`!!\` reruns the last command, handy as \`sudo !!\` after a permission error. Up-arrow walks recent commands.

**aliases and completion.** \`alias ll='ls -la'\` makes a short name for a long command; put aliases in \`~/.bashrc\` to keep them. Tab completion finishes file names and commands as you type. These small habits compound into real speed.`,
      production:
        'Senior engineers are not faster because they memorized more flags; they are faster because they look things up instantly (man, --help), recall past commands (Ctrl-R), and have built muscle-memory aliases. Fluency is a set of small habits, not encyclopedic recall.',
      walkthrough: [
        'Look up a command with man and --help.',
        'Search past commands with history and Ctrl-R.',
        'Rerun with !! and sudo !!.',
        'Create an alias and persist it.',
      ],
      questions: [
        'When would you use --help instead of man?',
        'What does Ctrl-R do?',
        'How do you make an alias permanent?',
      ],
      checklist: [
        'Read a man page and quit it.',
        'Recall a past command with Ctrl-R.',
        'Create and persist an alias.',
      ],
      interactive: {
        coldOpen:
          'Watch a fluent engineer and you will not see them recalling flags from memory. You will see man and --help for the exact option, Ctrl-R to pull back a command from last Tuesday, sudo !! after a permission error, and a handful of aliases for the things they type all day. Speed on the command line is a few habits, and you can adopt them today.',
        mental:
          'Look it up (man, --help), recall it (history, Ctrl-R, !!), and shorten it (alias, tab completion). Fluency is habits, not memorization.',
        diagram: {
          nodes: ['man / --help: look up', 'history / Ctrl-R: recall', '!! / sudo !!: rerun', 'alias: shorten'],
          explanations: [
            'Read what a command and its flags do without leaving the terminal.',
            'Find and reuse commands you ran before.',
            'Rerun the last command, optionally with sudo.',
            'Give long commands short, memorable names.',
          ],
        },
        example: {
          code: '$ ls --help | head -3\nUsage: ls [OPTION]... [FILE]...\n$ man grep            # full manual; /flag to search, q to quit\n$ cat /etc/hosts\n... permission stuff ...\n$ sudo !!             # reruns: sudo cat /etc/hosts\n$ alias ll=\'ls -la\'\n$ ll\n(drwxr-xr-x ... full long listing)',
          output:
            '--help   -> quick inline usage summary\nman      -> full manual page (opens in less)\nsudo !!  -> rerun the previous command with sudo\nalias ll -> ll now expands to ls -la',
          explain:
            'sudo !! reran the previous command (cat) with sudo after a permission error, no retyping. The alias turned a frequent long command into two letters.',
        },
        build: {
          simple: 'man/--help explain commands; history/Ctrl-R recall them; alias shortens them.',
          actually:
            'man pages have numbered sections (man 5 crontab is the file format, man 1 crontab the command). Ctrl-R searches history incrementally; press it again to cycle older matches. History expansion: !! is the last command, !$ the last argument, !abc the last command starting with abc. Aliases live only in the current shell unless saved in ~/.bashrc; for anything with logic, a shell function or script is better than an alias.',
          breaks:
            'An alias defined in the terminal vanishes when it closes unless added to a startup file. Aliases do not take arguments in the middle (use a function for that). Up-arrow and Ctrl-R only see history that has been written, which by default happens on shell exit, so commands from another still-open tab may not appear yet. man pages can be long; --help is faster for a quick flag check.',
        },
        doThisNow: [
          {
            task: 'Look up a command two ways and time which is faster for a quick flag check.',
            command: 'ls --help 2>/dev/null | head -5 || man ls | head -5; echo "--- search man by keyword ---"; apropos directory 2>/dev/null | head -3 || echo "(apropos may be unindexed on macOS)"',
            reveal:
              '--help prints a quick usage summary inline; man is the full reference (open it with man ls and press q to quit). apropos searches man pages by keyword when you do not know the command name. For a fast flag reminder, --help usually wins.',
          },
          {
            task: 'Create an alias, use it, and recall a past command from history.',
            command: 'alias ll=\'ls -la\'; ll /tmp | head -3; echo "--- recent history ---"; history 2>/dev/null | tail -5 || fc -l | tail -5',
            reveal:
              'll now runs ls -la (this session only; add it to ~/.bashrc to keep it). history (or fc -l) shows recent commands; in an interactive shell, Ctrl-R searches them as you type, and !! reruns the last one. Those habits save thousands of keystrokes.',
          },
        ],
        warStory:
          'A junior engineer retyped a long kubectl command dozens of times a day from notes. A teammate showed them Ctrl-R (to recall it instantly) and an alias for the common prefix. Their throughput visibly jumped, not because they learned more commands, but because they stopped retyping the ones they already knew. The fluency was in the habits.',
        tweak: {
          instruction: 'You define alias gs=\'git status\' and love it, but it is gone after you close the terminal. Why, and the fix?',
          reveal:
            'Aliases set in a shell are not persistent. Add the line alias gs=\'git status\' to your ~/.bashrc (or ~/.zshrc) so every new shell defines it.',
        },
        receipt: {
          explain: [
            'man and --help explain any command; apropos searches by keyword.',
            'Ctrl-R recalls past commands; alias (in ~/.bashrc) shortens frequent ones.',
          ],
          command: 'ls --help 2>/dev/null | head -2 || man -f ls',
          question: 'You have a full command-line toolkit now. Which workflows will you turn into scripts, and which servers will you operate with systemd and cron?',
        },
        recap: [
          'man and --help answer "what does this do"; apropos finds commands.',
          'history, Ctrl-R, and !! recall and rerun past commands.',
          'alias (saved in ~/.bashrc) and tab completion make you faster.',
        ],
      },
    },
  ],
}
