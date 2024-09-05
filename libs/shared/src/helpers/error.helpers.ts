export interface CustomError {
    msg: string
    statusCode: number
}

export function stringError(error: CustomError) {
    return JSON.stringify(error)
}

export function objectError(error: string): CustomError {
    try {
        return JSON.parse(error)
    } catch (e) {
        return { msg: 'Initial server error', statusCode: 404 }
    }
}