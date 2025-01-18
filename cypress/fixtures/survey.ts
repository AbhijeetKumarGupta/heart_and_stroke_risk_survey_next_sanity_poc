const labelsAndTexts = {
    basicInfo: {
        title:"Basic Information",
    },
    results: {
        title: "Survey Results",
        scoreText: "Total Score",
        categoryText: "Risk Category",
        description: "Thank you for completing the survey! Your responses are important for us to assess your health risk."
    },
    nextButtonText: "Next",
    previousButtonText: "Previous",
    progressBarText: "Progress",
    submitButtonText: "Get Results",
};

const apiUrlsAndAlias = {
    getBasicInfoQuestions: {
        endpoint: 'api/basicInfoQuestions',
        alias: 'basicInfo'
    },
    getSurveyInfo: {
        endpoint: 'api/survey',
        alias: 'survey'
    }
};

export default {
    labelsAndTexts,
    apiUrlsAndAlias
}