import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.path,
            method: request.method,
            message: exception.message.error || exception.message || null
        }

        Logger.error(
            `${request.method} ${request.url}`,
           JSON.stringify(errorResponse),
            'ExceptioFilter'
        );

        response.status(404).json(errorResponse);
    }
}