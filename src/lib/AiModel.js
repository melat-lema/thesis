const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const courseOutline = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a study material for Python for an Exam and level of difficulty will be Easy with summary of course, list of Chapter along with summary for each chapter, Topic list in each chapter in  All in Json format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "course_name": "Introduction to Python Programming",\n  "difficulty": "Easy",\n  "course_summary": "This course provides a gentle introduction to Python programming, covering fundamental concepts and syntax. It is designed for beginners with no prior programming experience, focusing on building a solid foundation for further learning. You\'ll learn how to write simple programs, work with data, and understand basic programming logic.",\n  "chapters": [\n    {\n      "chapter_number": 1,\n      "chapter_title": "Getting Started with Python",\n      "chapter_summary": "This chapter introduces the Python programming language, how to set up your environment, and write your first basic program. It covers the essential tools and concepts needed to begin coding.",\n      "topics": [\n        "What is Python?",\n        "Why learn Python?",\n        "Setting up the Python environment (Installation, IDE/Text Editor)",\n        "Writing your first Python program (Hello, World!)",\n        "Running Python programs",\n          "Understanding basic Python Syntax"\n        \n      ]\n    },\n    {\n      "chapter_number": 2,\n      "chapter_title": "Variables and Data Types",\n      "chapter_summary": "This chapter introduces the concept of variables, and basic data types including numbers, strings and booleans. It will allow the student to store and manipulate information in Python",\n      "topics": [\n        "What are variables?",\n        "Declaring and assigning variables",\n        "Data types: Integers (int), Floating-point numbers (float), Strings (str), Booleans (bool)",\n        "Basic operations on data types (+, -, *, /, %, string concatenation)",\n        "Type conversion (casting)"\n      ]\n    },\n    {\n      "chapter_number": 3,\n      "chapter_title": "Input and Output",\n      "chapter_summary": "This chapter teaches how to interact with the user, to display information on the screen and receive input from the user. This will enable the student to write interactive programs.",\n      "topics": [\n        "The `print()` function for output",\n        "Formatting output using f-strings",\n        "The `input()` function for user input",\n        "Working with user input strings"\n      ]\n    },\n      {\n          "chapter_number": 4,\n          "chapter_title": "Basic Operators and Expressions",\n          "chapter_summary": "This chapter teaches about operators like arthimetic, comparison and logical. This will enable the student to create complex expressions and perform operations based on conditions.",\n           "topics":[\n               "Arithmetic Operators (+, -, *, /, %, **, //)",\n                "Comparison Operators (==, !=, >, <, >=, <=)",\n               "Logical Operators (and, or, not)",\n               "Operator precedence",\n               "Writing expressions in Python"\n               ]\n      },\n    {\n      "chapter_number": 5,\n      "chapter_title": "Conditional Statements",\n      "chapter_summary": "This chapter will help you make decisions in programs, based on conditions. The students will use the `if`, `elif` and `else` keywords to control the flow of the program.",\n      "topics": [\n          "The `if` statement",\n          "The `if-else` statement",\n        "The `if-elif-else` statement",\n        "Nested `if` statements",\n          "Simple conditional logic examples"\n      ]\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const GenerateNotesModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate notes material detail content for each chapter, make sure to include all topic points in the content and make sure to give the output in pure HTML format. (Do not Add HTML, Head, Body, title tag), the chapters are:

{"emoji":"🔍","chapter_number":3,"chapter_summary":"This chapter teaches you how to navigate open-source projects on platforms like GitHub. You'll learn how to read project documentation, identify areas to contribute, and effectively communicate with maintainers.","chapter_title":"Finding and Understanding Projects","topics":["Exploring Projects on GitHub","Reading Project README files","Understanding Project Structure","Finding Issues to Work On","Understanding Project Coding Style and Contribution Guidelines"]}`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `<!-- Pure HTML formatted chapter content with relevant emojis -->
<div class="chapter">
  <h2 class="chapter-title">
    <span class="emoji">🔍</span> Chapter 3: Finding and Understanding Projects
  </h2>
  <p class="chapter-summary">
    This chapter teaches you how to navigate open-source projects on platforms like GitHub. You'll learn how to read project documentation, identify areas to contribute, and effectively communicate with maintainers.
  </p>

  <div class="topic">
    <h3>🌐 Exploring Projects on GitHub</h3>
    <p>GitHub is a vast platform hosting countless open-source projects. Effective exploration is key to finding projects that align with your interests and skills.</p>
    <ul>
      <li><strong>Using the Search Function:</strong> Use keywords related to your interests (e.g., "Python web framework", "machine learning").</li>
      <li><strong>Filtering Search Results:</strong> Narrow down by language, stars, and topics.</li>
      <li><strong>Trending Repositories:</strong> Check GitHub's "Trending" to see active and popular projects.</li>
      <li><strong>Topic Pages:</strong> Browse GitHub’s topic pages by technology or domain.</li>
      <li><strong>Following Devs/Orgs:</strong> Follow profiles contributing to projects you like.</li>
      <li><strong>Starring & Watching:</strong> Save repos and subscribe to updates.</li>
    </ul>
  </div>

  <div class="topic">
    <h3>📖 Reading Project README Files</h3>
    <p>The README file is your first gateway into understanding a project. It contains all the key details to get you started.</p>
    <ul>
      <li><strong>Purpose and Goals:</strong> Understand what the project is built to solve.</li>
      <li><strong>Installation:</strong> Setup instructions for your local machine.</li>
      <li><strong>Usage Examples:</strong> How to use the features, often with code snippets.</li>
      <li><strong>Contribution Guidelines:</strong> Rules for contributing code or ideas.</li>
      <li><strong>Licensing:</strong> Open-source license info (e.g., MIT, GPL).</li>
      <li><strong>Dependencies:</strong> Other libraries or tools the project depends on.</li>
      <li><strong>Status:</strong> Whether it’s maintained, archived, or in alpha.</li>
      <li><strong>Contact:</strong> How to reach maintainers or community channels.</li>
    </ul>
  </div>

  <div class="topic">
    <h3>🏗️ Understanding Project Structure</h3>
    <p>A well-organized structure is critical for collaboration and navigation.</p>
    <ul>
      <li><strong>Source Code:</strong> Usually in <code>src/</code> or <code>lib/</code>.</li>
      <li><strong>Tests:</strong> In folders like <code>tests/</code> or <code>__tests__/</code>.</li>
      <li><strong>Docs:</strong> Manuals and API documentation in <code>docs/</code>.</li>
      <li><strong>Config Files:</strong> E.g., <code>.env</code>, <code>settings.py</code>, <code>package.json</code>.</li>
      <li><strong>Examples:</strong> Sample usage files or apps.</li>
      <li><strong>Build Tools:</strong> Scripts like <code>Makefile</code>, <code>Dockerfile</code>, or <code>pom.xml</code>.</li>
    </ul>
  </div>

  <div class="topic">
    <h3>🐛 Finding Issues to Work On</h3>
    <p>Start small. Browse issues, especially beginner-friendly ones, to ease into contribution.</p>
    <ul>
      <li><strong>Issue Tracker:</strong> Check the “Issues” tab on GitHub.</li>
      <li><strong>Labels:</strong> Look for <code>good first issue</code>, <code>help wanted</code>, etc.</li>
      <li><strong>Keywords:</strong> Use skills or topic-specific terms.</li>
      <li><strong>Description:</strong> Read carefully to understand what's needed.</li>
      <li><strong>Comments:</strong> See past discussions for context.</li>
      <li><strong>Questions:</strong> Don't hesitate to ask clarifying questions.</li>
    </ul>
  </div>

  <div class="topic">
    <h3>🧑‍💻 Understanding Project Coding Style and Contribution Guidelines</h3>
    <p>Every repo has its style and process. Learn it, follow it, and you’ll fit in seamlessly.</p>
    <ul>
      <li><strong>Style Guides:</strong> e.g., PEP8 for Python, or project-specific rules.</li>
      <li><strong>Linters & Formatters:</strong> Tools like ESLint, Prettier, or Black.</li>
      <li><strong>Commit Messages:</strong> Use proper structure, e.g., Conventional Commits.</li>
      <li><strong>PR Process:</strong> Understand the steps for submitting a PR.</li>
      <li><strong>Testing:</strong> Know what kind of test coverage is expected.</li>
      <li><strong>Branch Naming:</strong> Follow patterns like <code>feature/</code> or <code>fix/</code>.</li>
    </ul>
  </div>
</div>`,
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
