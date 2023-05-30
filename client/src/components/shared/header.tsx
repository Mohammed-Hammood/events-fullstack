import React, { useState } from "react"
import { AppRoutes } from "constants/index"
import { Link } from "react-router-dom"
import { useAppSelector } from "store/hooks"
import { selectAuth } from "store/selectors"
import styled from "styled-components"
import Loader from "./loader"
import Modal from "components/modal"
import ICONS from "./icons"

const HeaderWrapper = styled.header`
    width:100%;
    padding:0;
    .nav {
        width:100%;
        height:59px;
        color:white;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eeedf2;
        justify-content: space-between;
        position: relative;
        letter-spacing: normal;
        font-size: var(--fontSize14);
        background-color: #fff;
        &__main, &__items {
            margin: 0 10px;
            display: flex;
            height: 100%;
            width:50%;
            align-items:center;
            justify-content: flex-end;
            a, button, div[id=profileLink]  {
                justify-content: center;
                align-items: center;
                display: flex;
                padding:0 10px;
                color:white;
                height: 100%;
                text-decoration: none;
                cursor: pointer;
                background-color: transparent;
                border:none;
                color:#6f7287;
                flex-direction: column;
                svg {
                    height:15px;
                    width: 15px;
                }
            }
            a:hover, button:hover {
                background-color: white;
                color:black;
            }
            a[id=ticket-button]{
                svg {
                    transform: rotate(90deg);
                }
            }
            div[id=profileLink] {
                flex-direction: row;
                gap:0;
                cursor: pointer;
                color:#6f7287;
                display: flex;
                span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                }
                a:first-child  {
                    span {
                        background-color: #f8f7fa;
                        height: 40px;
                        width: 40px;
                        border-radius: 50%;
                    }
                }
                &:hover, &:focus-within, a:hover {
                    background-color: #f8f7fa;
                    color:#6f7287;
                    .dropdown {
                        display: flex;
                    }
                }
                .dropdown {
                    position: absolute;
                    background-color: white;
                    display: none;
                    justify-content: center;
                    flex-direction: column;
                    margin-top: 190px;
                    min-width: 180px;
                    margin-left: -10px;
                    box-shadow: 0 0 2px #c6c6c6;
                    button, a {
                        padding: 10px;
                        display: flex;
                        justify-content: flex-start;
                        text-align: left;
                        flex-direction: row;
                        &:hover {
                            background-color: #f8f7fa;
                        }
                    }
                }
            }
           
        }
        &__main {
            &__search {
                width:100%;
                button, button:hover {
                    align-items: center;
                    display:flex;
                    padding:15px;
                    height: 48px;
                    background-color: #f8f7fa;
                    cursor: pointer;
                    width: inherit;
                    max-width: 472px;
                    justify-content: flex-start;
                    border:none;
                    margin:5px 10px;
                    outline:none;
                    color:#a9a8b3;
                    gap:10px;
                    flex-direction: row;
                }
            }
        }
        &__logo {
            a, a:hover {
                color:#f05537;
                font-weight: bold;
                font-size: var(--fontSize22);
            }
        }
    }

`
export default function Header() {
    const [logoutModal, setLogoutModal] = useState<boolean>(false);
    const [addEventModal, setAddEventModal] = useState<boolean>(false);
    const [searchModal, setSearchModal] = useState<boolean>(false);
    const { isAuthenticated, loading, user } = useAppSelector(selectAuth);

    return (
        <>
            <HeaderWrapper>
                <nav className="nav">
                    <div className="nav__main">
                        <div className="nav__logo">
                            <Link to={AppRoutes.homePage}>eventbrite</Link>
                        </div>
                        <div className="nav__main__search">
                            <button type="button" onClick={() => setSearchModal(true)}>
                                <ICONS name="search" color="#a9a8b3" />
                                <span>Search events</span>
                            </button>
                        </div>
                    </div>
                    <div className="nav__items">
                        {loading ? <Loader size={20} borderColor="red" /> : null}
                        {isAuthenticated && user ? <>
                            <button onClick={() => setAddEventModal(true)} type="button">
                                <ICONS name={'plus-solid'} />
                                <span>Create an event</span>
                            </button>
                            <Link to={AppRoutes.likesPage}>
                                <ICONS name={'heart-regular'} />
                                <span>Likes</span>
                            </Link>
                            <Link to={""} id='ticket-button' type="button">
                                <ICONS name={'ticket-solid'} />
                                <span>Tickets</span>
                            </Link>

                            <div id="profileLink" >
                                <Link to={AppRoutes.profilePage}>
                                    <span>
                                        <ICONS name="user-regular" color="#6f7287" />
                                    </span>
                                </Link>
                                <Link to={AppRoutes.profilePage}>{user.username}</Link>
                                <Link to={AppRoutes.profilePage}>
                                    <ICONS name="angle-down" color="#c2c2cc" />
                                </Link>
                                <div className="dropdown">
                                    <Link to={"#"}>Tickets</Link>
                                    <Link to={"#"}>Account settings</Link>
                                    <Link to={"#"}>Settings</Link>
                                    <button onClick={() => setLogoutModal(true)} >
                                        Log out
                                    </button>
                                </div>
                            </div>

                        </> : null}
                        {!isAuthenticated && !loading ?
                            <Link to={AppRoutes.loginPage}>
                                Sign in
                            </Link>
                            : null}

                    </div>
                </nav>
            </HeaderWrapper>
            <Modal
                isVisible={logoutModal}
                setIsVisible={setLogoutModal}
                form={"logout"}
                title="Log out"
            />

            <Modal
                isVisible={searchModal}
                setIsVisible={setSearchModal}
                form={"search"}
                title="Search"
            />
            <Modal
                isVisible={addEventModal}
                setIsVisible={setAddEventModal}
                form={"add-edit-event"}
                title="Add new event"
            />
        </>
    )
}