import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: Record<string, unknown>;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Token JWT no proporcionado o formato inválido',
      );
    }

    const token = authorization.substring(7).trim();

    if (!token) {
      throw new UnauthorizedException('Token JWT no proporcionado');
    }

    try {
      const payload = this.jwtService.verify<Record<string, unknown>>(token);
      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Token JWT inválido o expirado');
    }
  }
}