import dotenv from "dotenv";
import IndicatorQuestions from "././questiondata/IndicatorQuestions.json" with { type: "json" };
import RevisionQuestions from "././questiondata/Revision Questions.json" with { type: "json" };

// TODO Replace sample ids and names with dynamic ones

dotenv.config();

// Node 18+ has global fetch + crypto.randomUUID()
// If using older Node versions:
// import fetch from "node-fetch";
// import crypto from "crypto";

const BASE_URL = process.env.CANVAS_BASE_URL;
const TOKEN = process.env.CANVAS_TOKEN;
const COURSE_IDS =  JSON.parse(process.env.COURSE_IDS);


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

async function createQuiz(title = "Sample Generated Quiz", course) {
  const payload = {
    quiz: {
      title
    }
  };

  const quiz = await canvasRequest(
    `/api/quiz/v1/courses/${course}/quizzes`,
    "POST",
    payload
  );

  console.log(`Created quiz: ${quiz.id}`);

  return quiz.id;
}

// =====================================================
// ITEM CREATION
// =====================================================

async function createItem(course, quizId, payload) {
  const item = await canvasRequest(
    `/api/quiz/v1/courses/${course}/quizzes/${quizId}/items`,
    "POST",
    payload
  );

  console.log(`Created item: ${item.id}`);

  return item;
}


// -----------------------------------------------------
// MULTIPLE CHOICE
// -----------------------------------------------------

function buildMC(question, answers) {
  const choices = []
  // console.log(answers.length)
  for (let i = 0; i < answers.length; i++) {
    // console.log(i)
    // console.log(answers[i])
    choices.push(
        {
          id: "Question "+i,
          position: i,
          item_body: answers[i]
        }
    );
  }
  // console.log(choices);
  return {
    item: {
      entry_type: "Item",
      points_possible: 1,

      entry: {
        title: "Sample MC",

        // Question stem
        item_body: question,
        interaction_data: {
          // Answer & Distractors
          choices: choices
        },

        properties: {
          shuffle_rules: {
            choices: {
              shuffled: true,
              to_lock: []
            }
          },
          vary_points_by_answer: false
        },

        scoring_data: {
          // ID of correct answer
          value: choices[0].id
        },

        scoring_algorithm: "Equivalence"
      }
    }
  };
}


function buildFITB() {
  const blankId = crypto.randomUUID();

  return {
    item: {
      entry_type: "Item",
      points_possible: 1,
      entry: {
        title: null,
        // Question stem
        item_body: "<p>Fill in the `blank`.</p>",
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
            }
          }
        },
        scoring_data: {
          value: [
            {
              id: blankId,
              scoring_data: {
                // Answer
                value: "blank",
                blank_text: "blank"
              },
              scoring_algorithm: "TextContainsAnswer"
            }
          ],
          // Question Stem
          working_item_body: "<p>Fill in the `blank`.</p>"
        }
      }
    }
  };
}

// =====================================================
// MAIN
// =====================================================

async function run(course, questionjson, title) {
  try {
    // ---------------------------------
    // CREATE QUIZ
    // ---------------------------------

    const quizId = await createQuiz(title, course);

    // ---------------------------------
    // BUILD ITEMS
    // ---------------------------------
    const questiondata = questionjson
    const items = []
    for (const q in questiondata){
      const data = questiondata[q]
      const type = data.Type;
      switch(type) {
        case "MC":
            const MCchoices = [data.Answer1, data.Answer2, data.Answer3, data.Answer4]
            // console.log(MCchoices)
            items.push(buildMC(data.Question, MCchoices));
            break;
        case "FB":
            break;
        default:
            break;
      }

      }


    // FITB:
    // question stem
    // blank text

    // MC:
    // question stem
    // answer array

    // ---------------------------------
    // UPLOAD ITEMS
    // ---------------------------------

    for (const item of items) {
      await createItem(course, quizId, item);

      // small delay to avoid Canvas weirdness
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log("\nDONE\n");

  } catch (err) {
    console.error("\nFATAL ERROR:");
    console.error(err.message);
  }
}

console.log(COURSE_IDS)
run(COURSE_IDS.SANDBOX, RevisionQuestions, "Revision MC Quiz Test");