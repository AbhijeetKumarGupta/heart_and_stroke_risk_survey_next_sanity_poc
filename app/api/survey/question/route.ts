import client from "@/sanity/sanityClient";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get('questionId');

  if (!questionId) {
    return NextResponse.json(
      { success: false, message: '"questionId" is required' },
      { status: 400 }
    );
  }

  try {
    const question = await client.fetch(`
      *[_type == "question" && _id==$questionId][0]{
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
          next_Question->{
            _id,
          },
        }
      }
    `, { questionId });

    return NextResponse.json(question, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error fetching question', error: error.message || error },
      { status: 500 }
    );
  }
}