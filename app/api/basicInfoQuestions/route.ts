import client from "@/sanity/sanityClient";

export async function GET() {
  try {
    const basicInfoQuestions = await client.fetch(`
      *[_type== "basic_information"][0]{
        basic_information_questions[]->{
            title,
            name,
            multipleSelect,
            isRequired,
            field_type
        }
      }`);

    return new Response(
      JSON.stringify(basicInfoQuestions),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching basic info questions', error }),
      { status: 500 }
    );
  }
}