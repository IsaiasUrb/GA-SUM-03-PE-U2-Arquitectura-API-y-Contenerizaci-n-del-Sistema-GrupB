import { Controller, Post, Body } from '@nestjs/common';
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

export class RecuperarDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.identificador, body.password);
  }

  @Post('recuperar')
  async recuperar(@Body() body: RecuperarDto) {
    return this.authService.solicitarRecuperacion(body.email);
  }
}
