import { SELECTORS } from "@/cypress/selectors";

import styles from "./header.module.css";

export default function Header(
    { surveyData, noOfQuestions, answeredQuestions, showProgressBar }
    : IHeaderProps
) {

    const progress = answeredQuestions && noOfQuestions ? (answeredQuestions/noOfQuestions)*100 : 0;

    return (
        <div className={styles.header}>
            <h1 
                data-test={SELECTORS.SURVEY_PAGE.SURVEY.NAME}
            >
                {surveyData?.survey_name}
            </h1>
            <p 
                data-test={SELECTORS.SURVEY_PAGE.SURVEY.DESCRIPTION}
            >
                {surveyData?.description}
            </p>
            {showProgressBar &&
            <div className={styles.progressBarContainer}>
                <div
                    data-test={SELECTORS.SURVEY_PAGE.PROGRESS.LABEL} 
                    className={styles.progressBarLabel}
                >
                    <span>Progress</span>
                </div>
                <div
                    data-test={SELECTORS.SURVEY_PAGE.PROGRESS.BAR} 
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                />
                <div
                    data-test={SELECTORS.SURVEY_PAGE.PROGRESS.AMOUNT}
                    className={styles.progressPercentage}
                >
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
            }
        </div>
    )
}