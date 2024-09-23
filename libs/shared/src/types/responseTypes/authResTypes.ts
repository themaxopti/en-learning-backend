export interface LoginResponse {
    statusCode:number
    data: {
        id: string | number,
        userName: string,
        email: string,
        token: string
    }
}

export interface AuthResponse {
    id: string | number,
    userName: string,
    email: string
}