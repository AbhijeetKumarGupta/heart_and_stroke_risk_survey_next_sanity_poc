interface IOption {
    name: string;
    title: string;
    point: number;
    next_Question?: {
        _id: string;
    };
    only_option_selected?: boolean;
    linked_question?: {
        _id: string;
    }[];
}

interface IQuestion {
    multipleSelect: boolean;
    options: IOption[];
    title: string;
    isRequired: boolean;
    name: string;
    next_Question?: IQuestion;
    description: string;
    _id: string;
}

interface IRiskRange {
    low_risk_range: {
        min: number;
        max: number;
        message: string;
    };
    moderate_risk_range: {
        min: number;
        max: number;
        message: string;
    };
    high_risk_range: {
        min: number;
        max: number;
        message: string;
    };
}

interface ISurveyData {
    survey_questions_length: number,
    survey_name: string;
    description: string;
    risk_range: IRiskRange;
    first_question: IQuestion;
}

interface ISelectedOption {
    point: number;
    shouldBeOnlyOptionSelected: boolean;
}

interface IAnswers {
    [questionName: string]: {
        [optionName: string]: ISelectedOption;
    };
}

interface IHeaderProps { 
    surveyData: ISurveyData;
    noOfQuestions: number,
    answeredQuestions: number,
}

interface ISurveyResultProps { 
    surveyData: ISurveyData;
    answers: IAnswers;
}

interface ISurveyQuestionProps { 
    currentQuestion: IQuestion; 
    answers: IAnswers;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, shouldBeOnlyOptionSelected: boolean) => void 
}

