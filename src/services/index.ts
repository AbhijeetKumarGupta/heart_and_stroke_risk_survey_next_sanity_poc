import axios, { AxiosResponse } from "axios";

class Service{

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': "GET, POST",
    }

    getFormattedResponse = (response: AxiosResponse<any, any>) => {
        return {
            data: response.data, 
            status: response.status
        } as API_Response
    }

    getFormattedUrl = (
        endpoint: string,
        baseUrl: string = '',
    ) => {
        return `${baseUrl}/api/${endpoint}`
    }

    get = (
        endpoint: string,
        baseUrl: string = '',
    ) => {
        return new Promise((
            resolve: (value: API_Response) => void, 
            reject: (errorObject: ErrorObject) => void
        ) => {
            axios
            .get(
                this.getFormattedUrl(endpoint, baseUrl),
                {
                   headers: this.headers 
                }
            )
            .then((response) => resolve(this.getFormattedResponse(response)))
            .catch((error) => reject({error, value: {}}));
        })
    }

    post = (
        endpoint: string,
        body: {},
        baseUrl: string = ''
    ) => {
        return new Promise((
            resolve: (value: API_Response) => void, 
            reject: (errorObject: ErrorObject) => void
        ) => {
            axios
            .post(
                this.getFormattedUrl(endpoint, baseUrl),
                {
                    ...body
                },
                {
                   headers: this.headers
                }
            )
            .then((response) => resolve(this.getFormattedResponse(response)))
            .catch((error) => reject(error));
        })
    }

}

export default new Service();