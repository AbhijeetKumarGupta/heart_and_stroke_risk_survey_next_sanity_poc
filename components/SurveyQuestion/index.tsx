import { FIELD_TYPES } from "@/src/constant";
import { SELECTORS } from "@/cypress/selectors";

import styles from "./surveyQuestion.module.css";

export default function SurveyQuestion(
    { currentQuestion, answers, onChange, isSubmitting, isBasicInfo }: ISurveyQuestionProps
) {
    return (
        <div className={isBasicInfo ? '' : styles.questionContainer}>
            {
                isBasicInfo ?
                    <label 
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.LABEL} 
                        htmlFor={currentQuestion.name}
                    >
                        {currentQuestion.title}
                    </label>
                :
                    <h3
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.LABEL}
                    >
                        〕{currentQuestion?.title}
                    </h3>
            }
            <span
                data-test={SELECTORS.SURVEY_PAGE.QUESTION.DESCRIPTION}
                className={isBasicInfo ? '' : styles.questionDescription}
            >
                {currentQuestion?.description}
            </span>
            <div className={isBasicInfo ? '' : styles.optionsContainer}>
                {
                    currentQuestion?.field_type === FIELD_TYPES.MULTIPLE_CHOICE &&
                        currentQuestion?.options?.map((option: IOption) => (
                            <label 
                                key={option.name} 
                                className={styles.optionLabel} 
                                data-test={SELECTORS.SURVEY_PAGE.QUESTION.OPTIONS}
                            >
                                <input
                                    type={currentQuestion.multipleSelect ? "checkbox" : "radio"}
                                    name={option?.name}
                                    title={option?.title}
                                    onChange={(e) => onChange(e, option)}
                                    value={option?.point}
                                    checked={(answers?.[currentQuestion?.name] as MultipleChoiceAnswer)?.[option?.name] !== undefined}
                                    className={styles.optionInput}
                                    disabled={isSubmitting}
                                    data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                                />
                                {option?.title}
                            </label>
                        ))
                }
                {
                    currentQuestion?.field_type === FIELD_TYPES.STRING &&
                    <input
                        type="text"
                        name={currentQuestion?.name}
                        onChange={onChange}
                        value={answers?.[currentQuestion?.name] as number ?? ""}
                        disabled={isSubmitting}
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                    />
                }
                {
                    currentQuestion?.field_type === FIELD_TYPES.NUMERICAL &&
                    <input
                        type="number"
                        name={currentQuestion?.name}
                        onChange={onChange}
                        value={answers?.[currentQuestion?.name] as number ?? ""}
                        disabled={isSubmitting}
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                    />
                }
                {
                    currentQuestion?.field_type === FIELD_TYPES.DROPDOWN &&
                    <select
                        value={Object.values(answers?.[currentQuestion?.name] || {})?.[0]?.value || ""}
                        id={currentQuestion?.name}
                        name={currentQuestion?.name}
                        onChange={onChange}
                        disabled={isSubmitting}
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                    >
                        <option value="" disabled>Select an option</option>
                        {currentQuestion?.options?.map((option: IOption) =>
                            <option value={`${option.name}-${option.point}`} key={option.name}>{option.title}</option>
                        )
                        }
                    </select>
                }
            </div>
        </div>
    )
}