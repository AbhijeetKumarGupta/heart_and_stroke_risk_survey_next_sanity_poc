import client from "@/sanity/sanityClient";

export async function GET() {
  try {
    const surveyData = await client.fetch(`
      *[_type== "survey"][0]{
        survey_name,
        description,
        risk_range,
        "survey_questions_length": count(survey_questions),
        first_question->{
          ...,
          next_Question->,
          options[]{
            ...,
            next_Question[]->
          }
        },
      }`);

    return new Response(
      JSON.stringify(surveyData),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching survey data', error }),
      { status: 500 }
    );
  }
}