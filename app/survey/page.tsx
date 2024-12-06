'use client';
import { useEffect, useState } from 'react';
import client from "@/sanity/sanityClient";

import styles from "./survey.module.css";
import SurveyResult from '@/components/SurveyResult';
import Header from '@/components/Header';
import SurveyQuestion from '@/components/SurveyQuestion';
import { notFound } from 'next/navigation';

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

    useEffect(() => {
        const fetchSurveyData = async () => {
            setLoading(true)
            const res = await fetch('/api/survey');
            const data = await res.json();
            setSurveyData(data)
            setCurrentQuestion(data?.first_question)
            setLoading(false)
        };
        fetchSurveyData();
    }, []);


    const onChange = (e: React.ChangeEvent<HTMLInputElement>, shouldBeOnlyOptionSelected: boolean = false) => {
        const tempAnswers = { ...answers } as IAnswers
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
                    ...(tempAnswers[currentQuestion.name] || {}),
                    [e.target.name]: { point: +e.target.value, shouldBeOnlyOptionSelected }
                }
            } else {
                tempAnswers[currentQuestion.name] = {
                    [e.target.name]: { point: +e.target.value, shouldBeOnlyOptionSelected }
                }
            }
        } else {
            delete tempAnswers[currentQuestion.name][e.target.name]
            if (!Object.keys(tempAnswers[currentQuestion.name])?.length) {
                delete tempAnswers[currentQuestion.name]
            }
        }
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
                surveyData?.survey_questions_length : 
                (currentOption?.linked_question?.length || 0)
            ]
        )
        setPreviousQuestions((prev: any) => [...prev, currentQuestion])
        const getNextQuestion = async (questionId: string) => {
            return await client.fetch(`
        *[_type == "question" && _id==$questionId][0]{
          ...,
          next_Question->,
          options[]{
            ...,
            linked_question[]->,
            next_Question->,
          }
        }
      `, { questionId })
        }
        const questionId = currentOption?.next_Question ?
            currentOption?.next_Question?._id :
            currentQuestion?.next_Question?._id
        if (questionId) {
            const nextQuestion = await getNextQuestion(questionId)
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
                                        disabled={fetching || !answers?.[currentQuestion?.name]}
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