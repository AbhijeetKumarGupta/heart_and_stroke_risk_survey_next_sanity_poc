import contentfulClient from '@/contentful/contentfulClient';
import { getFormattedResponse } from '@/src/utils/survey';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('questionId');

  if (!slug) {
    return NextResponse.json(
      { success: false, message: '"Slug" is required' },
      { status: 400 }
    );
  }

  try {
    const question = await contentfulClient.getEntries({
      content_type: 'question',
      'fields.slug': slug,
      include: 3,
    })
    return NextResponse.json(getFormattedResponse(question.items)?.[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error fetching question', error: error.message || error },
      { status: 500 }
    );
  }
}