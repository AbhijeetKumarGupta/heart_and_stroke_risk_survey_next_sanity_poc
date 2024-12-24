import styles from "./header.module.css";

export default function Header(
    { surveyData, noOfQuestions, answeredQuestions, showProgressBar }
    : IHeaderProps
) {

    const progress = answeredQuestions && noOfQuestions ? (answeredQuestions/noOfQuestions)*100 : 0;

    return (
        <div className={styles.header}>
            <h1>{surveyData?.survey_name}</h1>
            <p>{surveyData?.description}</p>
            {showProgressBar &&
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBarLabel}>
                    <span>Progress</span>
                </div>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                />
                <div className={styles.progressPercentage}>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
            }
        </div>
    )
}