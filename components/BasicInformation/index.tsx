import styles from "./basicInformation.module.css";

export default function BasicInformation({ basicInfoQuestions, basicInfoData, setBasicInfoData }: IBasicInformationProps) {
    return (
        <div className={styles.formContainer}>
            <h3>Basic Information</h3>
            <div className={styles.form}>
                {basicInfoQuestions?.map((question) =>
                    <div className={styles.formGroup} key={question.name}>
                        <label htmlFor={question.name}>{question.title}</label>
                        <input id={question.name} name={question.name} required={question.isRequired} value={basicInfoData?.[question.name] ?? ''}
                            onChange={(e) => {
                                setBasicInfoData((prev: any) => {
                                    return({
                                        ...prev,
                                        [question.name]: e.target.value
                                    })
                                })
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
