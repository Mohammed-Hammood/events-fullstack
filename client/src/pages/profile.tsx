import React from "react"
import { useFetch, Loader, EventElement } from "components";
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks"
import { selectAuth, selectEvents } from "store/selectors";
import { EventTypes } from 'types';
import { setMyEvents, } from "store/slicers/events";
import 'styles/home-page.scss';
import { AppRoutes } from "constants/index";
import { useNavigate } from "react-router-dom";


type CallbackProps = {
    events: EventTypes[];
    events_count: number;
}

export default function ProfilePage(): JSX.Element {
    const { user, loading: loadingAuth } = useAppSelector(selectAuth);
    const { myEvents: queryset, } = useAppSelector(selectEvents);
    const navigate = useNavigate();
    const url = Endpoints.myEvents({ min: queryset.length, query: "" });
    const dispatch = useAppDispatch();
    const callback = ({ events }: CallbackProps): void => {
        if (events) {
            dispatch(setMyEvents({ events: [...queryset, ...events,] }));
        }
    }
    const { loading, setMethod, setUrl, setCallback } = useFetch({ callback, url: queryset.length === 0 ? url : null })
    const loadMoreEvents = (): void => {
        setMethod('GET');
        setUrl(Endpoints.myEvents({ query: "", min: queryset.length }));
        setCallback(() => callback);
    }
    React.useEffect(() => {
        if (!loadingAuth && !user) navigate(AppRoutes.loginPage)
    }, [user, loadingAuth, navigate])
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