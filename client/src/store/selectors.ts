import { RootState } from "store";


export const selectAuth = (state:RootState) => state.auth;

export const selectEvents = (state:RootState) => state.events;
