export interface CreateUserDto {
    userName: string
    email: string
    password: string
}

export interface LoginDto {
    email: string
    password: string
}