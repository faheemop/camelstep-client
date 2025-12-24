import { api } from './api';

export const quizApi = api.injectEndpoints({
  reducerPath: 'quizApi',
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => 'quiz',
      transformResponse: (response) => response.data.questions,
    }),
    postAnswers: builder.mutation({
      query: (body) => ({
        url: 'quiz',
        method: 'post',
        body,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetQuestionsQuery, usePostAnswersMutation } = quizApi;
