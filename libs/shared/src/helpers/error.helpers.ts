import { RpcException } from "@nestjs/microservices"

export interface CustomError {
    msg: string
    statusCode: number
    data?: any
}

export function stringError(error: CustomError) {
    return JSON.stringify(error)
}

export function objectError(error: string): CustomError {
    try {
        return JSON.parse(error)
    } catch (e) {
        return { msg: 'Initial server error', statusCode: 404, data: null }
    }
}

export function RpcStringError(msg: string, statusCode: number, data: any = null) {
    throw new RpcException(JSON.stringify({ msg, statusCode, data }))
}