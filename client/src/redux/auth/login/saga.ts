import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { AuthLoginActionTypes } from "./types";
import {
  authLoginApiResponseSuccess,
  authLoginApiResponseError,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getFirebaseBackend,
  setLoggeedInUser,
} from "../../../helpers/firebase_helper";
import {
  getCurrentUser,
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../api/index";

const fireBaseBackend = getFirebaseBackend();

function* loadCurrentUser() {
  try {
    const response: Promise<any> = yield call(getCurrentUser);
    yield put(
      authLoginApiResponseSuccess(
        AuthLoginActionTypes.LOAD_CURRENT_USER,
        response
      )
    );
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOAD_CURRENT_USER, error)
    );
  }
}

function* loginUser({ payload: { user } }: any) {
  try {
    const response: Promise<String> = yield call(postFakeLogin, {
      email: user.email,
      password: user.password,
    });

    localStorage.setItem("authUser", JSON.stringify(response) );
    setLoggeedInUser(response);
    yield put(
      authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response)
    );
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, error)
    );
  }
}

function* socialLogin({ payload: { data, type } }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response: Promise<any> = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type
      );
      setLoggeedInUser(response);
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response)
      );
    } else {
      const response: Promise<any> = yield call(postSocialLogin, data);
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response)
      );
    }
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, error)
    );
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response: Promise<any> = yield call(fireBaseBackend.logout);
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, response)
      );
    } else {
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, true)
      );
    }
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGOUT_USER, error)
    );
  }
}

function* loginSaga() {
  yield takeEvery(AuthLoginActionTypes.LOAD_CURRENT_USER, loadCurrentUser);
  yield takeEvery(AuthLoginActionTypes.LOGIN_USER, loginUser);
  yield takeEvery(AuthLoginActionTypes.LOGOUT_USER, logoutUser);
  yield takeLatest(AuthLoginActionTypes.SOCIAL_LOGIN, socialLogin);
}

export default loginSaga;
