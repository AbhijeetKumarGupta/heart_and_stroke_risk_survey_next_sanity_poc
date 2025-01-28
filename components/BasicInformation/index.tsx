import { ChangeEvent } from "react";

import { SELECTORS } from "@/cypress/selectors";
import { documentToReact } from "@/src/utils/survey";

import SurveyQuestion from "../SurveyQuestion";
import styles from "./basicInformation.module.css";

export default function BasicInformation({ basicInfoQuestions, answers, setBasicInfoData }: {
    basicInfoQuestions: BasicInformation;
    answers: Answers & BasicInfoData;
    setBasicInfoData: (data: BasicInfoData) => void
}) {
    return (
        <div className={styles.formContainer}>
            <h3
                data-test={SELECTORS.SURVEY_PAGE.BASIC_INFORMATION.TITLE}
            >
                {basicInfoQuestions?.title}
            </h3>
            <div
                data-test={SELECTORS.WELCOME_PAGE.DESCRIPTION}
                className={styles.description}
            >
                {basicInfoQuestions?.description
                    ? documentToReact(basicInfoQuestions.description)
                    : 'Loading description...'}
            </div>
            <div className={styles.form}>
                {basicInfoQuestions?.questions?.map((question: Question) =>
                    <div
                        data-test={SELECTORS.SURVEY_PAGE.BASIC_INFORMATION.QUESTIONS}
                        className={styles.formGroup}
                        key={question?.name}
                    >
                        <SurveyQuestion
                            currentQuestion={question}
                            answers={answers}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setBasicInfoData({
                                    [question?.name]: e.target.value
                                })
                            }
                            isSubmitting={false}
                            isBasicInfo={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
