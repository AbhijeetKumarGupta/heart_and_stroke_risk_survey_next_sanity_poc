import { FIELD_TYPES } from "@/src/constant";

import styles from "./surveyQuestion.module.css";

export default function SurveyQuestion({ currentQuestion, answers, onChange }: ISurveyQuestionProps) {
    return (
        <div className={styles.questionContainer}>
            <h3>〕{currentQuestion?.title}</h3>
            <span className={styles.questionDescription}>{currentQuestion?.description}</span>
            <div className={styles.optionsContainer}>
                {
                    currentQuestion?.field_type === FIELD_TYPES.MULTIPLE_CHOICE &&
                    currentQuestion?.options?.map((option: IOption) => (
                        <label key={option.name} className={styles.optionLabel}>
                            <input
                                type="checkbox"
                                name={option?.name}
                                title={option?.title}
                                onChange={(e) => onChange(e, option)}
                                value={option?.point}
                                checked={(answers?.[currentQuestion?.name] as MultipleChoiceAnswer)?.[option?.name] !== undefined}
                                className={styles.optionInput}
                            />
                            {option?.title}
                        </label>
                    ))
                }
                {
                    currentQuestion?.field_type === FIELD_TYPES.NUMERICAL &&
                    <input
                        type="number"
                        name={currentQuestion?.name}
                        onChange={onChange}
                    />
                }
            </div>
        </div>
    )
}