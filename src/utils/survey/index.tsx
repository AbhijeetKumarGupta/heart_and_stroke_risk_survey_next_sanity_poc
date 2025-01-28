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
    filterUniqueByIdentifier
}