import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EventTypes } from 'types';


type EventsInitial = {
    all_events: EventTypes[];
    myEvents: EventTypes[];
    liked_events: EventTypes[];
    all_events_count: number;
    liked_events_count: number;
    query: string;
}

const initialState: EventsInitial = {
    all_events: [],
    myEvents: [],
    liked_events: [],
    all_events_count: 0,
    liked_events_count: 0,
    query: "",

}

const eventsSlicer = createSlice({
    initialState,
    name: "events",
    reducers: {
        setAllEvents(state, actions: PayloadAction<{ events: EventTypes[], events_count?: number }>) {
            const { events, events_count } = actions.payload;
            state.all_events = events;
            // state.all_events_count = events_count;
        },
        setMyEvents(state, actions: PayloadAction<{ events: EventTypes[] }>) {
            const { events } = actions.payload;
            state.myEvents = events;
        },
        setLikedEvents(state, actions: PayloadAction<{ events: EventTypes[], events_count?:number }>) {
            const { events } = actions.payload;
            state.liked_events = events;
            // state.liked_events_count = events_count;
        },
        clearEvents(state) {
            state.all_events = [];
            state.myEvents = [];
            state.liked_events = [];
            state.all_events_count = 0;
        },
    }
})

export default eventsSlicer.reducer;
export const { clearEvents, setAllEvents, setLikedEvents, setMyEvents } = eventsSlicer.actions