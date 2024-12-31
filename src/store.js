import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import spaceReducer from "./features/space/spaceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    space: spaceReducer,
  },
});
