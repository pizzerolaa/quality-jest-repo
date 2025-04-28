import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await api.getCurrentUser();
                setCurrentUser(user);
            } catch (err) {
                setError('Failed to fetch current user');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{currentUser, loading, error}}>
            {children}
        </AuthContext.Provider>
    );

    // const value = useMemo(() => ({
    //     currentUser,
    //     loading,
    //     error
    // }), [currentUser, loading, error]);

    // return (
    //     <AuthContext.Provider value={value}>
    //         {children}
    //     </AuthContext.Provider>
    // );
    
};