import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { selectAuth } from 'store/selectors';
// import { setErrors } from 'store/slicers/errors';
import { MethodTypes } from "types";
import { Endpoints } from 'constants/endpoints';
// import { CustomError } from 'utils/handlers';

interface InitialRequest {
    method: MethodTypes;
    headers: {
        [key: string]: string
    },
    body?: any
}

type Props = {
    callback?: ({ data }: any) => void;
    url?: string | null;
    showMessage?: boolean;
    condition?: ((res: any) => boolean) | boolean;
    headers?: any;
    loading?: boolean;
    method?: MethodTypes;
    data?:any;
};

function useFetch(props: Props) {
    const [loading, setLoading] = useState<boolean>(props.loading !== undefined ? props.loading : false);
    const [callback, setCallback] = useState<((value: any) => void) | null>(() => props.callback || null);
    const [message, setMessage] = useState<null | { status: number, message: any }>(null);
    const [errors, setErrors] = useState<null | { status: number, erors: string }>(null);
    const [method, setMethod] = useState<MethodTypes>(props.method || "GET");
    const [data, setData] = useState<any>(props.data || null);
    const [url, setUrl] = useState<string | null | undefined>(props.url);
    const [showMessage, setShowMessage] = useState<boolean>(props.showMessage !== undefined ? props.showMessage : true);
    const { token } = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const condition = (res: any): boolean => {
        if (props.condition && typeof props.condition !== 'boolean') return props.condition(res);
        else if (props.condition && typeof props.condition === 'boolean') return props.condition;
        return false;
    }
    useEffect(() => {
        const headers = props.headers || { 'Content-Type': 'application/json', };
        const options: InitialRequest = {
            headers: headers,
            method: method
        }
        if (token && url && url.includes(Endpoints.baseURL)) options.headers['Authorization'] = `Token ${token}`;
        if (data && ['POST', 'PUT', 'DELETE'].includes(method)) options.body = JSON.stringify(data);

        const sendRequest = async (url: string): Promise<void> => {
            try {
                const req = await fetch(url, options);
                
                const res = await req.json();
                if (res) {
                    if (callback) callback(res);
                }
                
                if(res && res.error)setMessage({ status: 500, message: res.error });
                
            } catch (err: any) {
                setErrors({ status: err.status, erors: err.message });
            } finally {
                setLoading(false);
                setUrl(null);
            }
        }
        if (url && !loading) {
            setLoading(true);
            setMessage(null);
            setErrors(null);
            sendRequest(url);
        }
        // eslint-disable-next-line 
    }, [dispatch, token, url, loading, data, message, showMessage, method, condition, props.headers, setUrl, setMethod, setLoading, props, setErrors])
    return {
        loading,
        setErrors,
        errors,
        message,
        method,
        url,
        setUrl,
        setMessage,
        setData,
        setMethod,
        setLoading,
        setShowMessage,
        setCallback,
    }
}
export default useFetch;