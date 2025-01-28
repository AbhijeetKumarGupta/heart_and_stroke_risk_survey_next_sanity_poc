import { ChangeEvent } from "react";

import { FIELD_TYPES } from "@/src/constant";
import { SELECTORS } from "@/cypress/selectors";

import styles from "./surveyQuestion.module.css";

export default function SurveyQuestion(
    { currentQuestion, answers, onChange, isSubmitting, isBasicInfo }:
        {
            currentQuestion: Question;
            answers: Answers & BasicInfoData;
            onChange: (e: ChangeEvent<HTMLInputElement>, option?: Option, subOption?: SubOption) => void;
            isSubmitting: boolean;
            isBasicInfo?: boolean
        }
) {
    return (
        <div className={isBasicInfo ? styles.basicInfoContainer : styles.questionContainer}>
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
            <div key={currentQuestion.name} className={isBasicInfo ? '' : styles.optionsContainer}>
                {
                    currentQuestion?.fieldType === FIELD_TYPES.MULTIPLE_CHOICE &&
                    currentQuestion?.options?.map((option: any) => (
                        <div key={option?.name}>
                            <label
                                className={styles.optionLabel}
                                data-test={SELECTORS.SURVEY_PAGE.QUESTION.OPTIONS}
                            >
                                <input
                                    type={currentQuestion.allowMultipleSelect ? "checkbox" : "radio"}
                                    name={option?.name}
                                    title={option?.title}
                                    onChange={(e) => onChange(e, option)}
                                    value={option?.name}
                                    checked={answers?.[currentQuestion?.name]?.[option?.name] !== undefined}
                                    className={styles.optionInput}
                                    disabled={isSubmitting}
                                    data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                                />
                                {option?.title}
                            </label>
                            {
                                option?.subOptions?.length && answers?.[currentQuestion?.name]?.[option?.name] !== undefined &&
                                option?.subOptions?.map((subOption: any) => (
                                    <label
                                        className={styles.optionLabel}
                                        key={`${option?.name}-${subOption?.name}`}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <input
                                            type={currentQuestion.allowMultipleSelect ? "checkbox" : "radio"}
                                            name={subOption?.name}
                                            title={subOption?.title}
                                            onChange={(e) => onChange(e, option, subOption)}
                                            value={subOption?.name}
                                            checked={answers?.[currentQuestion?.name]?.[option?.name][subOption?.name] !== undefined}
                                            className={styles.optionInput}
                                            disabled={isSubmitting}
                                        // data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                                        />
                                        {subOption?.title}
                                    </label>
                                ))
                            }
                        </div>
                    ))
                }
                {
                    currentQuestion?.fieldType === FIELD_TYPES.STRING &&
                    <input
                        type="text"
                        name={currentQuestion?.name}
                        onChange={onChange}
                        value={answers?.[currentQuestion?.name] as string ?? ""}
                        disabled={isSubmitting}
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                    />
                }
                {
                    currentQuestion?.fieldType === FIELD_TYPES.NUMERICAL &&
                    <input
                        type="number"
                        name={currentQuestion?.name}
                        onChange={onChange}
                        value={answers?.[currentQuestion?.name] as number ?? ""}
                        disabled={isSubmitting}
                        data-test={SELECTORS.SURVEY_PAGE.QUESTION.INPUT_FIELD}
                    />
                }
            </div>
        </div>
    )
}