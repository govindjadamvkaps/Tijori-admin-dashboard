"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
// import subjectReducer from './features/subject/subjectSlice'
// import curriculumReducer from './features/curriculum/curriculumSlice'
// import lessonPlanReduce from './features/lessonPlan/lessonPlanSlice'
import storage from "./storage";
// import UpdatePropertSlice from "./features/property/UpdatePropertSlice";
const persistConfig = {
  key: "tijori-admin-dashboard",
  storage,
  whitelist: ["auth", "user"], // only auth and user will be persisted
};

const rootReducer = combineReducers({
   auth: authReducer,
   user: userReducer,
});
    
const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store: any = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
          // serializableCheck: {
          //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          // },
        }),
    });

    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];