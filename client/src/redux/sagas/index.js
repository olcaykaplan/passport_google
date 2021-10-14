import { takeLatest } from "redux-saga/effects";

// saga and actions will be here
import * as loginAction from "../actions/login";
import * as loginSaga from "./login";


export default function* saga() {
  // make relations like [action, saga] inside relations
 const relations = [
      [loginAction, loginSaga],
    ];

  for (const [actions, sagas] of relations) {
    for (const [actionName, action] of Object.entries(actions)) {
      const saga = sagas[actionName];
      if (saga) {
        yield takeLatest(action.getType(), saga);
      }
    }
  }
}
