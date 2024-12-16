interface IOption {
    name: string;
    title: string;
    point: number;
    next_Question?: {
        _id: string;
    };
    no_of_linked_questions: number | null;
    only_option_selected?: boolean;
}

interface IQuestion {
    multipleSelect: boolean;
    options: IOption[];
    title: string;
    isRequired: boolean;
    name: string;
    next_Question?: IQuestion;
    description: string;
    field_type: 'numerical' | 'multiple_choice' | 'dropdown';
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
    non_dependent_questions_count: number;
    survey_name: string;
    description: string;
    risk_range: IRiskRange;
    first_question: IQuestion;
}

interface ISelectedOption {
    point: number;
    shouldBeOnlyOptionSelected: boolean;
}

type MultipleChoiceAnswer = {
    [optionName: string]: ISelectedOption;
}

interface IAnswers {
    [questionName: string]: MultipleChoiceAnswer | number;
}

interface IHeaderProps { 
    surveyData: ISurveyData;
    noOfQuestions: number;
    answeredQuestions: numbe;
}

interface ISurveyResultProps { 
    surveyData: ISurveyData;
    answers: IAnswers;
}

interface ISurveyQuestionProps { 
    currentQuestion: IQuestion; 
    answers: IAnswers;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, option?: IOption) => void;
}

interface IRoutingButtonProps {
    buttonText: string;
    route: string;
    className: string;
}
