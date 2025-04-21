import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJWTPayload extends JwtPayload {
    role: string 
}

interface User {
    userName: string
    role: string
}

export const getCurrentUser = (token: string | null | undefined): User | null => {

    if (!token) {
        return null;
    }

    const data = jwtDecode<CustomJWTPayload>(token);
    const userName = data.sub;
    const role = data.role;
    if (!userName  || !role) {
        return null;
    }

    return {
        userName: userName,
        role: role,
    };
};