import { canvasRequest } from "./api.js";

export async function listItems(courseId, quizId) {
  return await canvasRequest(
    "GET",
    `/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items`
  );
}

export async function getItem(
  quizId,
  itemId
) {
  return await canvasRequest(
    "GET",
    `/api/quizzes/${quizId}/items/${itemId}`
  );
}


export async function patchItem(
  quizId,
  itemId,
  item
) {
  return await canvasRequest(
    "PATCH",
    `/api/quizzes/${quizId}/items/${itemId}`,
    { item }
  );
}


export async function updateItem(
  courseId,
  quizId,
  itemId,
  builderFunction
) {
  const params = builderFunction();

  return await canvasRequest(
    "PATCH",
    `/api/quiz/v1/courses/${courseId}/quizzes/${quizId}/items/${itemId}`,
    params
  );
}