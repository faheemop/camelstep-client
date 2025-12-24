import { createSlice } from '@reduxjs/toolkit';
import { blogsApi } from '../../services/blogs';

const initialState = {
  blogsList: [],
  blog: {},
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(blogsApi.endpoints.getAllBlogs.matchFulfilled, (state, action) => {
      state.blogsList = [...state.blogsList, ...action.payload];
    });
    builder.addMatcher(blogsApi.endpoints.getSingleBlog.matchFulfilled, (state, action) => {
      state.blog = action.payload;
    });
  },
});

export const blogsReducer = blogsSlice.reducer;
