import { listCourses } from "./api/courses.js";
import { listQuizzes } from "./api/quizzes.js";
import { listQuizItems } from "./api/quizItems.js";

import {
  selectOne,
  selectMany
} from "./cli/prompts.js";

async function run() {

  // -------------------------
  // COURSE
  // -------------------------

  const courses = await listCourses();

  const courseId = await selectOne(
    "Choose course",
    courses.map(c => ({
      name: c.name,
      value: c.id
    }))
  );

  // -------------------------
  // QUIZ
  // -------------------------

  const quizzes = await listQuizzes(courseId);

  const quizId = await selectOne(
    "Choose quiz",
    quizzes.map(q => ({
      name: q.title,
      value: q.id
    }))
  );

  // -------------------------
  // ITEMS
  // -------------------------

  const items = await listQuizItems(
    courseId,
    quizId
  );

  const itemIds = await selectMany(
    "Choose items",
    items.map(i => ({
      name: i.entry.title,
      value: i.id
    }))
  );

  console.log(itemIds);
}

run();