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
        ...,
        next_Question->,
        options[]{
          ...,
          "linked_questions_count": count(linked_question),
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