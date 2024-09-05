import { ArgumentsHost, Catch, ExceptionFilter, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { throwError } from "rxjs";

@Catch(RpcException)
export class RpcExceptionCathcer implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        console.log('here1');

        const error: any = exception.getError();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
            // @ts-ignore
            .json(error);
    }
} 