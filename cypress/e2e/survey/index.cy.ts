import { survey } from "../../fixtures";
import { runBasicInformationTests, runWelcomePageTests } from "./helper";

describe(("Survey flow"), () => {
    it("Verify survey forms, fields and labels", () => {

        /* Setup interceptors */
        cy.intercept(
            'GET', survey.apiUrlsAndAlias.getBasicInfoQuestions.endpoint
        ).as(
            survey.apiUrlsAndAlias.getBasicInfoQuestions.alias
        );
        cy.intercept(
            'GET', survey.apiUrlsAndAlias.getSurveyInfo.endpoint
        ).as(
            survey.apiUrlsAndAlias.getSurveyInfo.alias
        );

        /* Welcome Page */
        runWelcomePageTests()

        /* Survey Page*/
            /* Basic information */
        runBasicInformationTests();

    });
})