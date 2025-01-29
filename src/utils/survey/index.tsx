import services from "@/src/services"
import { BLOCKS, Block, Document } from '@contentful/rich-text-types';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { ReactNode } from "react";

export const documentToReact = (richTextDocument: Document): ReactNode => {
    const options: Options = {
        renderNode: {
          //@ts-ignore
          [BLOCKS.EMBEDDED_ENTRY]: (node: Block, children: React.ReactNode) => {
            return <div>{children}</div>;
          },
        },
    };
    return documentToReactComponents(richTextDocument, options)
}


export const getFormattedResponse = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(getFormattedResponse);
    }

    if (data && typeof data === 'object') {
        const result: any = {};

        for (const key in data) {
            if (key === 'sys' || key === 'locale' || key === 'locales' || key === 'metadata') {
                continue;
            }

            if (key === 'fields' && data[key] && typeof data[key] === 'object') {
                Object.assign(result, getFormattedResponse(data[key]));
            } else {
                const value = data[key];
                result[key] = getFormattedResponse(value);
            }
        }

        return result;
    }

    return data;
}

const getProcessedRiskFactors = (answers: Answers) => {
    const results: { [key: string]: RiskFactor } = {};
    const keysToIgnore = ['riskFactor', 'optionTitle', 'questionTitle']

    const processSubOptions = (questionKey: string, optionKey: string, optionData: {[key: string]: any}) => {
        Object.keys(optionData).forEach((subOptionKey) => {
            if (keysToIgnore.includes(subOptionKey)) return;
            const subOptionValue = optionData[subOptionKey];
            if (subOptionValue) {
                results[`${questionKey}-${optionKey}-${subOptionKey}`] = 
                answers[questionKey][optionKey][subOptionKey]?.riskFactor as RiskFactor;
            }
        });
    };

    const processOptions = (questionKey: string, questionData: {[key: string]: any}) => {
        Object.keys(questionData).forEach((optionKey) => {
            if (keysToIgnore.includes(optionKey)) return;
            const optionData = questionData[optionKey];
            if (optionData) {
                results[`${questionKey}-${optionKey}`] = answers[questionKey][optionKey]?.riskFactor as RiskFactor
                processSubOptions(questionKey, optionKey, optionData);
            }
        });
    };

    Object.keys(answers).forEach((questionKey) => {
        const questionData = answers[questionKey];
        processOptions(questionKey, questionData);
    });

    return results;
};

const filterUniqueByIdentifier = (data: Array<RiskFactor>) => {
    const seenIdentifiers = new Set();
    return data.filter(item => {
        if (!item || seenIdentifiers.has(item.identifier)) {
            return false;
        } else {
            seenIdentifiers.add(item.identifier);
            return true;
        }
    });
}

const fetchBasicInfoQuestions = async () => {
    try {
        const response = await services.get('basicInfoQuestions')
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
};

const fetchSurveyData = async () => {
    try {
        const response = await services.get('survey')
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

const fetchAgeInformationData = async () => {
    try {
        const response = await services.get('ageInformation')
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

const fetchNextQuestion = async (questionId: string) => {
    try {
        const response = await services.get(`survey/question?questionId=${questionId}`)
        return response
    } catch (errorObject: any) {
        console.error(errorObject?.error)
        return errorObject?.value
    }
}

export {
    fetchBasicInfoQuestions,
    fetchSurveyData,
    fetchNextQuestion,
    fetchAgeInformationData,
    filterUniqueByIdentifier,
    getProcessedRiskFactors
}