import styles from "./header.module.css";

export default function Header({ surveyData }: IHeaderProps) {

    // Logic to be added
    const progress = 30;

    return (
        <div className={styles.header}>
            <h1>{surveyData?.survey_name}</h1>
            <p>{surveyData?.description}</p>
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
        </div>
    )
}