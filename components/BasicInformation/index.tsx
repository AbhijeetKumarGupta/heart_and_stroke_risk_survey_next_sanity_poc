import SurveyQuestion from "../SurveyQuestion";
import styles from "./basicInformation.module.css";

export default function BasicInformation({ basicInfoQuestions, basicInfoData, setBasicInfoData }: IBasicInformationProps) {
    return (
        <div className={styles.formContainer}>
            <h3>Basic Information</h3>
            <div className={styles.form}>
                {basicInfoQuestions?.map((question) =>
                    <div className={styles.formGroup} key={question.name}>
                        <SurveyQuestion 
                            currentQuestion={question}
                            answers={basicInfoData} 
                            onChange={(e) => {
                                setBasicInfoData((prev: any) => {
                                    return({
                                        ...prev,
                                        [question.name]: e.target.value
                                    })
                                })
                            }} 
                            isSubmitting={false}
                            isBasicInfo={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
