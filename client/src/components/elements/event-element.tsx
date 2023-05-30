import React, { useState } from "react";
import { useFetch } from "components/hook";
import ICONS from "components/shared/icons";
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { selectEvents } from "store/selectors";
import { setAllEvents, setLikedEvents, setMyEvents } from "store/slicers/events";
import styled from "styled-components";
import { EventTypes, UserTypes } from "types";
import Moment from "react-moment";
import Modal from "components/modal";

const Wrapper = styled.div`
    & .event, & {

        padding:10px;
        display:flex;
        &:hover {
            box-shadow:0 4px 15px 0 rgba(40,44,53,.06),0 2px 2px 0 rgba(40,44,53,.08);
            .event__image__buttons  {
                button[id=edit-event-button] {
                    display: flex;
                }
            }
        }
        &__content {
            width: 100%;
            flex:1 1 70%;
            gap:5px;
            display: flex;
            flex-direction:column;
            &__title {
                font-size: 1.125rem;
                line-height: 1.5rem;
                font-weight: 600px;
                color:rgb(57, 54, 79);
            }
            &__date {
                color: #d1410c;
            }
            &__location {
                color:#6f7287;
            }
            &__description {
                color:#6f7287;
            }
        }
        &__image {
            --height:110px;
            --width:220px;
            width:100%;
            width: var(--width);
            display: flex;
            gap:5px;
            flex-direction: column;
            &__image {
                height: var(--height);
                width: var(--width);
                overflow: hidden;
                img {
                    height: var(--height);
                    width: var(--width);
                    object-fit: cover;
                }
            }
            &__buttons {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap:10px;
                button {
                    background-color: transparent;
                    padding:9px;
                    border-radius: 50%;
                    width: 40px;
                    height:40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    border:none;
                    svg {
                        width:14px;
                        height:14px;
                    }
                    &:last-child {
                        border:1px solid #dbdae3;
                    }
                    &[id=edit-event-button]{
                        display: none;
                    }
                }
                
            }
        }
    }

`;

type Props = {
    event: EventTypes;
    user: UserTypes;

}

export default function EventElement(props: Props): JSX.Element {
    const { event, user } = props;
    const [editEventModal, setEditEventModal] = useState<boolean>(false);
    const { all_events, liked_events, all_events_count, liked_events_count, myEvents } = useAppSelector(selectEvents);
    const { setMethod, setUrl } = useFetch({});

    const dispatch = useAppDispatch();

    const updateLikesArray = (array: number[], user_id: number, method: "DELETE" | "POST"): number[] => {
        if (method === 'DELETE') return array.filter(item => item !== user_id);

        if (array.includes(user_id)) return array;

        return [...array, user_id];
    }

    const likeToggle = (event: EventTypes): void => {
        const url = Endpoints.likesToggle(event.id);
        const method = event.likes.includes(user.id) ? 'DELETE' : 'POST';
        setUrl(url);
        setMethod(method);
        const updatedEvent = {
            ...event,
            likes: updateLikesArray(event.likes, user.id, method),
        }
        if (all_events.find(item => item.id === event.id)) {
            const updatedAllEvents = all_events.map(item => item.id === event.id ? updatedEvent : item);
            dispatch(setAllEvents({ events: updatedAllEvents, events_count: all_events_count }));
        }
        if (liked_events.find(item => item.id === event.id) && method === 'DELETE') {
            const updatedLikedEvents = liked_events.filter(item => item.id !== event.id);
            dispatch(setLikedEvents({ events: updatedLikedEvents, events_count: liked_events_count }));
        }
        if (myEvents.find(item => item.id === event.id) ) {
            const updatedMyEvents = myEvents.map(item => item.id === event.id? updatedEvent : item);
            dispatch(setMyEvents({ events: updatedMyEvents }));
        }
    }

    return (<>
        <Wrapper className="event" >
            <div className="event__content">
                <div className="event__content__title">{event.title}</div>
                <div className="event__content__date">
                    <Moment
                        local
                        format={"ddd, MMM d, hh:mm A"}
                    >{event.time}</Moment>
                </div>
                <div className="event__content__description">{event.description}</div>
                <div className="event__content__location">{event.location}</div>
            </div>
            <div className="event__image">
                <div className="event__image__image">
                    <img src={Endpoints.baseURL + event.image} alt="" />
                </div>
                <div className="event__image__buttons">
                    {event.user === user.id ?
                        <button className="event__image__buttons__editButton" type="button" id="edit-event-button" onClick={()=> setEditEventModal(true)}>
                            <ICONS name={"pen-to-square-solid"} />
                        </button>
                        : null}
                    <button className="event__image__buttons__uploadButton" type="button" id="share-event-button">
                        <ICONS name={"arrow-up-from-solid"} />
                    </button>
                    <button className="event__image__buttons__heartButton" type="button" onClick={() => likeToggle(event)}>
                        <ICONS
                            name={event.likes.includes(user.id) ? "heart-solid" : "heart-regular"}
                            color={event.likes.includes(user.id) ? "red" : "#4b4d63"}
                        />
                    </button>
                </div>
            </div>
        </Wrapper>
        <Modal
            setIsVisible={setEditEventModal}
            isVisible={editEventModal}
            form={"add-edit-event"}
            title="Edit event"
            {...{event}}
        />
    </>
    )
}