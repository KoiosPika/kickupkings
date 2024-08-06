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
                if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
                    const tg = (window as any).Telegram.WebApp;
                    tg.ready();

                    const user = tg.initDataUnsafe?.user;
                    const chat = tg.initDataUnsafe?.chat;

                    if (user) {

                        const userFound = await findUserForLogin(user.id)

                        if (userFound) {
                            setState({
                                isLoggedIn: true,
                                loading: false,
                                telegramId: user.id,
                                chatId: chat?.id ?? null,
                                currentUser: userFound,
                            });
                        }
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
