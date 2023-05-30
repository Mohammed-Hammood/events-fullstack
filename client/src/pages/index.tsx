import React from "react"
import { Routes, Route } from 'react-router-dom';
import { AppRoutes } from 'constants/index';
import HomePage from './home';
import LoginPage from './login';
import RegisterPage from './register';
import ProfilePage from "./profile";
import LikesPage from "./likes-page";

export default function Pages(): JSX.Element {
    return (
        <Routes>
            <Route path={AppRoutes.homePage} element={<HomePage />} />,
            <Route path={AppRoutes.likesPage } element={<LikesPage/>} />,
            <Route path={AppRoutes.loginPage } element={<LoginPage />} />,
            <Route path={AppRoutes.profilePage } element={<ProfilePage />} />,
            <Route path={AppRoutes.registerPage} element={<RegisterPage />} />,
        </Routes>
    )
}