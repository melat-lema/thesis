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
          text: 'Generate notes material detail content for each chapter, make sure to include all topic points in the content and make sure to give the output in pure HTML format. (Do not Add HTMLK, Head, Body, title tag), the chapters are:\n\n{"black_emoji":"⚫","chapter_number":3,"chapter_summary":"This chapter teaches you how to navigate open-source projects on platforms like GitHub. You\'ll learn how to read project documentation, identify areas to contribute, and effectively communicate with maintainers.","chapter_title":"Finding and Understanding Projects","topics":["Exploring Projects on GitHub","Reading Project README files","Understanding Project Structure","Finding Issues to Work On","Understanding Project Coding Style and Contribution Guidelines"]}',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```html\n<div class="chapter">\n  <h2 class="chapter-title">\n    <span class="black_emoji">⚫</span> Chapter 3: Finding and Understanding Projects\n  </h2>\n  <p class="chapter-summary">\n    This chapter teaches you how to navigate open-source projects on platforms like GitHub. You\'ll learn how to read project documentation, identify areas to contribute, and effectively communicate with maintainers.\n  </p>\n\n  <div class="topic">\n    <h3>Exploring Projects on GitHub</h3>\n    <p>\n      GitHub is a vast platform hosting countless open-source projects. Effective exploration is key to finding projects that align with your interests and skills.\n    </p>\n    <ul>\n      <li><strong>Using the Search Function:</strong> Utilize GitHub\'s search bar with specific keywords related to your interests (e.g., "Python web framework", "machine learning").</li>\n       <li><strong>Filtering Search Results:</strong> Narrow down results using filters like language, number of stars, and topics.</li>\n        <li><strong>Exploring Trending Repositories:</strong> Check the "Trending" section to discover active and popular projects.</li>\n        <li><strong>Browsing by Topic:</strong> Navigate GitHub\'s topic pages to find projects categorized by specific areas.</li>\n         <li><strong>Following Developers and Organizations:</strong> Observe the projects contributed to by developers or organizations you admire.</li>\n         <li><strong>Starring and Watching Repositories:</strong> Save projects you find interesting for future reference and receive updates on changes.</li>\n    </ul>\n  </div>\n\n  <div class="topic">\n    <h3>Reading Project README files</h3>\n    <p>\n      The README file is usually the first point of contact with a project. It contains essential information.\n    </p>\n    <ul>\n      <li><strong>Purpose and Goals:</strong> Understand what the project aims to achieve.</li>\n        <li><strong>Installation Instructions:</strong> Learn how to set up and run the project locally.</li>\n        <li><strong>Usage Examples:</strong> See basic examples of how to use the project\'s features.</li>\n        <li><strong>Contribution Guidelines:</strong> Find information on how to contribute to the project.</li>\n        <li><strong>License Information:</strong> Be aware of the project\'s licensing terms.</li>\n       <li><strong>Dependencies:</strong> Note what other software or libraries the project relies on.</li>\n       <li><strong>Project Status:</strong> Get an idea of the project\'s current state (active, maintained, archived).</li>\n        <li><strong>Contact Information:</strong> Look for details on how to get in touch with the project maintainers.</li>\n    </ul>\n  </div>\n\n  <div class="topic">\n    <h3>Understanding Project Structure</h3>\n     <p>\n      A consistent project structure makes navigation easier and facilitates collaboration.\n    </p>\n    <ul>\n      <li><strong>Source Code Directories:</strong> Usually named `src`, `lib`, or the like; contains the core code of the project.</li>\n      <li><strong>Test Directories:</strong> Often named `test` or `tests`; contains tests used to verify the project\'s functionalities.</li>\n      <li><strong>Documentation Folders:</strong>  May have folders like `docs`, often containing README files, user manuals and API documentations.</li>\n      <li><strong>Configuration Files:</strong> Look for files like `config.ini`, `settings.py`, or `.env` that control how the project runs.</li>\n      <li><strong>Example Files:</strong> May have directories containing example code demonstrating how to use the project.</li>\n      <li><strong>Build Files:</strong>  Such as `Makefile` or `pom.xml`, which are used for building and deploying the software.</li>\n    </ul>\n  </div>\n\n  <div class="topic">\n    <h3>Finding Issues to Work On</h3>\n    <p>\n      Contributing to open-source often starts by addressing existing issues.\n    </p>\n    <ul>\n        <li><strong>Browsing the Issue Tracker:</strong> Navigate to the "Issues" tab on the project\'s GitHub page.</li>\n         <li><strong>Filtering by Labels:</strong> Use labels like `good first issue`, `help wanted`, or `bug` to find suitable tasks.</li>\n          <li><strong>Searching for Keywords:</strong>  Search issues using keywords related to your interests or skills.</li>\n          <li><strong>Understanding Issue Descriptions:</strong> Carefully read the issue description to ensure a full understanding of the problem and expected solution.</li>\n          <li><strong>Analyzing Existing Discussions:</strong> Read all comments and discussions to grasp the context of the problem and any possible solutions.</li>\n        <li><strong>Asking Clarifying Questions:</strong>  If you have doubts, feel free to ask for more information from the maintainers.</li>\n      </ul>\n  </div>\n\n  <div class="topic">\n     <h3>Understanding Project Coding Style and Contribution Guidelines</h3>\n    <p>\n      Adhering to the project\'s coding style and contribution guidelines ensures consistency and smooth merging of code.\n    </p>\n    <ul>\n       <li><strong>Coding Style Guides:</strong>  Look for style guides like PEP 8 for Python, or coding style guidelines defined in the `CONTRIBUTING.md` file.</li>\n       <li><strong>Linting and Formatting Tools:</strong>  Note any linting tools or formatters (e.g., linters, Black formatter) used by the project.</li>\n       <li><strong>Commit Message Conventions:</strong> Adhere to the project\'s commit message style guidelines.</li>\n        <li><strong>Pull Request Process:</strong>  Understand the pull request process for submitting contributions.</li>\n         <li><strong>Testing Requirements:</strong> Note whether any specific unit or integration tests are required.</li>\n         <li><strong>Branching Strategy:</strong> Follow the branch naming conventions and branching strategy outlined by the project.</li>\n    </ul>\n  </div>\n</div>\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
