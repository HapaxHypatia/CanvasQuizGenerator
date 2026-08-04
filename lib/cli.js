import dotenv from "dotenv";
dotenv.config();
import { canvasRequest } from "./api.js";


const BASE_URL = process.env.CANVAS_BASE_URL;
const TOKEN = process.env.CANVAS_TOKEN;

// // -----------------------------
// // LOW-LEVEL GET REQUEST
// // -----------------------------
// async function api(path) {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method: "GET",
//     headers: {
//       "Authorization": `Bearer ${TOKEN}`,
//       "Accept": "application/json"
//     }
//   });
//
//   const text = await res.text();
//
//   if (!res.ok) {
//     throw new Error(`${res.status}: ${text}`);
//   }
//
//   return text ? JSON.parse(text) : {};
// }




// -----------------------------
// DATA FETCHERS
// -----------------------------
export async function listCourses() {
  return canvasRequest("GET",`/api/v1/courses?enrollment_state=active`);
}

export async function listQuizzes(courseId) {
  return canvasRequest("GET",`/api/quiz/v1/courses/${courseId}/quizzes`);
}

export async function listQuizItems(courseId, quizId) {
  return canvasRequest("GET",`/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`);
}

// -----------------------------
// CONSOLE UI HELPERS
// -----------------------------
function printHeader(title) {
  console.log(`\n====================`);
  console.log(`${title}`);
  console.log(`====================\n`);
}

function printList(items, labelFn = (x) => x.name || x.title || x.id) {
  items.forEach((item, i) => {
    console.log(`${i + 1}. ${labelFn(item)}  (ID: ${item.id})`);
  });
}

// -----------------------------
// PROMPT HELPER (SYNC STYLE CLI)
// -----------------------------
function ask(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

// -----------------------------
// SELECT FUNCTIONS
// -----------------------------
export async function selectCourse() {
  const courses = await listCourses();

  printHeader("COURSES");
  printList(courses);

  const index = await ask("\nSelect course #: ");
  return courses[Number(index) - 1];
}

export async function selectQuiz(courseId) {
  const quizzes = await listQuizzes(courseId);

  printHeader("QUIZZES");
  printList(quizzes, q => q.title);

  const index = await ask("\nSelect quiz #: ");
  return quizzes[Number(index) - 1];
}

export async function selectQuizItems(courseId, quizId) {
  const items = await listQuizItems(courseId, quizId);

  printHeader("QUIZ ITEMS");
  printList(items, i => i.title || i.interaction_type_slug || i.id);

  const input = await ask(
    "\nSelect item(s): number, comma-separated, or 'all': "
  );

  if (input.toLowerCase() === "all") {
    return items;
  }

  const selected = input
    .split(",")
    .map(n => items[Number(n.trim()) - 1])
    .filter(Boolean);

  return selected;
}

// -----------------------------
// FULL FLOW (READ ONLY)
// -----------------------------
export async function runSelectorCLI() {
  const course = await selectCourse();
  const quiz = await selectQuiz(course.id);
  const items = await selectQuizItems(course.id, quiz.id);

  console.log("\n--- FINAL SELECTION ---");
  console.log("Course:", course.name || course.id);
  console.log("Quiz:", quiz.title || quiz.id);
  console.log("Items selected:", items.map(i => i.id));

  process.exit(0);
}

// -----------------------------
// RUN
// -----------------------------
runSelectorCLI().catch(console.error);