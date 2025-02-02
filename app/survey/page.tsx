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
    documentToReact, fetchAgeInformationData, fetchBasicInfoQuestions, fetchNextQuestion,
    getProcessedRiskFactors
} from '@/src/utils/survey';
import {
    setCurrentQuestion, setBasicInfoQuestions, setAnswers, setCounts,
    setIsLastQuestion, setShowResults, setBasicInfoData, setFetching,
    setSubmitting, setPreviousQuestions, setLoading, setAgeInformation,
    setDependentQuestions
} from '@/src/store/surveySlice';
import { SELECTORS } from '@/cypress/selectors';

import styles from "./survey.module.css";
// import contentfulClient from '@/contentful/contentfulClient';

export default function Survey() {
    const dispatch = useDispatch();
    const { show_previous_button } = useFlags(['show_previous_button']);

    const {
        loading, fetching, submitting, isLastQuestion, showResults, basicInfoQuestions, dependentQuestions,
        surveyData, previousQuestions, currentQuestion, basicInfoData, answers, counts, ageInformation
    } = useSelector((state: ReduxState) => state);

    console.log({
        loading, fetching, submitting, isLastQuestion, showResults, basicInfoQuestions, dependentQuestions,
        surveyData, previousQuestions, currentQuestion, basicInfoData, answers, counts, ageInformation
    })

    useEffect(() => {
        const setBasicInfoAndSurveyData = async () => {
            
            // Contentful interceptor test
            // const question = await contentfulClient.getEntries({
            //     content_type: 'question',
            //     include: 3,
            //   })

            dispatch(setLoading(true));
            const basic_information_questions = await fetchBasicInfoQuestions();
            dispatch(setBasicInfoQuestions(basic_information_questions?.data));
            dispatch(setLoading(false));
        };
        setBasicInfoAndSurveyData();
    }, [dispatch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, currentOption?: any, option?: Option, subOption?: SubOption) => {
        const tempAnswers = structuredClone(answers) as Answers & { [key: string]: any }
        const tempDependentQuestions = structuredClone(dependentQuestions);
        const questionTitle = currentQuestion?.title ?? '';
        const optionTitle = option?.title;
        const subOptionTitle = subOption?.title;

        const deleteAnswers = (optKey: string, deleteFromDependency: boolean) => {
            tempDependentQuestions?.[optKey]?.forEach((queKey: string) => {
                delete tempAnswers[queKey]
            })
            //TODO: Fix not getting removed issue
            deleteFromDependency && tempDependentQuestions && delete tempDependentQuestions[optKey]
        }

        let nextQue;
        if (currentQuestion?.fieldType === FIELD_TYPES.MULTIPLE_CHOICE && option) {
            const { nextQuestion } = option
            nextQue = nextQuestion as Question
            if (currentQuestion.allowMultipleSelect) {
                if (e.target.checked) {
                    if (!subOption && !tempAnswers?.[currentQuestion?.name]?.[e.target.name]) {
                        tempAnswers[currentQuestion.name] = {
                            ...(tempAnswers?.[currentQuestion?.name] || {}),
                            [e.target.name]: { optionTitle, riskFactor: option?.riskFactor }
                        };
                    }
                    if (subOption) {
                        tempAnswers[currentQuestion.name][option.name] = {
                            ...(tempAnswers[currentQuestion.name][option.name] || {}),
                            [e.target.name]: { subOptionTitle, riskFactor: subOption?.riskFactor }
                        };
                    }
                    if (!tempAnswers?.[currentQuestion?.name]?.questionTitle) {
                        tempAnswers[currentQuestion.name].questionTitle = questionTitle
                    }
                } else {
                    if (!subOption) {
                        delete tempAnswers[currentQuestion.name][e.target.name]
                        if (Object.keys(tempAnswers[currentQuestion.name])?.length === 1) {
                            delete tempAnswers[currentQuestion.name]
                        }
                        tempDependentQuestions && deleteAnswers(option.name, !tempDependentQuestions[option.name]?.length)
                    } else {
                        delete tempAnswers[currentQuestion.name][option.name][e.target.name]
                    }
                }
            } else {
                if (!subOption && !tempAnswers[currentQuestion.name]?.[e.target.name]) {
                    tempAnswers[currentQuestion.name] = {
                        [e.target.name]: { optionTitle, riskFactor: option?.riskFactor }
                    }
                    const optionKeys = Object.keys(currentOption || {})
                    ?.filter((key: string) => key !== 'questionTitle' && 
                    key !== 'optionTitle')
                    optionKeys?.forEach?.((optKey: string) => {
                        deleteAnswers(optKey, true)
                    })

                }
                if (subOption) {
                    tempAnswers[currentQuestion.name][option.name] = {
                        optionTitle: tempAnswers?.[currentQuestion.name]?.[option.name]?.optionTitle,
                        riskFactor: tempAnswers?.[currentQuestion.name]?.[option.name]?.riskFactor,
                        [e.target.name]: { subOptionTitle, riskFactor: subOption?.riskFactor }
                    };
                }
                if (!tempAnswers?.[currentQuestion?.name]?.questionTitle) {
                    tempAnswers[currentQuestion.name].questionTitle = questionTitle
                }
            }
        }
        dispatch(setDependentQuestions(tempDependentQuestions));
        dispatch(setIsLastQuestion(!currentQuestion?.nextQuestion && !nextQue));
        dispatch(setAnswers(structuredClone(tempAnswers)));
    }

    const handlePrevious = () => {
        dispatch(setIsLastQuestion(false));
        // const tempAnswers = structuredClone(answers) as Answers
        const lastIndex = previousQuestions.length - 1;
        const previousQuestion = previousQuestions[lastIndex];
        // currentQuestion && delete tempAnswers[currentQuestion?.name];
        const updatedPreviousQuestions = previousQuestions.slice(0, lastIndex);
        const updatedCounts = counts?.length === 1 ? counts : counts.slice(0, lastIndex);
        dispatch(setCurrentQuestion(previousQuestion));
        dispatch(setPreviousQuestions(updatedPreviousQuestions));
        dispatch(setCounts(updatedCounts));
        // dispatch(setAnswers(structuredClone(tempAnswers)));
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
            if (currentOption?.nextQuestion) {
                if (!dependentQuestions?.[currentOption.name]?.includes?.(currentOption?.nextQuestion?.name)) {
                    const tempDependentQuestions = structuredClone(dependentQuestions) || {};
                    tempDependentQuestions[currentOption.name] = [...(tempDependentQuestions[currentOption.name] || []), currentOption?.nextQuestion?.name];
                    dispatch(setDependentQuestions(tempDependentQuestions));
                }
            }
            if (questionId) {
                const nextQuestion = await fetchNextQuestion(questionId);
                const isLastQuestion = !nextQuestion?.data?.nextQuestion &&
                    !nextQuestion?.data?.options?.find((option: Option) => option?.nextQuestion);
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
                        <SurveyResult riskFactors={getProcessedRiskFactors(answers as Answers)} />
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