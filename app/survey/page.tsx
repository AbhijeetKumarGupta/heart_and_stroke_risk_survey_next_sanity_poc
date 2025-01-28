'use client';

import { ChangeEvent, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useFlags } from 'flagsmith/react';
import { useSelector, useDispatch } from 'react-redux';

import SurveyResult from '@/components/SurveyResult';
import Header from '@/components/Header';
import SurveyQuestion from '@/components/SurveyQuestion';
import { FIELD_TYPES } from '@/src/constant';
import BasicInformation from '@/components/BasicInformation';
import {
    documentToReact, fetchAgeInformationData, fetchBasicInfoQuestions, fetchNextQuestion
} from '@/src/utils/survey';
import {
    setCurrentQuestion, setBasicInfoQuestions, setAnswers, setCounts,
    setIsLastQuestion, setShowResults, setBasicInfoData, setFetching,
    setSubmitting, setPreviousQuestions, setLoading, setAgeInformation, setRiskFactors
} from '@/src/store/surveySlice';
import { SELECTORS } from '@/cypress/selectors';

import styles from "./survey.module.css";

export default function Survey() {
    const dispatch = useDispatch();
    const { show_previous_button } = useFlags(['show_previous_button']);

    const {
        loading, fetching, submitting, isLastQuestion, showResults, basicInfoQuestions, riskFactors,
        surveyData, previousQuestions, currentQuestion, basicInfoData, answers, counts, ageInformation
    } = useSelector((state: ReduxState) => state);

    console.log({
        loading, fetching, submitting, isLastQuestion, showResults, basicInfoQuestions, riskFactors,
        surveyData, previousQuestions, currentQuestion, basicInfoData, answers, counts, ageInformation
    })

    useEffect(() => {
        const setBasicInfoAndSurveyData = async () => {
            dispatch(setLoading(true));
            const basic_information_questions = await fetchBasicInfoQuestions();
            dispatch(setBasicInfoQuestions(basic_information_questions?.data));
            dispatch(setLoading(false));
        };
        setBasicInfoAndSurveyData();
    }, [dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, option?: Option, subOption?: SubOption) => {
        const tempAnswers = structuredClone(answers) as Answers
        let tempRiskFactor = structuredClone(riskFactors) as FilteredRiskFactor;
        let nextQue;
        if (currentQuestion?.fieldType === FIELD_TYPES.MULTIPLE_CHOICE && option) {
            const { nextQuestion } = option
            nextQue = nextQuestion as Question
            if (currentQuestion.allowMultipleSelect) {
                if (e.target.checked) {
                    if (!subOption && !tempAnswers[currentQuestion.name]?.[e.target.name]) {
                        tempAnswers[currentQuestion.name] = {
                            ...(tempAnswers[currentQuestion.name] || {}),
                            [e.target.name]: { riskFactor: option?.riskFactor }
                        };
                    }
                    if (subOption) {
                        tempAnswers[currentQuestion.name][option.name] = {
                            ...(tempAnswers[currentQuestion.name][option.name] || {}),
                            riskFactor: tempAnswers?.[currentQuestion.name]?.[option.name]?.riskFactor,
                            [e.target.name]: { riskFactor: subOption?.riskFactor }
                        };
                    }
                    tempRiskFactor = {
                        ...tempRiskFactor,
                        [
                            subOption ? 
                            `${currentQuestion.name}-${option?.name}-${e.target.name}` : 
                            `${currentQuestion.name}-${e.target.name}`
                        ] : (subOption || option)?.riskFactor
                    } as FilteredRiskFactor
                } else {
                    delete tempRiskFactor[
                        subOption ? 
                        `${currentQuestion.name}-${option?.name}-${e.target.name}` : 
                        `${currentQuestion.name}-${e.target.name}`
                    ];
                    if (!subOption) {
                        delete tempAnswers[currentQuestion.name][e.target.name]
                        if (!Object.keys(tempAnswers[currentQuestion.name])?.length) {
                            delete tempAnswers[currentQuestion.name]
                        }
                    } else {
                        delete tempAnswers[currentQuestion.name][option.name][e.target.name]
                        if (
                            !Object.keys(tempAnswers[currentQuestion.name][option.name])?.length
                            &&
                            !Object.keys(tempAnswers[currentQuestion.name])?.length
                        ) {
                            delete tempAnswers[currentQuestion.name]
                        }
                    }
                }
            } else {
                Object.keys(tempRiskFactor).forEach((key) => {
                    if(!subOption && key.includes(`${currentQuestion.name}`)){
                        delete tempRiskFactor[key]
                    }else if(
                        subOption && 
                        key.includes(`${currentQuestion.name}`) && 
                        `${currentQuestion.name}-${option.name}`?.length < key?.length){
                        delete tempRiskFactor[key]
                    }
                })
                if (!subOption && !tempAnswers[currentQuestion.name]?.[e.target.name]) {
                    tempAnswers[currentQuestion.name] = {
                        [e.target.name]: { riskFactor: option?.riskFactor }
                    }
                }
                if (subOption) {
                    tempAnswers[currentQuestion.name][option.name] = {
                        riskFactor: tempAnswers?.[currentQuestion.name]?.[option.name]?.riskFactor,
                        [e.target.name]: { riskFactor: subOption?.riskFactor }
                    };
                }
                tempRiskFactor = {
                    ...tempRiskFactor,
                    [
                        subOption ? 
                        `${currentQuestion.name}-${option?.name}-${e.target.name}` : 
                        `${currentQuestion.name}-${e.target.name}`
                    ] : (subOption || option)?.riskFactor
                } as FilteredRiskFactor
            }
            dispatch(setRiskFactors(tempRiskFactor));
        }
        dispatch(setIsLastQuestion(!currentQuestion?.nextQuestion && !nextQue));
        dispatch(setAnswers(structuredClone(tempAnswers)));
    }

    const handlePrevious = () => {
        dispatch(setIsLastQuestion(false));
        const tempAnswers = structuredClone(answers) as Answers
        const lastIndex = previousQuestions.length - 1;
        const previousQuestion = previousQuestions[lastIndex];
        currentQuestion && delete tempAnswers[currentQuestion?.name];
        const updatedPreviousQuestions = previousQuestions.slice(0, lastIndex);
        const updatedCounts = counts.slice(0, lastIndex);
        dispatch(setCurrentQuestion(previousQuestion));
        dispatch(setPreviousQuestions(updatedPreviousQuestions));
        dispatch(setCounts(updatedCounts));
        dispatch(setAnswers(structuredClone(tempAnswers)));
    };

    const handleNext = async () => {
        dispatch(setFetching(true));
        if (!currentQuestion) {
            if (!ageInformation) {
                const ageInfo = await fetchAgeInformationData();
                dispatch(setCounts([...counts, surveyData?.noOfBaseQuestions || 0]));
                dispatch(setAgeInformation(ageInfo?.data));
            } else {
                dispatch(setPreviousQuestions([...previousQuestions, currentQuestion]));
                dispatch(setCurrentQuestion(ageInformation?.nextQuestion));
            }
        } else {
            const currentOption = currentQuestion?.options?.find(
                (option: Option) =>
                    option?.name === Object.keys(answers?.[currentQuestion.name] || {})?.[0]
            )
            dispatch(setCounts([...counts, currentOption?.noOfRelatedSubQuestions || 0]));
            dispatch(setPreviousQuestions([...previousQuestions, currentQuestion]));

            const questionId = currentOption?.nextQuestion ?
                currentOption?.nextQuestion?.slug :
                currentQuestion?.nextQuestion?.slug;
            if (questionId) {
                const nextQuestion = await fetchNextQuestion(questionId);
                const isLastQuestion = !nextQuestion?.nextQuestion &&
                    !nextQuestion?.options?.find((option: Option) => option?.nextQuestion);
                dispatch(setIsLastQuestion(isLastQuestion));
                dispatch(setCurrentQuestion(nextQuestion?.data));
            }
        }
        dispatch(setFetching(false));
    }

    const handleGetResults = async () => {
        dispatch(setSubmitting(true));
        dispatch(setPreviousQuestions([...previousQuestions, currentQuestion]));
        // Add submission logic here
        dispatch(setShowResults(true));
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
    const noOfBasicInfoAnswers = Object.values(basicInfoData)?.filter?.(Boolean)?.length
    const isValidBasicInfo = !ageInformation && !currentQuestion && basicInfoQuestions ?
        noOfBasicInfoAnswers === basicInfoQuestions?.questions?.length :
        noOfBasicInfoAnswers === (basicInfoQuestions?.questions?.length || 0) + 1

    const isNextButtonDisabled = fetching || submitting ||
        !isValidBasicInfo ||
        (currentQuestion && !currentQuestion?.isOptional && !answers?.[currentQuestion?.name]);

    return (
        <div className={styles.page}>
            <div className={styles.survey_container}>
                <Header
                    surveyData={surveyData}
                    noOfQuestions={noOfQuestions}
                    answeredQuestions={previousQuestions?.length}
                    showProgressBar={!!(currentQuestion || ageInformation)}
                />
                <hr />
                <main className={styles.main}>
                    {ageInformation && !currentQuestion &&
                        <>
                            <h3
                                data-test={SELECTORS.SURVEY_PAGE.BASIC_INFORMATION.TITLE}
                            >
                                {ageInformation?.title}
                            </h3>
                            <div
                                data-test={SELECTORS.WELCOME_PAGE.DESCRIPTION}
                                className={styles.description}
                            >
                                {basicInfoQuestions?.description
                                    ? documentToReact(ageInformation.description)
                                    : 'Loading description...'}
                            </div>
                        </>}
                    {showResults ? (
                        <SurveyResult riskFactors={riskFactors as FilteredRiskFactor}/>
                    ) : (
                        <>
                            {!(currentQuestion || ageInformation) ?
                                <BasicInformation
                                    basicInfoQuestions={basicInfoQuestions as BasicInformation}
                                    answers={{ ...answers, ...basicInfoData } as Answers & BasicInfoData}
                                    setBasicInfoData={
                                        (data: BasicInfoData) =>
                                            dispatch(setBasicInfoData({ ...basicInfoData, ...data }))
                                    }
                                />
                                :
                                <SurveyQuestion
                                    currentQuestion={(currentQuestion || ageInformation?.question) as Question}
                                    answers={{ ...answers, ...basicInfoData } as Answers & BasicInfoData}
                                    onChange={currentQuestion ? onChange : (e: ChangeEvent<HTMLInputElement>) =>
                                        dispatch(setBasicInfoData({
                                            ...basicInfoData,
                                            [ageInformation?.question?.name as string]: e.target.value
                                        }))
                                    }
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
                                        disabled={!!isNextButtonDisabled}
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