import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISurveyState = {
    surveyData: null,
    currentQuestion: null,
    basicInfoQuestions: [],
    answers: {},
    previousQuestions: [],
    counts: [],
    isLastQuestion: false,
    showResults: false,
    basicInfoData: {},
    loading: true,
    fetching: false,
    submitting: false,
};

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setSurveyData(state, action: PayloadAction<ISurveyData>) {
            state.surveyData = action.payload;
        },
        setCurrentQuestion(state, action: PayloadAction<IQuestion | null>) {
            state.currentQuestion = action.payload;
        },
        setBasicInfoQuestions(state, action: PayloadAction<IQuestion[]>){
            state.basicInfoQuestions = action.payload;
        },
        setAnswers(state, action: PayloadAction<IAnswers>) {
            state.answers = action.payload;
        },
        setPreviousQuestions(state, action: PayloadAction<IQuestion[]>) {
            state.previousQuestions = action.payload;
        },
        setCounts(state, action: PayloadAction<number[]>) {
            state.counts = action.payload;
        },
        setIsLastQuestion(state, action: PayloadAction<boolean>) {
            state.isLastQuestion = action.payload;
        },
        setShowResults(state, action: PayloadAction<boolean>) {
            state.showResults = action.payload;
        },
        setBasicInfoData(state, action: PayloadAction<any>) {
            state.basicInfoData = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setFetching(state, action: PayloadAction<boolean>) {
            state.fetching = action.payload;
        },
        setSubmitting(state, action: PayloadAction<boolean>) {
            state.submitting = action.payload;
        },
        resetSurveyState(state) {
            return initialState;
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
    resetSurveyState
} = surveySlice.actions;

export default surveySlice.reducer;
