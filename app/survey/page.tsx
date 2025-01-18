'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useFlags } from 'flagsmith/react';
import { useSelector, useDispatch } from 'react-redux';

import SurveyResult from '@/components/SurveyResult';
import Header from '@/components/Header';
import SurveyQuestion from '@/components/SurveyQuestion';
import { FIELD_TYPES } from '@/src/constant';
import BasicInformation from '@/components/BasicInformation';
import { fetchBasicInfoQuestions, fetchNextQuestion, fetchSurveyData, 
    generateSurveyPayload, submitSurvey } from '@/src/utils/survey';
import { setSurveyData, setCurrentQuestion, setBasicInfoQuestions, setAnswers, setCounts, 
    setIsLastQuestion, setShowResults, setBasicInfoData, setFetching, 
    setSubmitting, setPreviousQuestions, setLoading } from '@/src/store/surveySlice';
import { SELECTORS } from '@/cypress/selectors';

import styles from "./survey.module.css";
 
export default function Survey() {
    const dispatch = useDispatch();
    const { show_previous_button } = useFlags(['show_previous_button']);

    const {
        loading, fetching, submitting, isLastQuestion, showResults, basicInfoQuestions, 
        surveyData, previousQuestions, currentQuestion, basicInfoData, answers, counts
    } = useSelector((state: any) => state);

    useEffect(() => {
        const setBasicInfoAndSurveyData = async () => {
            dispatch(setLoading(true));
            const {data: { basic_information_questions }} = await fetchBasicInfoQuestions();
            const { data: surveyInfo } = await fetchSurveyData();
            dispatch(setBasicInfoQuestions(basic_information_questions));
            dispatch(setSurveyData(surveyInfo));
            dispatch(setLoading(false));
        };
        setBasicInfoAndSurveyData();
    }, [dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, option?: IOption) => {
        const tempAnswers = { ...answers } as IAnswers
        let nextQue;
        if (currentQuestion?.field_type === FIELD_TYPES.MULTIPLE_CHOICE && option) {
            const { only_option_selected: shouldBeOnlyOptionSelected = false, next_Question } = option
            nextQue = next_Question as IQuestion
            if (e.target.checked) {
                const hasOnlyOptionSelected = Object.values(
                    tempAnswers[currentQuestion.name] || {}
                )?.find(
                    (option: ISelectedOption) => option?.shouldBeOnlyOptionSelected
                )
                if (currentQuestion.multipleSelect &&
                    !shouldBeOnlyOptionSelected &&
                    !hasOnlyOptionSelected
                ) {
                    tempAnswers[currentQuestion.name] = {
                        ...((tempAnswers[currentQuestion.name] as MultipleChoiceAnswer) || {}),
                        [e.target.name]: { point: +e.target.value, shouldBeOnlyOptionSelected }
                    }
                } else {
                    tempAnswers[currentQuestion.name] = {
                        [e.target.name]: { point: +e.target.value, shouldBeOnlyOptionSelected }
                    }
                }
            } else {
                delete (tempAnswers[currentQuestion.name] as MultipleChoiceAnswer)[e.target.name]
                if (!Object.keys(tempAnswers[currentQuestion.name])?.length) {
                    delete tempAnswers[currentQuestion.name]
                }
            }
        } else if (currentQuestion?.field_type === FIELD_TYPES.NUMERICAL) {
            // Need to revisit scoring logic of numerical field
            tempAnswers[currentQuestion.name] = +e.target.value
        } else if (currentQuestion?.field_type === FIELD_TYPES.DROPDOWN) {
            const [name, point] = e.target.value?.split("-")
            tempAnswers[currentQuestion.name] = {
                [name]: { point: +point, value: e.target.value }
            }
        }
        dispatch(setIsLastQuestion(!currentQuestion?.next_Question && !nextQue));
        dispatch(setAnswers({ ...tempAnswers }));
    }

    const handlePrevious = () => {
        dispatch(setIsLastQuestion(false));
        const tempAnswers = { ...answers } as IAnswers
        const lastIndex = previousQuestions.length - 1;
        const previousQuestion = previousQuestions[lastIndex];
        delete tempAnswers[currentQuestion.name];
        const updatedPreviousQuestions = previousQuestions.slice(0, lastIndex);
        const updatedCounts = counts.slice(0, lastIndex);
        dispatch(setCurrentQuestion(previousQuestion));
        dispatch(setPreviousQuestions(updatedPreviousQuestions));
        dispatch(setCounts(updatedCounts));
        dispatch(setAnswers({ ...tempAnswers }));
    };

    const handleNext = async () => {
        dispatch(setFetching(true));
        if (!currentQuestion) {
            dispatch(setCurrentQuestion(surveyData?.first_question));
        } else {
            const currentOption = currentQuestion?.options?.find(
                (option: IOption) =>
                    option?.name === Object.keys(answers?.[currentQuestion.name])?.[0]
            )
            const newCount = !previousQuestions?.length
            ? surveyData?.non_dependent_questions_count
            : currentOption?.no_of_linked_questions || 0;

            dispatch(setCounts([...counts, newCount]));
            dispatch(setPreviousQuestions([...previousQuestions, currentQuestion]));

            const questionId = currentOption?.next_Question ?
                currentOption?.next_Question?._id :
                currentQuestion?.next_Question?._id;
            if (questionId) {
                const { data: nextQuestion } = await fetchNextQuestion(questionId);
                const isLastQuestion = !nextQuestion?.next_Question &&
                    !nextQuestion?.options?.find((option: IOption) => option?.next_Question);
                dispatch(setIsLastQuestion(isLastQuestion));
                dispatch(setCurrentQuestion(nextQuestion));
            }
        }
        dispatch(setFetching(false));
    }

    const handleGetResults = async () => {
        dispatch(setSubmitting(true));
        dispatch(setPreviousQuestions([...previousQuestions, currentQuestion]));
        const surveyPayload = generateSurveyPayload(answers, basicInfoData);
        const { status } = await submitSurvey(surveyPayload);
        if(status === 201){
            dispatch(setShowResults(true));
        } else {
            window.alert("Something went wrong, please try again!");
        }
        dispatch(setSubmitting(false));
    };

    if (loading) return (
        <div className={styles.loader_container}>
            <div className={styles.loader} />
        </div>
    )

    if (!surveyData) {
        return notFound();
    }

    const noOfQuestions = counts.reduce((sum: number, count: number) => sum + count, 0);
    const isValidBasicInfo = Object.values(basicInfoData)
        ?.filter?.(Boolean)?.length === basicInfoQuestions
        ?.filter?.((que: IQuestion) => que.isRequired)?.length;
    const isNextButtonDisabled = fetching || submitting ||
        !isValidBasicInfo || 
        (currentQuestion?.isRequired && !answers?.[currentQuestion?.name]);

    return (
        <div className={styles.page}>
            <div className={styles.survey_container}>
                <Header 
                    surveyData={surveyData} 
                    noOfQuestions={noOfQuestions} 
                    answeredQuestions={previousQuestions?.length} 
                    showProgressBar={!!currentQuestion} 
                />
                <hr />
                <main className={styles.main}>
                    {showResults ? (
                            <SurveyResult answers={answers} surveyData={surveyData} />
                        ) : (
                            <>
                                {!currentQuestion ?
                                    <BasicInformation
                                        basicInfoQuestions={basicInfoQuestions}
                                        basicInfoData={basicInfoData}
                                        setBasicInfoData={
                                            (data: any) => 
                                                dispatch(setBasicInfoData({...basicInfoData, ...data}))
                                        }
                                    />
                                    :
                                    <SurveyQuestion 
                                        currentQuestion={currentQuestion} 
                                        answers={answers} 
                                        onChange={onChange} 
                                        isSubmitting={submitting}
                                    />
                                }
                                <div>
                                    <hr />
                                    <div
                                        className={`${styles.buttonContainer} 
                                            ${!show_previous_button?.enabled || !currentQuestion ? styles.singleButton : ''
                                        }`}
                                    >
                                        {show_previous_button?.enabled && currentQuestion &&
                                            <button
                                                onClick={handlePrevious}
                                                disabled={fetching || submitting}
                                                className={styles.button}
                                                data-test={SELECTORS.SURVEY_PAGE.BUTTON.PREVIOUS}
                                            >
                                                Previous
                                            </button>
                                        }
                                        <button
                                            onClick={isLastQuestion ? handleGetResults : handleNext}
                                            disabled={isNextButtonDisabled}
                                            className={styles.button}
                                            data-test={SELECTORS.SURVEY_PAGE.BUTTON.NEXT_OR_GET_RESULTS}
                                        >
                                            {isLastQuestion ? submitting ? '...Submitting' : 'Get Results' : 'Next'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                </main>
            </div>
        </div>
    );
}