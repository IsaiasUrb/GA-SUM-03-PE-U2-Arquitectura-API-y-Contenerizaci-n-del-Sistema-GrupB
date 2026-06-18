import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  identificador: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body.identificador, body.password);
    return {
      status: 'success',
      data: result,
      message: 'Login exitoso',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('validate')
  async validate(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    const token = authHeader.split(' ')[1];
    const result = await this.authService.validateToken(token);
    return {
      status: 'success',
      data: result,
      message: 'Token válido',
      timestamp: new Date().toISOString(),
    };
  }
}