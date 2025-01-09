import { sanityFetch } from "@/sanity/lib/live";

export async function GET() {
  try {
    const basicInfoQuestions = await sanityFetch({
      query: `*[_type== "basic_information"][0]{
        basic_information_questions[]->{
            title,
            name,
            multipleSelect,
            isRequired,
            field_type
        }
      }`
    });

    return new Response(
      JSON.stringify(basicInfoQuestions.data),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching basic info questions', error }),
      { status: 500 }
    );
  }
}