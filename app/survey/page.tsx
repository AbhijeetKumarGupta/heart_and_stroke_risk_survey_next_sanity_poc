'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useFlags } from 'flagsmith/react';

import SurveyResult from '@/components/SurveyResult';
import Header from '@/components/Header';
import SurveyQuestion from '@/components/SurveyQuestion';
import { FIELD_TYPES } from '@/src/constant';

import styles from "./survey.module.css";
import BasicInformation from '@/components/BasicInformation';
import { fetchBasicInfoQuestions, fetchNextQuestion, fetchSurveyData, 
    generateSurveyPayload, submitSurvey } from '@/src/utils/survey';
 
export default function Survey() {
    const [loading, setLoading] = useState<boolean>(true)
    const [fetching, setFetching] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false)
    const [showResults, setShowResults] = useState<boolean>(false);
    const [basicInfoQuestions, setBasicInfoQuestions] = useState<IQuestion[]>([])
    const [surveyData, setSurveyData] = useState<ISurveyData | null>(null)
    const [previousQuestions, setPreviousQuestions] = useState<IQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<any>(null)
    const [basicInfoData, setBasicInfoData] = useState<any>({})
    const [answers, setAnswers] = useState<IAnswers>({})
    const [counts, setCounts] = useState<number[]>([])
    const { show_previous_button } = useFlags(['show_previous_button']);

    useEffect(() => {
        const setBasicInfoAndSurveyData = async () => {
            setLoading(true);
            const {data: { basic_information_questions }} = await fetchBasicInfoQuestions();
            setBasicInfoQuestions(basic_information_questions);
            const { data: surveyInfo } = await fetchSurveyData();
            setSurveyData(surveyInfo);
            setLoading(false);
        };
        setBasicInfoAndSurveyData();
    }, []);

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
        setIsLastQuestion(!currentQuestion?.next_Question && !nextQue)
        setAnswers({ ...tempAnswers })
    }

    const handlePrevious = () => {
        setIsLastQuestion(false)
        const tempAnswers = { ...answers } as IAnswers
        const lastIndex = previousQuestions.length - 1;
        const previousQuestion = previousQuestions[lastIndex];
        delete tempAnswers[currentQuestion.name]
        setCurrentQuestion(previousQuestion)
        setPreviousQuestions((prev: IQuestion[]) => [...prev.slice(0, lastIndex)]);
        setCounts((prev: number[]) => [...prev.slice(0, lastIndex)]);
        setAnswers({ ...tempAnswers })
    };

    const handleNext = async () => {
        setFetching(true);
        if (!currentQuestion) {
            setCurrentQuestion(surveyData?.first_question)
        } else {
            const currentOption = currentQuestion?.options?.find(
                (option: IOption) =>
                    option?.name === Object.keys(answers?.[currentQuestion.name])?.[0]
            )
            setCounts((prev) =>
                [
                    ...prev,
                    !previousQuestions?.length ?
                        surveyData?.non_dependent_questions_count :
                        (currentOption?.no_of_linked_questions || 0)
                ]
            )
            setPreviousQuestions((prev: any) => [...prev, currentQuestion])
            const questionId = currentOption?.next_Question ?
                currentOption?.next_Question?._id :
                currentQuestion?.next_Question?._id
            if (questionId) {
                const { data: nextQuestion } = await fetchNextQuestion(questionId)
                const isLastQuestion = !nextQuestion?.next_Question &&
                    !nextQuestion?.options?.find((option: IOption) => option?.next_Question)
                setIsLastQuestion(isLastQuestion)
                setCurrentQuestion(nextQuestion)
            }
        }
        setFetching(false)
    }

    const handleGetResults = async () => {
        setSubmitting(true);
        setPreviousQuestions((prev: IQuestion[]) => [...prev, currentQuestion]);
        const surveyPayload = generateSurveyPayload(answers, basicInfoData);
        const { status } = await submitSurvey(surveyPayload);
        if(status === 201){
            setShowResults(true);
        } else {
            window.alert("Something went wrong, please try again!");
        }
        setSubmitting(false);
    };

    if (loading) return (
        <div className={styles.loader_container}>
            <div className={styles.loader} />
        </div>
    )

    if (!surveyData) {
        return notFound();
    }

    const noOfQuestions = counts.reduce((sum, count) => sum + count, 0);
    const isValidBasicInfo = Object.values(basicInfoData)
        ?.filter?.(Boolean)?.length === basicInfoQuestions
        ?.filter?.((que) => que.isRequired)?.length;
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
                                        setBasicInfoData={setBasicInfoData}
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
                                            >
                                                Previous
                                            </button>
                                        }
                                        <button
                                            onClick={isLastQuestion ? handleGetResults : handleNext}
                                            disabled={isNextButtonDisabled}
                                            className={styles.button}
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