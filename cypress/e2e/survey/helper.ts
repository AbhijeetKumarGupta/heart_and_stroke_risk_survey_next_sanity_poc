import { survey, user, welcomePage } from "@/cypress/fixtures";
import { SELECTORS } from "@/cypress/selectors";

/* Helpers */
const verifyBasicInfoQuestionLabels = (basicInfoQuestions: Array<any>) => {
    const labelTexts = [] as Array<string>;
    cy.getBySelector(
        SELECTORS.SURVEY_PAGE.QUESTION.LABEL
    ).then((labels) => {
        cy.wrap(labels).each((label) => labelTexts.push(label[0].innerText)).then(() => {
            basicInfoQuestions.forEach((question: any) => {
                expect(labelTexts.includes(question?.title)).to.be.true;
            })
        })
    });
}
const verifyBasicInfoQuestionInputFields = (basicInfoQuestions: Array<any>) => {
    const inputNames = [] as Array<string>;
    cy.getBySelector(
        SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD
    ).each(($input: Array<HTMLInputElement>) => {
        inputNames.push($input[0].name);
        cy.wrap($input).type(user?.[$input[0].name]);
    }).then(() => {
        basicInfoQuestions.forEach((question: any) => {
            expect(inputNames.includes(question?.name)).to.be.true;
        })
        cy.getBySelector(SELECTORS.SURVEY_PAGE.BUTTON.NEXT_OR_GET_RESULTS).click();
        cy.getBySelector(SELECTORS.SURVEY_PAGE.BUTTON.NEXT_OR_GET_RESULTS).should("be.disabled");
    });
}

/* Main Tests */
const runWelcomePageTests = () => {
    cy.log("Welcome page test begins.");
    cy.visit('/');
    cy.getBySelector(SELECTORS.WELCOME_PAGE.TITLE).should("contain.text", welcomePage.labelsAndTexts.title);
    cy.getBySelector(SELECTORS.WELCOME_PAGE.DESCRIPTION).should("contain.text", welcomePage.labelsAndTexts.description);
    cy.getBySelector(SELECTORS.WELCOME_PAGE.START_SURVEY_BUTTON).should("contain.text", welcomePage.labelsAndTexts.startButtonText);
    cy.log("Welcome page test ends.");
}

const runBasicInformationTests = () => {
    cy.log("Basic information page test begins.");
    cy.getBySelector(SELECTORS.WELCOME_PAGE.START_SURVEY_BUTTON).click();
    cy.wait(`@${survey.apiUrlsAndAlias.getBasicInfoQuestions.alias}`).its("response").then((res) => {
        const response = JSON.parse(res?.body);

        expect(res?.statusCode).to.be.eq(200);
        cy.wait(`@${survey.apiUrlsAndAlias.getSurveyInfo.alias}`).its("response.statusCode").should("eq", 200);

        const basicInfoQuestions = response?.basic_information_questions || [];

        /* Test sub steps */
        cy.getBySelector(
            SELECTORS.SURVEY_PAGE.BASIC_INFORMATION.TITLE
        ).should(
            "contain.text", survey.labelsAndTexts.basicInfo.title
        );

        verifyBasicInfoQuestionLabels(basicInfoQuestions);

        verifyBasicInfoQuestionInputFields(basicInfoQuestions);
    });
    cy.log("Basic information page test begins.");
}

export {
    runWelcomePageTests,
    runBasicInformationTests
}