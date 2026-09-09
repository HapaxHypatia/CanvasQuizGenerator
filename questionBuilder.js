/*
interaction data
    blanks or choices
    "blanks": [
          {
            "id": "ad81eab6-257f-4f8f-97ab-c826dbb63d7e",
            "answer_type": "openEntry"
          }
        ]

    "choices": [
              {
                "id": "7f4d87fa-7dd8-4dae-a379-08e68b9bb38a",
                "position": 1,
                "item_body": "<p>dhf</p>"
              },
              {
                "id": "112d1867-7728-4b23-a1ff-ef1908849b28",
                "position": 2,
                "item_body": "<p>dhdh</p>"
              },
              {
                "id": "f47eaf90-bff1-4aa5-bba1-e2f40e7c4394",
                "position": 3,
                "item_body": "<p>dfhd</p>"
              },
              {
                "id": "cbcbd2f0-7410-4b14-a241-f5ee8215200b",
                "position": 4,
                "item_body": "<p>dfd</p>"
              }
            ]


scoring data
MC:
"scoring_data": {
    "value": ID of correct answer
},


properties MC:
"properties": {
    "shuffle_rules": {
        "choices": {
            "to_lock": [],
            "shuffled": false
        }
    "vary_points_by_answer": false
},


FITB:
"scoring_data": {
    "value": [
      {
        "id": id of blank,
        "scoring_data": {
          "value": correct answer,
          "blank_text": correct answer
        },
        "scoring_algorithm": "TextContainsAnswer"
      }
    ],
    "working_item_body": question stem
}

FITB MA:
"scoring_data": {
    "value": [
      {
        "id": blank ID,
        "scoring_data": {
          "value": [
            primary answer,
            possible answer
          ],
          "blank_text": primary answer
        },
        "scoring_algorithm": "TextInChoices"
      }
    ],
    "working_item_body": question stem
}

FITB scoring algorithms
    TextCloseEnough
    TextContainsAnswer
    TextInChoices
    Equivalence
    TextEquivalence
    TextRegex

item scoring_algorithms
    Equivalence
    MultipleMethods
    AllOrNothing

interaction_type_slug
    rich-fill-blank
    choices
    multi-answer
*/

function BuildItem(type, questionStem, answers){
    let scoring_algorithm;
    let interaction_slug;
    let properties;
    let interaction_data;
    let scoring_data;
    switch(type) {
        case "MC":
            let choices;
                // TODO Create choices property using answers
            let answerID;
            //     TODO generate answerID
            scoring_algorithm = "Equivalence";
            interaction_slug = "choices";
            properties = "\"shuffle_rules\": {\"choices\": {\"to_lock\": [],\"shuffled\": false}\"vary_points_by_answer\": false";
            scoring_data = "{\"value\": " + answerID + "}"
            interaction_data = choices;


            break;
        case "FITB":
            let blanks;
            // TODO Create blanks property using questionstem and answers
            scoring_algorithm = "Equivalence";
            let itemScoringData;
            scoring_algorithm = "MultipleMethods";
            interaction_slug = "blanks";
            properties = "\"shuffle_rules\": {}";
            interaction_data = blanks;

            /*
            "scoring_data": {
                "value": [
                      {
                      "id": blankID,
                      "scoring_data": {
                          "value": correct answer,
                          "blank_text": correct answer
                      },
                      "scoring_algorithm": "TextContainsAnswer"
                      }
                ],
                "working_item_body": question stem
             */
            break;
        default:
        // code block
    }
    return {
            points_possible: 1,
            properties: {
                required: false
            },
            entry_type: "Item",
            entry_editable: false,
            stimulus_quiz_entry_id: null,
            status: "mutable",
            entry: {
                title: null,
                item_body: questionStem,
                interaction_data: interaction_data,
                properties: properties,
                scoring_data: scoring_data,
                answer_feedback: {},
                scoring_algorithm: scoring_algorithm,
                interaction_type_slug: interaction_slug,
                feedback: {}
            }
    }
}

