import dotenv from "dotenv";
dotenv.config();

// Node 18+ has global fetch + crypto.randomUUID()
// If using older Node versions:
// import fetch from "node-fetch";
// import crypto from "crypto";

const BASE_URL = process.env.CANVAS_BASE_URL;
const TOKEN = process.env.CANVAS_TOKEN;
const COURSE_ID = process.env.COURSE_ID;

// =====================================================
// CONSTANTS
// =====================================================

const QUESTION_TYPES = {
  MC: "choice",
  ESSAY: "essay",
  TF: "true-false",
  FITB: "rich-fill-blank"
};

const SCORING = {
  EQUIVALENCE: "Equivalence",
  NONE: "None",
  MULTIPLE_METHODS: "MultipleMethods",
  TEXT_CONTAINS: "TextContainsAnswer"
};

// =====================================================
// HTTP
// =====================================================

async function canvasRequest(path, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);

    console.log("\n====================================");
    console.log(`${method} ${path}`);
    console.log("REQUEST BODY:");
    console.log(JSON.stringify(body, null, 2));
    console.log("====================================\n");
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  const text = await res.text();

  if (!res.ok) {
    console.error("\n========== CANVAS ERROR ==========");
    console.error(text);
    console.error("==================================\n");

    throw new Error(`${res.status}: ${text}`);
  }

  return text ? JSON.parse(text) : {};
}

// =====================================================
// QUIZ
// =====================================================

async function createQuiz(title = "Sample Generated Quiz") {
  const payload = {
    quiz: {
      title
    }
  };

  const quiz = await canvasRequest(
    `/api/quiz/v1/courses/${COURSE_ID}/quizzes`,
    "POST",
    payload
  );

  console.log(`Created quiz: ${quiz.id}`);

  return quiz.id;
}

// =====================================================
// ITEM CREATION
// =====================================================

async function createItem(quizId, payload) {
  const item = await canvasRequest(
    `/api/quiz/v1/courses/${COURSE_ID}/quizzes/${quizId}/items`,
    "POST",
    payload
  );

  console.log(`Created item: ${item.id}`);

  return item;
}

// =====================================================
// QUESTION BUILDERS
// =====================================================

// -----------------------------------------------------
// MULTIPLE CHOICE
// -----------------------------------------------------

function buildMC() {
  const correctId = crypto.randomUUID();
  const wrongId = crypto.randomUUID();

  return {
    item: {
      entry_type: "Item",
      points_possible: 1,

      entry: {
        title: "Sample MC",

        item_body: "<p>What is the correct answer?</p>",

        interaction_type_slug: QUESTION_TYPES.MC,

        interaction_data: {
          choices: [
            {
              id: correctId,
              position: 1,
              item_body: "<p>Correct Answer</p>"
            },
            {
              id: wrongId,
              position: 2,
              item_body: "<p>Wrong Answer</p>"
            }
          ]
        },

        properties: {
          shuffle_rules: {
            choices: {
              shuffled: false,
              to_lock: []
            }
          },
          vary_points_by_answer: false
        },

        scoring_data: {
          value: correctId
        },

        scoring_algorithm: SCORING.EQUIVALENCE
      }
    }
  };
}

// -----------------------------------------------------
// ESSAY
// -----------------------------------------------------

function buildEssay() {
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,

      entry: {
        title: "Sample Essay",

        item_body: "<p>Write a response.</p>",

        interaction_type_slug: QUESTION_TYPES.ESSAY,

        interaction_data: {
          rce: true,
          essay: null,
          word_count: false,
          file_upload: false,
          spell_check: false,
          word_limit_enabled: false,
          word_limit_max: null,
          word_limit_min: null
        },

        properties: {
          word_limit: false,
          spell_check: false,
          word_limit_max: 0,
          word_limit_min: 0,
          show_word_count: false,
          rich_content_editor: false
        },

        scoring_data: {
          value: ""
        },

        scoring_algorithm: SCORING.NONE
      }
    }
  };
}

// -----------------------------------------------------
// TRUE/FALSE
// -----------------------------------------------------

function buildTF() {
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,

      entry: {
        title: "Sample True False",

        item_body: "<p>The sky is blue.</p>",

        interaction_type_slug: QUESTION_TYPES.TF,

        interaction_data: {
          true_choice: "True",
          false_choice: "False"
        },

        properties: {},

        scoring_data: {
          value: true
        },

        scoring_algorithm: SCORING.EQUIVALENCE
      }
    }
  };
}

// -----------------------------------------------------
// RICH FILL IN THE BLANK
// -----------------------------------------------------

function buildFITB() {
  const blankId = crypto.randomUUID();

  return {
    item: {
      entry_type: "Item",
      points_possible: 1,

      entry: {
        title: "Sample Fill Blank",

        item_body: "<p>Fill in the `blank`.</p>",

        interaction_type_slug: QUESTION_TYPES.FITB,

        interaction_data: {
          blanks: [
            {
              id: blankId,
              answer_type: "openEntry"
            }
          ]
        },

        properties: {
          shuffle_rules: {
            blanks: {
              children: {
                "0": {
                  children: null
                }
              }
            }
          }
        },

        scoring_algorithm: SCORING.MULTIPLE_METHODS,

        scoring_data: {
          value: [
            {
              id: blankId,

              scoring_data: {
                value: "blank",
                blank_text: "blank"
              },

              scoring_algorithm: SCORING.TEXT_CONTAINS
            }
          ],

          working_item_body: "<p>Fill in the `blank`.</p>"
        }
      }
    }
  };
}

// =====================================================
// MAIN
// =====================================================

async function run() {
  try {
    // ---------------------------------
    // CREATE QUIZ
    // ---------------------------------

    const quizId = await createQuiz();

    // ---------------------------------
    // BUILD ITEMS
    // ---------------------------------

    const items = [
      buildEssay(),
      buildMC(),
      buildTF(),
      buildFITB()
    ];

    // ---------------------------------
    // UPLOAD ITEMS
    // ---------------------------------

    for (const item of items) {
      await createItem(quizId, item);

      // small delay to avoid Canvas weirdness
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log("\nDONE\n");

  } catch (err) {
    console.error("\nFATAL ERROR:");
    console.error(err.message);
  }
}

run();