import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    const origin = request.get('Origin') || 'Unknown Origin';
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} - Origin: ${origin}`,
    );
    return next.handle().pipe(tap(() => {}));
  }
}
