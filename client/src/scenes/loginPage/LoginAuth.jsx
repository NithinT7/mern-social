import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import { setLogin } from 'state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const LoginAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loginWithRedirect,
        isAuthenticated,
        user,
        getIdTokenClaims,
        isLoading
    } = useAuth0();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogin = async () => {
        try{
            await loginWithRedirect();
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchTokenAndUser = async () => {
            if (isAuthenticated && isLoading === false && user) {
                const isGoogleUser = user.sub && user.sub.includes("google");
                console.log(user);
                
                if (isGoogleUser) {
                    try {
                        const response = await axios.post(`${API_URL}/auth/register`, {
                            firstName: user.given_name,
                            lastName: user.family_name,
                            email: user.email,
                            password: "12345",
                            picturePath: user.picture,
                            location: "",
                            occupation: "",
                        });

                        const responseLogin = await axios.post(`${API_URL}/auth/login`, {
                            email: user.email,
                            password: "12345",
                        });
                        const token = responseLogin.data.token;
                        const person = responseLogin.data.user;
                        dispatch(setLogin({ token, user:person }));
                        
                    } catch (error) {
                        if (error.response && error.response.data.error === "User already exists") {
                            const responseLogin = await axios.post(`${API_URL}/auth/login`, {
                                email: user.email,
                                password: "12345",
                            });
                            const token = responseLogin.data.token;
                            const person = responseLogin.data.user;
                            dispatch(setLogin({ token, user:person }));
                        } else {
                            console.error("Error registering or logging in:", error);
                        }
                    }
                }
                navigate("/home");
            }
        }
    
        fetchTokenAndUser();
    }, [isAuthenticated, user, getIdTokenClaims, dispatch, navigate]);

    return (
        <Button onClick={handleLogin}>
            Login
        </Button>
    );
}

export default LoginAuth;
