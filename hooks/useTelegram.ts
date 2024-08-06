'use client'

import { findUserForLogin } from '@/lib/actions/user.actions';
import { IUser } from '@/lib/database/models/user.model';
import { useState, useEffect } from 'react';

const useTelegram = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [telegramId, setTelegramId] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null)

    useEffect(() => {
        const initTelegram = async () => {
            if ((window as any).Telegram?.WebApp) {
                const tg = (window as any).Telegram.WebApp;
                tg.ready();

                const user = tg.initDataUnsafe?.user;
                const chat = tg.initDataUnsafe?.chat;

                if (user) {
                    setTelegramId(user.id);

                    const userFound = await findUserForLogin(user.id)

                    if (userFound) {
                        setIsLoggedIn(true);
                        setChatId(chat.id);
                        setCurrentUser(userFound)
                    }
                }
            }

            setLoading(false);
        };

        initTelegram();
    }, []);

    return { isLoggedIn, loading, telegramId, chatId, currentUser };
};

export default useTelegram;
