import { sanityFetch } from "@/sanity/lib/live";
import services from "@/src/services";

export async function GET() {
  try {
    const surveyData = await sanityFetch({
      query: `*[_type== "survey"][0]{
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
      }`
    })

    return new Response(
      JSON.stringify(surveyData.data),
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
    const response = await services.post('survey', payload, process.env.BASE_URL);

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