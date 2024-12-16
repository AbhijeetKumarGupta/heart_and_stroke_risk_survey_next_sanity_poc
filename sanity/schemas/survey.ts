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
      name: 'non_dependent_questions_count',
      title: 'No of non-dependent questions',
      type: 'number',
      validation: (Rule) => Rule.required().error('No of non-dependent questions is required'),
    }),
    defineField({
      name: 'first_question',
      title: 'First Question',
      type: 'reference',
      to: [{ type: 'question' }],
      validation: (Rule) => Rule.required().error('First question is required'),
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
              validation: (Rule) => Rule.required().min(0).error('Minimum value is required'),
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
              validation: (Rule) => Rule.required().error('Maximum value is required'),
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
              validation: (Rule) => Rule.required().min(0).error('Minimum value is required'),
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
              validation: (Rule) => Rule.required().error('Maximum value is required'),
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
              validation: (Rule) => Rule.required().min(0).error('Minimum value is required'),
            }),
            defineField({
              name: 'max',
              title: 'Max',
              type: 'number',
              validation: (Rule) => Rule.required().error('Maximum value is required'),
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
