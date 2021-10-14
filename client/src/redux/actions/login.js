import {createAction} from 'redux-act';

export const fetchUser = createAction('Fetch User Request')
export const fetchUserSuccessful = createAction('Fetch User Request Success')
export const fetchUserFailure = createAction('Fetch User Request Fail')
export const logout = createAction('Logout User')
export const logoutSuccessful = createAction('Ending Session and Clear Localstorage')


export const getTotalBudgetSummarize = createAction('Get Total Budget Summarize')
export const getTotalBudgetSummarizeSuccessful = createAction('Get Total Budget Summarize Success')
export const getTotalBudgetSummarizeFailure = createAction('Get Total Budget Summarize Fail')


