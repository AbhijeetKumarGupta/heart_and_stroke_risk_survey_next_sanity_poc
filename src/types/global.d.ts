type API_Response = {
    data: any
    status: number
}

type ErrorObject = {
    error: any,
    value: any
}

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
    field_type: 'string' | 'numerical' | 'multiple_choice' | 'dropdown';
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
    shouldBeOnlyOptionSelected?: boolean;
    value?: string;
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
    showProgressBar: boolean
}

interface ISurveyResultProps {
    surveyData: ISurveyData;
    answers: IAnswers;
}

interface ISurveyQuestionProps {
    currentQuestion: IQuestion;
    answers: IAnswers;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, option?: IOption) => void;
    isSubmitting: boolean
    isBasicInfo?: boolean
}

interface IRoutingButtonProps {
    buttonText: string;
    route: string;
    className: string;
    onClick?: () => void
}

type IndexableObject = {
    [key: string]: number
}

interface IFinalAnswers {
    [key: string]: IndexableObject | number
}

interface IBasicInformationProps {
    basicInfoQuestions: IQuestion[],
    basicInfoData: any,
    setBasicInfoData: (data: unknown) => void
}

interface ISurveyPayload {
    user_info: {
        [key: string]: string
    },
    answers: {
        [key: string]: {
            [key: string]: number
        } | number
    }
}

interface SurveyState {
    currentQuestion: IQuestion | null;
    answers: IAnswers;
    previousQuestions: IQuestion[];
    counts: number[];
    isLastQuestion: boolean;
    showResults: boolean;
    basicInfoData: any;
    surveyData: ISurveyData | null;
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
}

interface ISurveyState {
    surveyData: ISurveyData | null;
    currentQuestion: IQuestion | null;
    basicInfoQuestions: IQuestion[];
    answers: IAnswers;
    previousQuestions: IQuestion[];
    counts: number[];
    isLastQuestion: boolean;
    showResults: boolean;
    basicInfoData: any;
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
}