import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    // Состояние пользователя с ролью
    const [user, setUser] = useState(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        return storedUser || null;
    });

    // Сохраняем пользователя в localStorage при изменении
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Функция для выхода
    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для использования контекста
export const useUser = () => {
    const { user, setUser, logout } = useContext(UserContext);
    return { user, setUser, logout };
};