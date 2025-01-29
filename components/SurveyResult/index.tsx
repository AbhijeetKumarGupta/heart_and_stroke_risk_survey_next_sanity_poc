import { SELECTORS } from "@/cypress/selectors";
import { documentToReact, filterUniqueByIdentifier } from "@/src/utils/survey";

import styles from "./surveyResult.module.css";

export default function SurveyResult({ riskFactors }: { riskFactors: ProcessedRiskFactor }) {

    const filteredRiskFactors = filterUniqueByIdentifier(Object.values(riskFactors));

    return (
        <div className={styles.resultContainer}>
            <h3
                data-test={SELECTORS.RESULT_PAGE.TITLE}
                className={styles.title}
            >
                Survey Results
            </h3>
            <div className={styles.resultContent}>
                <h3 className={styles.sectionTitle}>Keep it up</h3>
                {
                    filteredRiskFactors?.map((riskFactor, index) => 
                        riskFactor?.category?.title === 'Keep it up' && (
                        <div className={styles.riskFactor} key={index}>
                            <h4>{riskFactor?.identifier}</h4>
                            {documentToReact(riskFactor.description)}
                            <div className={styles.recommendationTitle}>Recommendation:</div>
                            <ul className={styles.recommendationList}>
                            {
                                riskFactor?.recommendation[0]?.points?.map((recommendation: string, index: number) => (
                                    <li key={index}>{recommendation}</li>
                                ))
                            }
                            </ul>
                        </div>
                    ))
                }
                <hr />
                <h3 className={styles.sectionTitle}>Risk To Manage</h3>
                {
                    filteredRiskFactors?.map((riskFactor, index) => 
                        riskFactor?.category?.title === 'Risk To Manage' && (
                        <div className={styles.riskFactor} key={index}>
                            <h4>{riskFactor?.identifier}</h4>
                            {documentToReact(riskFactor.description)}
                            <div className={styles.recommendationTitle}>Recommendation:</div>
                            <ul className={styles.recommendationList}>
                            {
                                riskFactor?.recommendation[0]?.points?.map((recommendation: string, index: number) => (
                                    <li key={index}>{recommendation}</li>
                                ))
                            }
                            </ul>
                        </div>
                    ))
                }
                <hr />
                <h3 className={styles.sectionTitle}>Risk To Be Aware Of</h3>
                {
                    filteredRiskFactors?.map((riskFactor, index) => 
                        riskFactor?.category?.title === 'Risk To Be Aware Of' && (
                        <div className={styles.riskFactor} key={index}>
                            <h4>{riskFactor?.identifier}</h4>
                            {documentToReact(riskFactor.description)}
                            <div className={styles.recommendationTitle}>Recommendation:</div>
                            <ul className={styles.recommendationList}>
                            {
                                riskFactor?.recommendation[0]?.points?.map((recommendation: string, index: number) => (
                                    <li key={index}>{recommendation}</li>
                                ))
                            }
                            </ul>
                        </div>
                    ))
                }
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
