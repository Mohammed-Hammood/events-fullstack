import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slicers/auth';
import eventsReducer from './slicers/events';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
  devTools: window.location.origin.includes('localhost') //in development mode only.
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch