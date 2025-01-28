import contentfulClient from "@/contentful/contentfulClient";
import { getFormattedResponse } from "@/src/utils/survey";

export async function GET() {
  try {
    const basicInfoQuestions = await contentfulClient.getEntries({
      content_type: 'contactInformation',
      include: 3
    });

    return new Response(
      JSON.stringify(getFormattedResponse(basicInfoQuestions.items)?.[0]),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching basic info questions', error }),
      { status: 500 }
    );
  }
}