import { api } from './api';

export const blogsApi = api.injectEndpoints({
  reducerPath: 'blogsApi',
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: ({ page = 1, count = 15, lang }) => ({
        url: `/blogs?page=${page}&per=${count}&lang=${lang}`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data.records,
    }),
    getSingleBlog: builder.query({
      query: ({ slug, lang }) => `blogs/${slug}?lang=${lang}`,
      method: 'GET',
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
} = blogsApi;
