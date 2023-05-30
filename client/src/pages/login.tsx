
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useFetch, Loader,   ICONS } from "components";
import { LoginFormTypes, RegisterFormTypes, UserTypes } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "styles/auth-page.scss";
import { login } from "store/slicers/auth";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "constants/index";
import { selectAuth } from "store/selectors";


const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required")
        .max(50, "Username must not exceed 50 characters")
        .min(6, "Username must be at least 6 characters"),
    password: Yup.string().required('Password is required')
        .max(30, "Password must not exceed 30 characters")
        .min(8, "Password must be at least 8 characters")
});


interface CallbackProps {
    token?: string;
    user?: UserTypes;
    error?: string;
}


export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector(selectAuth)
    const callback = ({ user, token }: CallbackProps) => {
        if (user && token) {
            dispatch(login({ user, token }));
        }
    }
    const { message, loading, setMethod, setMessage, setData, setUrl } = useFetch({ callback });
    const [passwordInputType, setPasswordInputType] = useState<"password" | 'text'>('password');
    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormTypes>({ resolver: yupResolver(validationSchema) })
    const onSubmit = (fields: LoginFormTypes) => {
        const data = {
            password: fields.password,
            username: fields.username.trim(),
        };
        if (!loading) {
            setData(data);
            setUrl(Endpoints.login);
            setMethod('POST');
        }
    }
    useEffect(() => {
        if (isAuthenticated) return navigate(AppRoutes.homePage)
    }, [isAuthenticated, navigate])
    if (loading) return (<Loader size={70} minHeight={424} />);
    return (<>
        <main className="login-page">
            <form onSubmit={handleSubmit(onSubmit)} className='form-container'>
                <div className="header">
                    <span>Log in</span>
                </div>
                <div className="body">
                    {message ?
                        <div className="messages warning" onClick={() => setMessage(null)}>
                            {(message.message)}
                        </div>
                        : null}

                    <div className='body__section'>
                        <label htmlFor='lastname'>{("Username")} <span className="red">*</span></label>
                        <input type='text' placeholder={('Username')} {...register('username')} />
                        <span className="message-error">{errors && errors.username && (errors.username.message)}</span>
                    </div>
                    <div className="body__section">
                        <div className="body__section__label">
                            <label htmlFor='password'>{("Password")} <span className="red">*</span></label>
                            <button type="button" onClick={() => setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password')} >
                                <ICONS name={passwordInputType === 'password' ? "eye" : "eye-slash"} color="black" />
                            </button>
                        </div>
                        <input type={passwordInputType} placeholder={('Password')} {...register('password')} />
                        <span className="message-error">{errors && errors.password && (errors.password.message)}</span>
                    </div>
                    <div className="body__section">
                        <span>{("If you don't have an account, then you can")} </span>
                        <Link to={AppRoutes.registerPage} className="link underline" >{("register")}</Link>
                    </div>
                    <div className="body__buttons">
                        <button className="primary" type="submit">{("Log in")}</button>
                        <button type="button" onClick={() => reset()}>{("Reset")}</button>
                    </div>
                </div>
            </form>


        </main >
    </>)
}