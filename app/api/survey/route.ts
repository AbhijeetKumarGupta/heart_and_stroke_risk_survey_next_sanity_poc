import contentfulClient from "@/contentful/contentfulClient";
import services from "@/src/services";
import { getFormattedResponse } from "@/src/utils/survey";

export async function GET() {
  try {
    const surveyData = await contentfulClient.getEntries({
      content_type: 'surveyInformation',
    });
    return new Response(
      JSON.stringify(getFormattedResponse(surveyData.items)?.[0]),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching survey data', error }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const response = await services.post('survey', payload, process.env.BE_BASE_URL);

    if (response?.status === 201) {
      return new Response(
        JSON.stringify(response?.data),
        { status: response?.status }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Failed to submit survey' }),
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error submitting survey', error }),
      { status: 500 }
    );
  }
}