import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { quizApi } from '../../services/quiz';
import { userApi } from '../../services/user';

const initialState = {
  questions: [],
  categoryQuestions: [],
  category: 'coffee',
  choices: [],
  answers: {},
  results: [],
  quizCategories: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    getCategoryQuestions: (state, action) => {
      state.categoryQuestions = state.questions.filter(
        (question) => question.quiz_type === action.payload,
      );
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setAnswer: (state, action) => {
      state.answers[action.payload.param] = action.payload.answer;
    },
    setQuizCategories: (state, action) => {
      state.quizCategories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(quizApi.endpoints.getQuestions.matchFulfilled, (state, action) => {
      state.questions = [...action.payload];
    });
    builder.addMatcher(quizApi.endpoints.postAnswers.matchFulfilled, (state, action) => {
      state.results = action.payload;
    });
    builder.addMatcher(userApi.endpoints.getProductPreferences.matchFulfilled, (state, action) => {
      state.answers = action.payload;
    });
    builder.addMatcher(authApi.endpoints.logoutUser.matchFulfilled, (state) => {
      state.answers = {};
    });
  },
});

export const {
  nextQuestion,
  previousQuestion,
  setQuestion,
  getCategoryQuestions,
  setCategory,
  setAnswer,
  setQuizCategories,
} = quizSlice.actions;

export default quizSlice.reducer;
