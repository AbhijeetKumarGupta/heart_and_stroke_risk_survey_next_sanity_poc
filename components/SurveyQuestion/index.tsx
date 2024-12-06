import styles from "./surveyQuestion.module.css";

export default function SurveyQuestion({ currentQuestion, answers, onChange } : ISurveyQuestionProps) {
    return (
        <div className={styles.questionContainer}>
            <h3>〕{currentQuestion?.title}</h3>
            <span className={styles.questionDescription}>{currentQuestion?.description}</span>
            <div className={styles.optionsContainer}>
                {currentQuestion?.options?.map((option: IOption) => (
                    <label key={option.name} className={styles.optionLabel}>
                        <input
                            type="checkbox"
                            name={option?.name}
                            title={option?.title}
                            onChange={(e) => onChange(e, !!option?.only_option_selected)}
                            value={option?.point}
                            checked={answers?.[currentQuestion?.name]?.[option?.name] !== undefined}
                            className={styles.optionInput}
                        />
                        {option?.title}
                    </label>
                ))}
            </div>
        </div>
    )
}