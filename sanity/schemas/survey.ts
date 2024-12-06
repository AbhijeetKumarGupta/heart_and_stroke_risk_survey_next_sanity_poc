import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'survey',
  title: 'Survey',
  type: 'document',
  fields: [
    defineField({
      name: 'survey_name',
      title: 'Survey Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).error('Name is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).error('Description is required'),
    }),
    /* [Not being used currently] Part of a previous solution which was replaced with current solution due to complexity */
    defineField({
      name: 'survey_questions',
      title: 'Survey Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'question' }],
        },
      ],
    }),
    /* * */
    defineField({
      name: 'first_question',
      title: 'First Question',
      type: 'reference',
      to: [{ type: 'question' }],
  }),
    defineField({
      name: 'risk_range',
      title: 'Risk Range',
      type: 'document',
      fields: [
        defineField({
          name: 'low_risk_range',
          title: 'Low Risk Range',
          type: 'document',
          fields: [
            defineField({
              name: 'min',
              title: 'Min',
              type: 'number',
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'moderate_risk_range',
          title: 'Moderate Risk Range',
          type: 'document',
          fields: [
            defineField({
              name: 'min',
              title: 'Min',
              type: 'number',
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'high_risk_range',
          title: 'High Risk Range',
          type: 'document',
          fields: [
            defineField({
              name: 'min',
              title: 'Min',
              type: 'number',
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
});
