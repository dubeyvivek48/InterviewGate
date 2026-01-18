export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questions: Question[] = [
  // HTML & CSS Questions (5 questions) - 4 years experience level
  {
    id: 1,
    question: "What is the difference between 'margin' and 'padding' in CSS?",
    options: [
      "Margin is inside the box, padding is outside",
      "Margin is outside the box, padding is inside",
      "They are the same thing",
      "Margin applies only to divs, padding to all elements",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which HTML5 semantic tag should be used for navigation links?",
    options: ["<div class='nav'>", "<nav>", "<section>", "<article>"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the CSS Box Model order from inside to outside?",
    options: [
      "Border, Margin, Padding, Content",
      "Content, Padding, Border, Margin",
      "Padding, Border, Content, Margin",
      "Margin, Border, Padding, Content",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question:
      "Which CSS property is used to control the stacking order of elements?",
    options: ["order", "z-index", "stack", "layer"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What does 'rem' unit stand for in CSS?",
    options: [
      "Relative element measurement",
      "Root em",
      "Responsive em",
      "Remote element",
    ],
    correctAnswer: 1,
  },

  // JavaScript Questions (10 questions) - 4 years experience level
  {
    id: 6,
    question: "What is the difference between 'let', 'const', and 'var'?",
    options: [
      "No difference, they're interchangeable",
      "let and const are block-scoped, var is function-scoped",
      "var and let are the same, const is different",
      "Only var should be used in modern JavaScript",
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What does the 'this' keyword refer to in JavaScript?",
    options: [
      "Always the global object",
      "The object that the method is called on",
      "The current function",
      "Always undefined",
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: "What is event delegation in JavaScript?",
    options: [
      "Adding event listeners to all child elements",
      "Using a single event listener on a parent to handle events on children",
      "Removing event listeners from elements",
      "Creating new events and dispatching them",
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that ends",
      "A function that has access to variables from its outer scope",
      "A JavaScript error",
      "A way to close a browser window",
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "They are the same",
      "== compares values, === compares values and types",
      "=== is faster than ==",
      "== checks only the type, === checks only the value",
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "What is the purpose of async/await in JavaScript?",
    options: [
      "To make synchronous code asynchronous",
      "To handle asynchronous code in a more readable way",
      "To pause all execution",
      "To replace promises completely",
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: "What is the spread operator (...) used for?",
    options: [
      "Multiplying numbers",
      "Expanding arrays/objects into individual elements",
      "Creating comments",
      "Ending a statement",
    ],
    correctAnswer: 1,
  },
  {
    id: 13,
    question: "What is destructuring in JavaScript?",
    options: [
      "Breaking down an object or array into individual variables",
      "Deleting properties from objects",
      "Creating new objects",
      "Sorting arrays",
    ],
    correctAnswer: 1,
  },
  {
    id: 14,
    question: "What is a callback function?",
    options: [
      "A function that calls itself",
      "A function passed to another function to be executed later",
      "A function that returns a value",
      "A function that handles errors",
    ],
    correctAnswer: 1,
  },
  {
    id: 15,
    question:
      "What is the difference between map() and forEach() in JavaScript?",
    options: [
      "They do the same thing",
      "map() returns a new array, forEach() doesn't return anything",
      "forEach() is faster",
      "map() only works with numbers",
    ],
    correctAnswer: 1,
  },

  // React Questions (10 questions) - 4 years experience level
  {
    id: 16,
    question: "What is the purpose of the useEffect hook in React?",
    options: [
      "To style components",
      "To handle side effects and lifecycle events",
      "To manage component state",
      "To create animations",
    ],
    correctAnswer: 1,
  },
  {
    id: 17,
    question: "How do you pass props from parent to child component in React?",
    options: [
      "Using global variables",
      "As attributes on the component element",
      "Using callbacks",
      "Props cannot be passed between components",
    ],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: "What is the difference between state and props in React?",
    options: [
      "No difference, they're the same",
      "State is mutable and owned by component, props are immutable and passed from parent",
      "Props are mutable, state is immutable",
      "Only state can be used in functional components",
    ],
    correctAnswer: 1,
  },
  {
    id: 19,
    question: "What is a custom hook in React?",
    options: [
      "A hook that can't be reused",
      "A reusable function that uses React hooks",
      "A hook provided by React library",
      "A hook used only in class components",
    ],
    correctAnswer: 1,
  },
  {
    id: 20,
    question: "What is the purpose of keys in React lists?",
    options: [
      "To style list items",
      "To identify which items have changed for efficient re-rendering",
      "To prevent duplicate items",
      "Keys are not necessary in React lists",
    ],
    correctAnswer: 1,
  },
  {
    id: 21,
    question: "What is the React Context API used for?",
    options: [
      "Creating animations",
      "Sharing data between components without prop drilling",
      "Managing browser history",
      "Styling components",
    ],
    correctAnswer: 1,
  },
  {
    id: 22,
    question: "What is reconciliation in React?",
    options: [
      "Resolving conflicts in code",
      "The process React uses to update the DOM efficiently",
      "Creating new components",
      "Deleting unused components",
    ],
    correctAnswer: 1,
  },
  {
    id: 23,
    question: "What is the purpose of useState hook in React?",
    options: [
      "To fetch data from APIs",
      "To manage component state in functional components",
      "To create refs",
      "To handle form submissions",
    ],
    correctAnswer: 1,
  },
  {
    id: 24,
    question:
      "What is the difference between controlled and uncontrolled components?",
    options: [
      "Controlled components are faster",
      "Controlled: React manages form state, Uncontrolled: DOM manages state",
      "They are the same thing",
      "Uncontrolled components are better",
    ],
    correctAnswer: 1,
  },
  {
    id: 25,
    question: "What is lazy loading in React?",
    options: [
      "Delaying the loading of a page",
      "Code splitting and loading components only when needed",
      "Slow network loading",
      "Caching data",
    ],
    correctAnswer: 1,
  },

  // Code Output Prediction Questions (10 questions)
  {
    id: 26,
    question:
      "What will be the output of this JavaScript code?\nconst x = 5;\nconst y = '5';\nconsole.log(x == y);",
    options: ["false", "true", "undefined", "Error"],
    correctAnswer: 1,
  },
  {
    id: 27,
    question:
      "What will be the output?\nconst arr = [1, 2, 3];\narr.map(x => x * 2);\nconsole.log(arr);",
    options: ["[2, 4, 6]", "[1, 2, 3]", "undefined", "Error"],
    correctAnswer: 1,
  },
  {
    id: 28,
    question:
      "What will be the output?\nfunction test() {\n  console.log(this);\n}\ntest();",
    options: ["undefined", "Window object", "test function", "Error"],
    correctAnswer: 1,
  },
  {
    id: 29,
    question:
      "What will be the output?\nconst obj = {a: 1, b: 2};\nconst {...rest} = obj;\nconsole.log(rest);",
    options: ["{a: 1, b: 2}", "undefined", "Error", "{}"],
    correctAnswer: 0,
  },
  {
    id: 30,
    question:
      "What will be the output?\nconst nums = [1, 2, 3];\nconst result = nums.filter(x => x > 2);\nconsole.log(result.length);",
    options: ["0", "1", "2", "3"],
    correctAnswer: 1,
  },
  {
    id: 31,
    question:
      "What will be the output?\nfor(var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
    options: ["0 1 2", "3 3 3", "undefined", "Error"],
    correctAnswer: 1,
  },
  {
    id: 32,
    question:
      "What will be the output?\nconst str = 'hello';\nconsole.log(str[0]);",
    options: ["'h'", "undefined", "Error", "0"],
    correctAnswer: 0,
  },
  {
    id: 33,
    question:
      "What will be the output?\nconst obj = {};\nobj.a = obj;\nconsole.log(obj.a);",
    options: ["undefined", "{ a: [Circular] }", "{}", "Error"],
    correctAnswer: 1,
  },
  {
    id: 34,
    question:
      "What will be the output?\nconst arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr);",
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4, 1, 2, 3]", "Error"],
    correctAnswer: 1,
  },
  {
    id: 35,
    question:
      "What will be the output?\nconst promise = Promise.resolve(5);\nconsole.log(promise);",
    options: ["5", "Promise { <pending> }", "Promise { 5 }", "undefined"],
    correctAnswer: 2,
  },
];
