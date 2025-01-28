import { gql } from "@apollo/client";

//TODO: Need to revisit
export const GET_SURVEY_INFORMATION = gql`
  query GetSurveyInformation {
  surveyInformationCollection {
    items {
      sys {
        id
      }
      title
      description {
        json
      }
      instructionsCollection {
        items {
          sys {
            id
          }
          title
          # Replace "details" with the correct fields for actionableInstruction
        }
      }
      firstQuestion {
        ... on Question {
          sys {
            id
          }
          # Replace "questionText", "type", and "options" with correct fields for Question
        }
        ... on AgeInformation {
          sys {
            id
          }
          # Replace "ageRange" with correct fields for AgeInformation
        }
      }
    }
  }
}
`;
