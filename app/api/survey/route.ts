import client from "@/sanity/sanityClient";

export async function GET() {
  try {
    const surveyData = await client.fetch(`
      *[_type== "survey"][0]{
        survey_name,
        description,
        risk_range,
        non_dependent_questions_count,
        first_question->{
          title,
          name,
          description,
          field_type,
          isRequired,
          multipleSelect,
          field_type,
          next_Question->{
            _id,
          },
          options[]{
            title,
            name,
            no_of_linked_questions,
            point,
            only_option_selected,
            next_Question[]->{
              _id,
            }
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