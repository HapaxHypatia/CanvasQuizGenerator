import { canvasRequest } from "./api.js";

export async function listQuizzes(courseId) {
  return await canvasRequest(
    "GET",
    `/api/quiz/v1/courses/${courseId}/quizzes`
  );
}

export async function updateQuiz(
  courseId,
  quizId,
  updates
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(updates)) {
    params.append(`quiz[${key}]`, value);
  }

  return await canvasRequest(
    "PATCH",
    `/api/quiz/v1/courses/${courseId}/quizzes/${quizId}`,
    params
  );
}