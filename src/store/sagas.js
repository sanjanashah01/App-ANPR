import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import ProfileSaga from "./auth/profile/saga";

export default function* rootSaga() {
  yield all([fork(LayoutSaga), fork(ProfileSaga)]);
}
