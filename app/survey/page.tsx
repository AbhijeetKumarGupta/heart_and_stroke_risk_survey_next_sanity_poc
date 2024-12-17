'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import SurveyResult from '@/components/SurveyResult';
import Header from '@/components/Header';
import SurveyQuestion from '@/components/SurveyQuestion';
import { FIELD_TYPES } from '@/src/constant';

import styles from "./survey.module.css";


export default function Survey() {
    const [loading, setLoading] = useState<boolean>(true)
    const [fetching, setFetching] = useState<boolean>(false)
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false)
    const [showResults, setShowResults] = useState<boolean>(false);
    const [surveyData, setSurveyData] = useState<ISurveyData | null>(null)
    const [previousQuestions, setPreviousQuestions] = useState<IQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<any>(null)
    const [answers, setAnswers] = useState<IAnswers>({})
    const [counts, setCounts] = useState<number[]>([])

    const fetchData = async (url: string) => {
        const res = await fetch(url);
        return await res.json();
    }

    useEffect(() => {
        const fetchSurveyData = async () => {
            setLoading(true)
            const data = await fetchData('/api/survey')
            setSurveyData(data)
            setCurrentQuestion(data?.first_question)
            setLoading(false)
        };
        fetchSurveyData();
    }, []);

    // Logic to be changed as per the requirement
    const getFormatedAnswers = (answers: IAnswers) => {
        const finalAnswers = {} as IFinalAnswers
        Object.keys(answers).forEach((queKey) => {
            if(typeof answers[queKey] !== 'number'){
                finalAnswers[queKey] = {}
                Object.keys(answers[queKey]).forEach((ansKey: string) => {
                    (finalAnswers[queKey] as IndexableObject)[ansKey] = (answers[queKey] as MultipleChoiceAnswer)[ansKey]?.point
                })
            }else{
                finalAnswers[queKey] = answers[queKey]
            }
        })
        return finalAnswers
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, option?: IOption) => {
        const tempAnswers = { ...answers } as IAnswers
        let nextQue;
        if (currentQuestion?.field_type === FIELD_TYPES.MULTIPLE_CHOICE && option) {
            const {only_option_selected: shouldBeOnlyOptionSelected = false, next_Question} = option
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
        } else if(currentQuestion?.field_type === FIELD_TYPES.NUMERICAL) {
            // Need to revisit scoring logic of numerical field
            tempAnswers[currentQuestion.name] = +e.target.value
        } else if(currentQuestion?.field_type === FIELD_TYPES.DROPDOWN) {
            const [name, point] = e.target.value?.split("-")
            tempAnswers[currentQuestion.name] = {
                [name]: { point: +point, value: e.target.value }
            } 
        }
        setIsLastQuestion(!currentQuestion?.next_Question && !nextQue)
        setAnswers({ ...tempAnswers })
    }

    const handlePrevious = () => {
        if (previousQuestions.length >= 1) {
            setIsLastQuestion(false)
            const tempAnswers = { ...answers } as IAnswers
            const lastIndex = previousQuestions.length - 1;
            const previousQuestion = previousQuestions[lastIndex];
            delete tempAnswers[currentQuestion.name]
            setCurrentQuestion(previousQuestion)
            setPreviousQuestions((prev: IQuestion[]) => [...prev.slice(0, lastIndex)]);
            setCounts((prev: number[]) => [...prev.slice(0, lastIndex)]);
            setAnswers({ ...tempAnswers })
        } else {
            console.log("No previous question available.");
        }
    };

    const handleNext = async () => {
        setFetching(true)
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
        setFetching(false)
    }

    

    const handleGetResults = () => {
        setPreviousQuestions((prev: any) => [...prev, currentQuestion])
        setShowResults(true);
        // Will be saved to database
        const finalAnswers = getFormatedAnswers(answers)
        console.log({finalAnswers})
    };

    if (loading) return (
        <div className={styles.loader_container}>
            <div className={styles.loader} />
        </div>
    )

    if(!surveyData){
        return notFound()
    }

    const noOfQuestions = counts.reduce((sum, count) => sum + count, 0)
    const isNextButtonDisabled = fetching || (currentQuestion?.isRequired && !answers?.[currentQuestion?.name])
    
    return (
        <div className={styles.page}>
            <div className={styles.survey_container}>
                <Header surveyData={surveyData} noOfQuestions={noOfQuestions} answeredQuestions={previousQuestions?.length}/>
                <hr />
                <main className={styles.main}>
                    {showResults ? (
                        <SurveyResult answers={answers} surveyData={surveyData}/>
                    ) : (
                        <>
                            <SurveyQuestion currentQuestion={currentQuestion} answers={answers} onChange={onChange} />
                            <div>
                                <hr />
                                <div className={styles.buttonContainer}>
                                    <button
                                        onClick={handlePrevious}
                                        disabled={fetching || !previousQuestions?.length}
                                        className={styles.button}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={isLastQuestion ? handleGetResults : handleNext}
                                        disabled={isNextButtonDisabled}
                                        className={styles.button}
                                    >
                                        {isLastQuestion ? 'Get Results' : 'Next'}
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