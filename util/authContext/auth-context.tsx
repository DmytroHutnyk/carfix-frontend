import {createContext, useContext, useEffect, useState} from "react";
import {User} from "@/util/types/appTypes";

interface AuthContextType{
    isLoading: boolean;
    isAuthenticated: boolean
    login: (userData: User) => void
    logout: () => void
}

function hasSessionCookie():boolean {
    if (typeof document === 'undefined') return false;
    return document.cookie.split(';').some(cookie =>
        cookie.trim().startsWith('JSESSIONID=')
    );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const login = (user: User) =>{
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));
    }

    const logout = async () => {
        try {
            // Call backend logout endpoint to clear session
            await fetch("http://localhost:8080/api/customer/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            setIsAuthenticated(false);
            localStorage.removeItem("user");
        }
    }

    useEffect(() => {
        async function validateSession() {
            if (typeof window === 'undefined') {
                setIsLoading(false);
                return;
            }

            if(!hasSessionCookie() && !localStorage.getItem("user")){
                setIsLoading(false);
                return;
            }
            try{
                const response = await fetch("http://localhost:8080/api/customer/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if(response.ok){
                    const data = await response.json();
                    const updatedUser = data as User;
                    setIsAuthenticated(true);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    console.log("user cookie active");
                }else{
                    setIsAuthenticated(false);
                    localStorage.removeItem("user");
                    console.log("user cookie not active");
                }
            }catch (err) {
                setIsAuthenticated(false);
                localStorage.removeItem("user");
            }finally {
                setIsLoading(false);
            }
        }
        validateSession();
    }, [])

    return (
        <AuthContext.Provider value={{
            isLoading,
            isAuthenticated: isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuthOld() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}