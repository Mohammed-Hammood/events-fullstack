import React, { useState } from "react";
import { ImageInputElement, InputElement, Loader, TextareaElement } from "components";
import { EventTypes, ModalTypes } from "types";
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setAllEvents, setLikedEvents, setMyEvents } from "store/slicers/events";
import { selectAuth, selectEvents } from "store/selectors";
import axios from 'axios'

interface Props {
    setIsVisible: (value: boolean) => void;
    event?: EventTypes | null;
    modal: ModalTypes;
}


interface CallbackProps {
    event?: EventTypes;
    errors?: {
        user?: string[];
        title?: string[];
        time?: string[];
        description?: string[];
        location?: string[];
        image?: string[];
    }
}

type ErrorsTypes = null | CallbackProps['errors'];

type SendDataProps = {
    image: File,
    title: string,
    location: string,
    description: string,
    dateTime: string,
    token: string,
    event?: EventTypes;
    callback: (data: any) => void,
    setLoading: (value: boolean) => void
    setErrors: (value: null | ErrorsTypes) => void
}

const sendData = async (data: SendDataProps) => {
    const { image, title, location, description, callback, token, setLoading, setErrors, dateTime, event } = data;
    setLoading(true);
    setErrors(null);
    let formData = new FormData();
    formData.append("image", image, image.name);
    formData.append("title", title);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("time", dateTime);
    const url = Endpoints.myEvents({ min: 0, query: "" });
    await axios({
        method: event ? "put" : "post",
        url: url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `token ${token}`
        }
    })
        .then(data => {
            callback(data.data);
        }).catch(() => { })
        .finally(() => {
            setLoading(false);
        })

}

export default function AddEditEvent(props: Props): JSX.Element {
    const { setIsVisible, event } = props;
    const [image, setImage] = useState<null | File>(null);
    const [title, setTitle] = useState<string>(event?.title || '');
    const [description, setDescription] = useState<string>(event?.description || '');
    const [location, setLocation] = useState<string>(event?.location || '');
    const [dateTime, setDateTime] = useState<string>(event?.time || '');
    const [errors, setErrors] = useState<ErrorsTypes>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(selectAuth);
    const { myEvents, all_events, all_events_count, liked_events } = useAppSelector(selectEvents);
    const method = event ? 'PUT' : 'POST';
    const callback = ({ event, errors }: CallbackProps): void => {
        if (event && method === 'POST') {
            dispatch(setMyEvents({ events: [...myEvents, event] }));
            dispatch(setAllEvents({ events: [event, ...all_events], events_count: all_events_count + 1 }));
            setIsVisible(false);
        }
        else if (event && method === 'PUT') {
            const updatedMyEvents = myEvents.map(item => item.id === event.id ? event : item);
            const updatedAllEvents = all_events.map(item => item.id === event.id ? event : item);
            const updatedLikedEvents = liked_events.map(item => item.id === event.id ? event : item);
            dispatch(setMyEvents({ events: updatedMyEvents}));
            dispatch(setAllEvents({ events: updatedAllEvents}));
            dispatch(setLikedEvents({ events: updatedLikedEvents}));
            setIsVisible(false);
        }
        if (errors) setErrors(errors);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (image && token) {
            sendData({
                callback,
                token,
                setErrors,
                title,
                description,
                dateTime,
                setLoading,
                image,
                location,
            })
        }
    }

    if (loading) return (<Loader size={100} minHeight={250} borderWidth={5} />);
    return (
        < >

            <form onSubmit={(e) => handleSubmit(e)} className='container'>
                <div className="section">
                    {errors && errors.title ?
                        <div className="messages warning" onClick={() => setErrors(null)}>{errors.title[0]}</div> : null}
                    <InputElement
                        labelInnerText="Title"
                        value={title}
                        onInput={setTitle}
                        required={true}
                        maxLength={255}
                        placeholder={"Name"}
                        autoFocus={true}
                    />
                </div>
                <div className="section">

                    {errors && errors.description ?
                        <div className="messages warning" onClick={() => setErrors(null)}>{errors.description[0]}</div> : null}
                    <TextareaElement
                        labelInnerText={"Description"}
                        maxLength={1000}
                        placeholder={"Description"}
                        onInput={setDescription}
                        value={description}
                    />
                </div>
                <div className="section">
                    {errors && errors.time ?
                        <div className="messages warning" onClick={() => setErrors(null)}>{errors.time[0]}</div>
                        : null}
                    <label>Time</label>
                    <input
                        type={"datetime-local"}
                        required
                        value={dateTime}
                        onChange={(e) => setDateTime((e.target as HTMLInputElement).value)}
                    />
                </div>
                <div className="section">
                    {errors && errors.location ?
                        <div className="messages warning" onClick={() => setErrors(null)}>{errors.location[0]}</div>
                        : null}
                    <InputElement
                        labelInnerText="Location"
                        value={location}
                        required={true}
                        onInput={setLocation}
                        maxLength={255}
                        placeholder={"Location e.g. London"}
                    />
                </div>
                <div className="section">
                    {errors && errors.image ?
                        <div className="messages warning" onClick={() => setErrors(null)}>{errors.image[0]}</div>
                        : null}
                    <ImageInputElement
                        image={image}
                        imageURL={event?.image}
                        setImage={setImage}
                    />
                </div>
                <div className="buttons">
                    <button type="submit" className='primary'>{("Save")}</button>
                    <button type="button" onClick={() => setIsVisible(false)} >{("Cancel")}</button>
                </div>
            </form>

        </>)
}
