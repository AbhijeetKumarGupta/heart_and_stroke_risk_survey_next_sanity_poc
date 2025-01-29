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
        }
      }
    }
  }
}
`;
