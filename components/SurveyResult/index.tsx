import { SELECTORS } from "@/cypress/selectors";

import styles from "./surveyResult.module.css";

export default function SurveyResult({ answers, surveyData }: ISurveyResultProps) {

    const calculateTotalScore = () => {
        let totalPoints = 0;
        Object.keys(answers).forEach((questionName) => {
            Object.keys(answers[questionName]).forEach((optionName) => {
                // Need to revisit scoring logic of numerical field
                totalPoints += typeof answers[questionName] === 'number'
                    ? 0
                    : answers[questionName][optionName].point;
            });
        });
        return totalPoints;
    };

    const totalScore = calculateTotalScore();
    const riskCategory = surveyData
        ? totalScore >= (surveyData?.risk_range?.high_risk_range?.min || 0)
            ? 'High Risk'
            : totalScore >= (surveyData?.risk_range?.moderate_risk_range?.min || 0)
                ? 'Moderate Risk'
                : 'Low Risk'
        : 'Low Risk';

    return (
        <div className={styles.resultContainer}>
            <h3
                data-test={SELECTORS.RESULT_PAGE.TITLE}
            >
                Survey Results
            </h3>
            <div>
                <p
                    data-test={SELECTORS.RESULT_PAGE.SCORE}
                >
                    <strong>Total Score:</strong> {totalScore}
                </p>
                <p
                    data-test={SELECTORS.RESULT_PAGE.CATEGORY}
                >
                    <strong>Risk Category:</strong> {riskCategory}
                </p>
                <p>
                    {riskCategory === 'High Risk' && surveyData?.risk_range?.high_risk_range?.message}
                    {riskCategory === 'Moderate Risk' && surveyData?.risk_range?.moderate_risk_range?.message}
                    {riskCategory === 'Low Risk' && surveyData?.risk_range?.low_risk_range?.message}
                </p>
            </div>
            <p
                data-test={SELECTORS.RESULT_PAGE.DESCRIPTION}
                className={styles.thankYouMessage}
            >
                Thank you for completing the survey! Your responses are important for us to assess your health risk.
            </p>
        </div>
    )
}