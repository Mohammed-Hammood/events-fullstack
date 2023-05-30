
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { Endpoints } from "constants/endpoints";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useFetch, Loader } from "components";
import { RegisterFormTypes, UserTypes } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import styled from "styled-components";
import { login } from "store/slicers/auth";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "constants/index";
import { selectAuth } from "store/selectors";


const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required")
        .max(50, "Username must not exceed 50 characters")
        .min(6, "Username must be at least 6 characters"),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    first_name: Yup.string().required('First name is required')
        .max(50, "First name must not exceed 50 characters")
        .min(1, "First name must be at least 1 character"),
    last_name: Yup.string().required('Last name is required')
        .max(50, "Last name must not exceed 50 characters")
        .min(1, "Last name must be at least 1 character"),
    password: Yup.string().required('Password is required')
        .max(30, "Password must not exceed 30 characters")
        .min(8, "Password must be at least 8 characters")
});


interface CallbackProps {
    token?: string;
    user?: UserTypes;
    errors?: {
        password?:string[];
        username?:string[];
        email?:string[];
        last_name?:string[];
        first_name?:string[];
    }
}
const Main = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    padding:10px;
    form {
        width:100%;
        max-width: 500px;
        border:1px solid silver;
        border-radius:5px;
        padding:5px;
        display:flex;
        flex-direction: column;
    }

`

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector(selectAuth);
    const callback = ({ user, token }: CallbackProps) => {
        if (user && token) {
            dispatch(login({ user, token }));
        }
    }
    const { message, loading, setMethod, setMessage, setData, setUrl } = useFetch({ callback });
    const [passwordInputType, setPasswordInputType] = useState<"password" | 'text'>('password');
    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormTypes>({ resolver: yupResolver(validationSchema) })
    const onSubmit = (fields: RegisterFormTypes) => {
        const data = {
            password: fields.password,
            email: fields.email.trim(),
            username: fields.username.trim(),
            first_name: fields.first_name.trim(),
            last_name: fields.last_name.trim()
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
    if (loading) return (<Loader size={100} minHeight={424} borderWidth={5} />);
    return (<>
        <Main>

            {message ?
                <div className="messages warning" onClick={() => setMessage(null)}>
                    {(message.message)}
                </div>
                : null}
            <form onSubmit={handleSubmit(onSubmit)} className='container'>
                <div className='section'>
                    <label htmlFor='firstname'>{("First name")} <span className="red">*</span></label>
                    <input type='text' placeholder={('First name')} {...register('first_name')} />
                    <span className="message-error">
                        {errors.first_name && errors.first_name.message && (errors.first_name.message)}
                    </span>
                </div>
                <div className='section'>
                    <label htmlFor='lastname'>{("Last name")} <span className="red">*</span></label>
                    <input type='text' placeholder={('Last name')} {...register('last_name')} />
                    <span className="message-error">{errors.last_name && errors.last_name.message && (errors.last_name.message)}</span>
                </div>
                <div className='section'>
                    <label htmlFor='lastname'>{("Username")} <span className="red">*</span></label>
                    <input type='text' placeholder={('Username')} {...register('username')} />
                    <span className="message-error">{errors.username && errors.username.message && (errors.username.message)}</span>
                </div>
                <div className='section'>
                    <label htmlFor='email'>{("Email")} <span className="red">*</span></label>
                    <input type='email' placeholder={('Email')} {...register('email')} />
                    <span className="message-error">{errors.email && errors.email.message && (errors.email.message)}</span>
                </div>
                <div>
                    <label htmlFor='password'>{("Password")} <span className="red">*</span></label>
                    <button type="button" onClick={() => setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password')} >
                        {/* <SVG name={passwordInputType === 'password' ? "eye" : "eye-slash"} color="black" /> */}
                    </button>
                </div>
                <input type={passwordInputType} placeholder={('Password')} {...register('password')} />
                <span className="message-error">{errors.password && errors.password.message && (errors.password.message)}</span>
                <div className="register">
                    <span>{("If you already have an account, then")} </span>
                    <Link to={AppRoutes.loginPage} className="link underline" >{("login")}</Link>
                </div>
                <div className="buttons">
                    <button className="primary" type="submit">{("Register")}</button>
                    <button type="button" onClick={() => reset()}>{("Reset")}</button>
                </div>
            </form>


        </Main>
    </>)
}