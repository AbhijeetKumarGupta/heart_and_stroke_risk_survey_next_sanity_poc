const PAGE = {
    WELCOME: "welcome-page",
    SURVEY: "survey-page",
    RESULT: "result-page"
}

export const SELECTORS = Object.freeze({
    WELCOME_PAGE: {
        TITLE: `${PAGE.WELCOME}-title`,
        DESCRIPTION: `${PAGE.WELCOME}-description`,
        START_SURVEY_BUTTON: `${PAGE.WELCOME}-start-button`,
    },
    SURVEY_PAGE: {
        SURVEY: {
            NAME: `${PAGE.SURVEY}-survey-name`,
            DESCRIPTION: `${PAGE.SURVEY}-survey-decription`,
        },
        PROGRESS: {
            BAR: `${PAGE.SURVEY}-progress-bar`,
            LABEL: `${PAGE.SURVEY}-progress-label`,
            AMOUNT: `${PAGE.SURVEY}-progress-amount`,
        },
        QUESTION: {
            LABEL: `${PAGE.SURVEY}-question-label`,
            DESCRIPTION: `${PAGE.SURVEY}-question-description`,
            OPTIONS: `${PAGE.SURVEY}-options`,
            SUB_OPTIONS: `${PAGE.SURVEY}-sub-options`,
            INPUT_FIELD: `${PAGE.SURVEY}-input-field`,
            SUB_INPUT_FIELD: `${PAGE.SURVEY}-sub-input-field`,
        },
        BUTTON: {
            NEXT_OR_GET_RESULTS: `${PAGE.SURVEY}-next-or-get-results-button`,
            PREVIOUS: `${PAGE.SURVEY}-previous-button`,
        },
        BASIC_INFORMATION: {
            TITLE: `${PAGE.SURVEY}-basic-info-title`,
            QUESTIONS: `${PAGE.SURVEY}-basic-info-questions`,
        },
    },
    RESULT_PAGE: {
        TITLE: `${PAGE.RESULT}-title`,
        SCORE: `${PAGE.RESULT}-score`,
        CATEGORY: `${PAGE.RESULT}-category`,
        DESCRIPTION: `${PAGE.RESULT}-description`,
    }
})