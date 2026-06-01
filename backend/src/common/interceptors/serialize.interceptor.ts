import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize(dto: any) {
  return function (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (descriptor) {
      // Method decorator
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        const result = originalMethod.apply(this, args);
        if (result instanceof Promise) {
          return result.then((data) =>
            plainToInstance(dto, data, { excludeExtraneousValues: true }),
          );
        }
        return plainToInstance(dto, result, { excludeExtraneousValues: true });
      };
      return descriptor;
    } else {
      // Class decorator - use interceptor
      return target;
    }
  };
}
