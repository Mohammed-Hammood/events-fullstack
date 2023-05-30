import React from "react";
import { useAppDispatch } from "store/hooks";
import { logout } from "store/slicers/auth";
import { Endpoints } from "constants/endpoints";
import { useFetch, Loader } from "components";

interface Props {
    setIsVisible: (value: boolean) => void;
}
export default function LogoutForm(props: Props) {
    const { setIsVisible } = props;
    const dispatch = useAppDispatch();
    const callback = (): void => {

        dispatch(logout());
        setIsVisible(false);
    }
    const { setUrl, setMethod, loading, message } = useFetch({ callback });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMethod('POST');
        setUrl(Endpoints.logout);
    }
    if (message && message.status === 401) callback();
    if (loading) return (<Loader size={50} minHeight={100} />)
    return (
        <form onSubmit={(e) => handleSubmit(e)} className='container'>
            <div className='text-container'>{("Do you want to logout?")}</div>
            <div className='buttons'>
                <button className="warning" type='submit' ><span>{("Logout")}</span></button>
                <button type='button' onClick={() => setIsVisible(false)}><span>{("Close")}</span></button>
            </div>
        </form>
    )
}