import { Document } from '@contentful/rich-text-types';

declare global {
    type API_Response = {
        data: any
        status: number
    }

    type ErrorObject = {
        error: any,
        value: any
    }
    
    type Instruction = {
        title: string;
        description: string;
        icon: Icon;
    };

    type Option = {
        title: string;
        name: string;
        nextQuestion: Question;
        subOptions?: SubOption[];
        riskFactor: RiskFactor;
        noOfRelatedSubQuestions?: number
    };

    type SubOption = {
        title: string;
        name: string;
        riskFactor?: RiskFactor;
    };

    type Question = {
        title: string;
        description: string;
        slug: string;
        nextQuestion?: Question;
        name: string;
        options?: Option[];
        isOptional: boolean;
        allowMultipleSelect: boolean;
        fieldType: 'Number' | 'String' | 'Multiple Choise';
    };

    type Recommendation = {
        title: string;
        points: string[];
    };

    type RiskFactor = {
        title: string;
        recommendation: Recommendation[];
        identifier: string;
        category: {
            title: string;
            description: Document;
        };
        description: Document;
    };

    type FilteredRiskFactor = {
        [key: string]: RiskFactor
    }

    type Counts = Array<number>
    //

    type SurveyData = {
        title: string;
        description: Document;
        instructions: Instruction[];
        firstQuestion: Question;
        noOfBaseQuestions: number;
    };

    type AgeInformation = {
        description: Document;
        nextQuestion: Question;
        question: Question;
        title: string;
    };

    type BasicInformation = {
        title: string;
        description: Document;
        questions: Question[];
    };

    type Answers = {
        [key: string]: {
            [key: string]: {
                riskFactor?: RiskFactor,
                [key?: string]: {
                    riskFactor?: RiskFactor,
                }
            }
        }
    }

    type BasicInfoData = {
        [key: string]: string | number
    }

    type ReduxState = {
        surveyData: SurveyData | null;
        currentQuestion: Question | null;
        ageInformation: AgeInformation | null;
        basicInfoQuestions: BasicInformation | null;
        answers: Answers | null;
        previousQuestions: any;
        counts: Counts;
        isLastQuestion: boolean;
        showResults: boolean;
        basicInfoData: BasicInfoData;
        loading: boolean;
        fetching: boolean;
        submitting: boolean;
        riskFactors: FilteredRiskFactor | null;
    }
}