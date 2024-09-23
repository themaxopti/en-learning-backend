import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { objectError } from "../helpers/error.helpers";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const message = objectError(exception.message)


        response
            // @ts-ignore
            .json({
                message: message.msg,
                data: message.data,
                statusCode: message.statusCode,
            });
    }
}