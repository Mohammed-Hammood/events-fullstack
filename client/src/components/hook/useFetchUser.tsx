
import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { setLoading as setAuthenticating, setUser } from 'store/slicers/auth';
import { selectAuth, } from 'store/selectors';
import { Endpoints } from 'constants/endpoints';

interface InitialRequest {
    method: string;
    headers: {
        [key: string]: string
    }
}

function useFetchUser() {
    const { token,  loading: authenticating, user } = useAppSelector(selectAuth);
    const [loading, setLoading] = useState<boolean>(false);
    const url = Endpoints.getUser;
    const dispatch = useAppDispatch();
    useEffect(() => {
        const options: InitialRequest = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            method: 'GET'
        }
        const fetchUser = async (): Promise<void> => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                dispatch(setAuthenticating(false));
            }, 8000);
            try {
                const req = await fetch(url, options);
                if (req.status !== 200) {
                  //  throw new CustomError(req)
                }
                const res = await req.json();
                if (res && res.user) {
                    dispatch(setUser({ user: res.user }));
                }
            } catch (err: any) {
              //  dispatch(setErrors({ errors: err, showMessage: true }))
            } finally {
                setLoading(false);
                dispatch(setAuthenticating(false));
            }
        }
        if (token && !loading && !user) {
            fetchUser();
        } else if (!token && (loading || authenticating)) {
            setLoading(false);
            dispatch(setAuthenticating(false));
        }

    }, [dispatch, token, url, loading, user, authenticating]);
    return {
        loading
    }
}
export default useFetchUser;