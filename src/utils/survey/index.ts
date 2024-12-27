import services from "@/src/services"

// Logic can be changed as per the requirement
const getFormatedAnswers = (answers: IAnswers) => {
    const finalAnswers = {} as IFinalAnswers
    Object.keys(answers).forEach((queKey) => {
        if (typeof answers[queKey] !== 'number') {
            finalAnswers[queKey] = {}
            Object.keys(answers[queKey]).forEach((ansKey: string) => {
                (finalAnswers[queKey] as IndexableObject)[ansKey] = (answers[queKey] as MultipleChoiceAnswer)[ansKey]?.point
            })
        } else {
            finalAnswers[queKey] = answers[queKey]
        }
    })
    return finalAnswers
}

const generateSurveyPayload = ( answers: IAnswers, basicInfoData: any) => {
    return {
        user_info: basicInfoData,
        answers: getFormatedAnswers(answers)
    }
}

const submitSurvey = async (payload: ISurveyPayload) => {
    try {
        const response = await services.post('survey', payload);
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

const fetchBasicInfoQuestions = async () => {
    try {
        const response = await services.get('basicInfoQuestions')
        return response 
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
};

const fetchSurveyData = async () => {
    try {
        const response = await services.get('survey')
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

const fetchNextQuestion = async (questionId: string) => {
    try {
        const response = await services.get(`survey/question?questionId=${questionId}`)
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

export { 
    generateSurveyPayload, 
    submitSurvey, 
    fetchBasicInfoQuestions, 
    fetchSurveyData, 
    fetchNextQuestion 
}