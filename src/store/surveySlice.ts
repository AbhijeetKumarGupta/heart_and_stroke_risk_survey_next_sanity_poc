import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ReduxState = {
    surveyData: null,
    currentQuestion: null,
    ageInformation: null,
    basicInfoQuestions: null,
    answers: {},
    previousQuestions: [],
    counts: [],
    isLastQuestion: false,
    showResults: false,
    basicInfoData: {},
    loading: true,
    fetching: false,
    submitting: false,
    riskFactors: {}
};

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setSurveyData(state, action: PayloadAction<ReduxState['surveyData']>) {
            state.surveyData = action.payload;
        },
        setCurrentQuestion(state, action: PayloadAction<ReduxState['currentQuestion']>) {
            state.currentQuestion = action.payload;
        },
        setAgeInformation(state, action: PayloadAction<ReduxState['ageInformation']>) {
            state.ageInformation = action.payload;
        },
        setBasicInfoQuestions(state, action: PayloadAction<ReduxState['basicInfoQuestions']>){
            state.basicInfoQuestions = action.payload;
        },
        setAnswers(state, action: PayloadAction<ReduxState['answers']>) {
            state.answers = action.payload;
        },
        setPreviousQuestions(state, action: PayloadAction<ReduxState['previousQuestions']>) {
            state.previousQuestions = action.payload;
        },
        setCounts(state, action: PayloadAction<ReduxState['counts']>) {
            state.counts = action.payload;
        },
        setIsLastQuestion(state, action: PayloadAction<ReduxState['isLastQuestion']>) {
            state.isLastQuestion = action.payload;
        },
        setShowResults(state, action: PayloadAction<ReduxState['showResults']>) {
            state.showResults = action.payload;
        },
        setBasicInfoData(state, action: PayloadAction<ReduxState['basicInfoData']>) {
            state.basicInfoData = action.payload;
        },
        setLoading(state, action: PayloadAction<ReduxState['loading']>) {
            state.loading = action.payload;
        },
        setFetching(state, action: PayloadAction<ReduxState['fetching']>) {
            state.fetching = action.payload;
        },
        setSubmitting(state, action: PayloadAction<ReduxState['submitting']>) {
            state.submitting = action.payload;
        },
        setRiskFactors(state, action: PayloadAction<ReduxState['riskFactors']>) {
            state.riskFactors = action.payload;
        },
        resetSurveyState(state) {
            const tempState = {surveyData: state.surveyData}
            return {...initialState, ...tempState};
        },
    },
});

export const {
    setSurveyData,
    setCurrentQuestion,
    setBasicInfoQuestions,
    setAnswers,
    setPreviousQuestions,
    setCounts,
    setIsLastQuestion,
    setShowResults,
    setBasicInfoData,
    setLoading,
    setFetching,
    setSubmitting,
    resetSurveyState,
    setAgeInformation,
    setRiskFactors
} = surveySlice.actions;

export default surveySlice.reducer;
