import React from "react"
import { useFetch, Loader, EventElement } from "components";
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks"
import { selectAuth, selectEvents } from "store/selectors";
import { EventTypes } from 'types';
import { setAllEvents,  } from "store/slicers/events";
import 'styles/home-page.scss';


type CallbackProps = {
    events: EventTypes[];
    events_count: number;
}

export default function HomePage(): JSX.Element {
    const { user } = useAppSelector(selectAuth);
    const { all_events: queryset  } = useAppSelector(selectEvents);
    const url = Endpoints.allEvents({min:queryset.length, query:""});
    const dispatch = useAppDispatch();
    const callback = ({ events, events_count }: CallbackProps): void => {
        if (events) {
            dispatch(setAllEvents({ events: [...queryset, ...events,], events_count }));
        }
    }
    const { loading, setMethod, setUrl, setCallback } = useFetch({ callback, url: queryset.length === 0 ? url : null })
    const loadMoreEvents = (): void => {
        setMethod('GET');
        setUrl(Endpoints.allEvents({query:"", min: queryset.length }));
        setCallback(() => callback);
    }
    console.log('loaded')
    return (
        <>
            <main className="home-page">
                <div className="center-content">
                    {user ? <>
                        <div className="events">
                            {loading && queryset.length === 0 ? <Loader size={70} minHeight={300} /> : queryset.map(item => {
                                return <EventElement user={user} key={item.id} event={item} />
                            })}
                        </div>
                        <div className="loader">
                            {loading && queryset.length !== 0 ? <Loader size={20} /> :

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