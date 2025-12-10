import {createContext, useContext, useState} from "react";

export interface User {
    id: string;
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    role: string;
    dateOfBirth: string | null;
    customerStatus: string;
}

interface AuthContextType{
    isAuthenticated: boolean
    login: (userData: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = (user: User) =>{
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));
    }

    const logout = () => {
        //TODO
    }

    return (
        <AuthContext value={
            {
                isAuthenticated: isAuthenticated,
                login,
                logout
            }
        }>
            {children}
        </AuthContext>
    )
}
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}