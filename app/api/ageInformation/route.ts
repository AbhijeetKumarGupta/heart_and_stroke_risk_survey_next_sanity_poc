import contentfulClient from "@/contentful/contentfulClient";
import { getFormattedResponse } from "@/src/utils/survey";

export async function GET() {
  try {
    const ageInfoQuestions = await contentfulClient.getEntries({
        content_type: 'ageInformation',
        include: 4
    });
    return new Response(
      JSON.stringify(getFormattedResponse(ageInfoQuestions.items)?.[0]),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching age information', error }),
      { status: 500 }
    );
  }
}