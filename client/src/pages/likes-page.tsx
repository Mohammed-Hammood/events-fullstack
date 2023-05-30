import React from "react"
import { useFetch, Loader, EventElement } from "components";
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks"
import { selectAuth, selectEvents } from "store/selectors";
import { setLikedEvents } from "store/slicers/events";
import { EventTypes } from 'types';
import 'styles/home-page.scss';


type CallbackProps = {
    events: EventTypes[];
    events_count: number;
}

export default function LikedEventPage(): JSX.Element {
    const { user } = useAppSelector(selectAuth);
    const { liked_events: queryset} = useAppSelector(selectEvents);

    const url = Endpoints.likedEvents({ min: 0, query: "" });
    const dispatch = useAppDispatch();
    const callback = ({ events, events_count }: CallbackProps): void => {
        if (events) {
            dispatch(setLikedEvents({ events: [...queryset, ...events,], events_count }));
        }
    }
    const { loading, setMethod, setUrl, setCallback } = useFetch({ callback, url: queryset.length  === 0 ? url : null })
    const loadMoreEvents = (): void => {
        setMethod('GET')
        setUrl(Endpoints.likedEvents({query: "", min: queryset.length }));
        setCallback(() => callback);
    }
   
    return (
        <>
            <main className="home-page">
                <div className="center-content">
                    <header className="title">
                        <h1>Likes</h1>
                    </header>
                    {user ? <>
                        <div className="events">
                            {loading && queryset.length === 0 ? <Loader size={70} minHeight={300} /> :
                                queryset.map(item => {
                                    return <EventElement user={user} key={item.id} event={item} />
                                })}
                        </div>
                        <div className="loader">
                            {loading && queryset.length !== 0? <Loader size={20} /> :

                                <button type="button"
                                    onClick={loadMoreEvents}>
                                    Loader More
                                </button>
                            }
                        </div>
                    </> : null}
                </div>
            </main>
        </>
    )
}