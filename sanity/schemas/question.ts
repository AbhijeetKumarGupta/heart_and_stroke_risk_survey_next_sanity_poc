import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'question',
    title: 'Question',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().min(1).error('Title is required'),
        }),
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(1).error('Name is required'),
        }),
        defineField({
            name: 'multipleSelect',
            title: 'Multiple Select',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'string',
        }),
        defineField({
            name: 'isRequired',
            title: 'Mandatory Field',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'options',
            title: 'Options',
            type: 'array',
            of: [
                defineField({
                    name: 'option',
                    title: 'Option',
                    type: 'document',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: (Rule) => Rule.required().min(1).error('Title is required'),
                        }),
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                            validation: (Rule) => Rule.required().min(1).error('Name is required'),
                        }),
                        defineField({
                            name: 'point',
                            title: 'Point',
                            type: 'number',
                            initialValue: 0,
                        }),
                        defineField({
                            name: 'only_option_selected',
                            title: 'Should be only option selected(if selected}',
                            type: 'boolean',
                            initialValue: false,
                        }),
                        /* [Not being used currently] Part of a previous solution which was replaced with current solution due to complexity */
                        defineField({
                            name: 'linked_question',
                            title: 'Linked Question',
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
                            name: 'next_Question',
                            title: 'Next Question',
                            type: 'reference',
                            to: [{ type: 'question' }],
                        }),
                    ]
                })
            ],
        }),
        defineField({
            name: 'next_Question',
            title: 'Next Question',
            type: 'reference',
            to: [{ type: 'question' }],
        }),
    ],
});

