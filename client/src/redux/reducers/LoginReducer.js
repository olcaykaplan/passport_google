import {
  fetchUserSuccessful,
  fetchUserFailure,
  logoutSuccessful,
  getTotalBudgetSummarizeSuccessful,
  getTotalBudgetSummarizeFailure
} from "../actions/login";
import { createReducer } from "redux-act";
const DEFAULT_USER = {
  userInfo: JSON.parse(localStorage.getItem("userInfo"))?.userInfo || null,
  isAuthenticated:
    JSON.parse(localStorage.getItem("userInfo"))?.isAuthenticated || false,
  totalBudgetSummarize: {
    expense: "",
    income: "",
    totalBudget: "",
  },
};

export default createReducer(
  {
    [fetchUserSuccessful]: (state, payload) => {
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          userInfo: payload ? payload : null,
          isAuthenticated: payload ? true : false,
        })
      );
      return {
        ...state,
        userInfo: payload ? payload : null,
        isAuthenticated: payload ? true : false,
      };
    },
    [fetchUserFailure]: (state, payload) => {
      return {
        ...state,
      };
    },
    [logoutSuccessful]: (state, payload) => {
      localStorage.clear();
      window.location.href = "/login";
      return {
        ...state,
        userInfo: null,
        isAuthenticated: false,
      };
    },
    [getTotalBudgetSummarizeSuccessful]: (state, payload) => {
      return {
        ...state,
        totalBudgetSummarize: { ...payload },
      };
    },
    [getTotalBudgetSummarizeFailure]: (state, payload) => {
      return {
        ...state,
      };
    },
  },
  DEFAULT_USER
);
