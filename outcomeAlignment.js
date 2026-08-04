import dotenv from "dotenv";
dotenv.config();

import {
  getItem,
  listItems,
  patchItem
} from "./lib/quizItems.js";

import {
  createAlignmentSet
} from "./lib/api.js";

import {
  confirmBulkChanges
} from "./lib/utils.js";

async function bulkAlign(
  courseId,
  quizID,
  itemIDs,
  outcomeId
) {

  const ok = await confirmBulkChanges(
      items,
      `Outcome ${outcomeId} will be aligned to all quiz items`
  );

  if (!ok) {
    console.log("Cancelled.");
    return;
  }

  for (const itemID of itemIDs) {
    const alignment =
        await createAlignmentSet([
          outcomeId
        ]);

    const item =
        await getItem(quizID, itemID);

    item.entry.outcome_alignment_set_guid =
        alignment.guid;

    await patchItem(
        quizId,
        itemId,
        item.entry
    );
  }
}



  const courseID = process.env.COURSE_ID;
  const quizID = 759290;
  const outcomeID = 309836;




  bulkAlign(courseID, quizID, outcomeID);
