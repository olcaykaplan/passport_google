import { put } from "redux-saga/effects";
import axios from "axios";

import {
  fetchUserSuccessful,
  fetchUserFailure,
  logoutSuccessful,
  getTotalBudgetSummarizeSuccessful,
  getTotalBudgetSummarizeFailure
} from "../actions/login"; // action

//const LOGOUT = "http://localhost:5000/api/v1/auth/logout"
const LOGOUT = "https://google-passportjs.herokuapp.com/api/v1/auth/logout"
//const fetch_user = "http://localhost:5000/api/v1/auth/user"
const fetch_user = "https://google-passportjs.herokuapp.com/api/v1/auth/user"
//const total_budget_summarize = "http://localhost:5000/api/v1/budget/totalBudgetSummarize"
const total_budget_summarize = "https://google-passportjs.herokuapp.com/api/v1/budget/totalBudgetSummarize"
export function* fetchUser() {
  try {
    console.log("fetchUser")
    const user = yield axios.get(fetch_user, { withCredentials: true });
    console.log("saga outh user",user)
    yield put(fetchUserSuccessful(user.data));
  } catch (error) {
    console.log("error",error)
    yield put(fetchUserFailure);
  }
}

export function* getTotalBudgetSummarize() {
    try {
      const payload = yield axios.get(total_budget_summarize, {
        withCredentials: true,
      });
      yield put(getTotalBudgetSummarizeSuccessful(payload.data));
    } catch (error) {
      console.log("getTotalBudgetSummarize  hata oluştu", error);
      yield put(getTotalBudgetSummarizeFailure());
    }
  }

export function* logout() {
  try {
    yield axios.get(LOGOUT, { withCredentials: true });
    console.log("logoutSuccessful")
    yield put(logoutSuccessful());
  } catch (error) {
    //  yield put(logoutSuccessful);
  }
}
