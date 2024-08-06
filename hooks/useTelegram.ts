'use client'

import { findUserForLogin } from '@/lib/actions/user.actions';
import { IUser } from '@/lib/database/models/user.model';
import { useState, useEffect } from 'react';

const useTelegram = () => {
    const [state, setState] = useState({
        isLoggedIn: false,
        loading: true,
        telegramId: null,
        chatId: null,
        currentUser: null,
    });

    useEffect(() => {
        const initTelegram = async () => {
            try {
                let user = null;
                let chat = null;

                if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
                    const tg = (window as any).Telegram.WebApp;
                    tg.ready();

                    user = tg.initDataUnsafe?.user;
                    chat = tg.initDataUnsafe?.chat;

                    console.log('User:', user);
                    console.log('Chat:', chat);

                }

                if (window.location.hostname === 'localhost') {
                    // Fallback for local development
                    user = { id: '707937422' };
                    chat = { id: '707937422' };
                }

                if (user) {
                    let userFound;

                    if (window.location.hostname === 'localhost') {
                        userFound = await findUserForLogin('707937422');
                    } else {
                        userFound = await findUserForLogin(user.id);
                    }

                    if (userFound) {
                        setState({
                            isLoggedIn: true,
                            loading: false,
                            telegramId: user.id,
                            chatId: user?.id,
                            currentUser: userFound,
                        });
                        console.log('User found and set:', userFound);
                        return;
                    } else {
                        setState({
                            isLoggedIn: false,
                            loading: false,
                            telegramId: user.id,
                            chatId: user?.id,
                            currentUser: null,
                        });
                    }
                }
            } catch (error) {
                console.error('Error initializing Telegram:', error);
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        initTelegram();
    }, []);

    return { state };
};

export default useTelegram;
