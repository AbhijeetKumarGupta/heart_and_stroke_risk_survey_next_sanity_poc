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

// TODO: Refactor this 
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

    const fetchData = async (url: string) => {
        const res = await fetch(url);
        return await res.json();
    }

    useEffect(() => {
        const fetchBasicInfoAndSurveyData = async () => {
            setLoading(true)
            const { basic_information_questions } = await fetchData('/api/basicInfoQuestions')
            setBasicInfoQuestions(basic_information_questions)
            const data = await fetchData('/api/survey')
            setSurveyData(data)
            setLoading(false)
        };
        fetchBasicInfoAndSurveyData();
    }, []);

    // Logic to be changed as per the requirement
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
                const nextQuestion = await fetchData(`/api/survey/question?questionId=${questionId}`)
                const isLastQuestion = !nextQuestion?.next_Question &&
                    !nextQuestion?.options?.find((option: IOption) => option?.next_Question)
                setIsLastQuestion(isLastQuestion)
                setCurrentQuestion(nextQuestion)
            }
        }
        setFetching(false)
    }

    //TODO: Move url to env and create an axios service
    const submitSurvey = async (survey: ISurveyResponse) => {
        try {
            const response = await fetch('https://heart-and-stroke-be-node-mssql.onrender.com/api/survey', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(survey),
            });
        
            if (response.ok) {
              const data = await response.json();
              console.log('Survey submitted successfully:', data);
            } else {
              console.error('Failed to submit survey', response.status);
            }
          } catch (error) {
            console.error('Error while submitting survey:', error);
          }
    }

    const handleGetResults = async () => {
        setSubmitting(true)
        setPreviousQuestions((prev: any) => [...prev, currentQuestion])
        const finalAnswers = getFormatedAnswers(answers)
        const survey = {
            user_info:basicInfoData,
            answers: finalAnswers
        }
        //TODO: handle submission faliure
        await submitSurvey(survey)
        setShowResults(true);
        setSubmitting(false)
    };

    if (loading) return (
        <div className={styles.loader_container}>
            <div className={styles.loader} />
        </div>
    )

    if (!surveyData) {
        return notFound()
    }

    const noOfQuestions = counts.reduce((sum, count) => sum + count, 0)
    const isValidBasicInfo = Object.values(basicInfoData)
        ?.filter?.(Boolean)?.length === basicInfoQuestions
        ?.filter?.((que) => que.isRequired)?.length
    const isNextButtonDisabled = fetching || submitting ||
        !isValidBasicInfo || 
        (currentQuestion?.isRequired && !answers?.[currentQuestion?.name])
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