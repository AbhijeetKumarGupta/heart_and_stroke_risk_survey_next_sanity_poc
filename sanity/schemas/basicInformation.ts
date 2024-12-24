import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'basic_information',
    title: 'Basic Information',
    type: 'document',
    fields: [
        defineField({
            name: 'basic_information_questions',
            title: 'Basic Information Questions',
            type: 'array',
            of: [
              {
                type: 'reference',
                to: [{ type: 'question' }],
              },
            ],
        })
    ],
});
