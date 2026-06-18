import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generarUsername(nombre: string, apellido: string): string {
    const partes = apellido.trim().split(' ');
    const primerApellido = partes[0] ?? '';
    const segundoApellido = partes[1] ?? '';
    return (
      nombre.charAt(0).toLowerCase() +
      primerApellido.toLowerCase() +
      (segundoApellido ? segundoApellido.charAt(0).toLowerCase() : '')
    );
  }

  private validarCedulaEcuatoriana(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) return false;
    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;
    const digitos = cedula.split('').map(Number);
    const verificador = digitos[9];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let val = digitos[i];
      if (i % 2 === 0) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      suma += val;
    }
    const residuo = suma % 10;
    const digitoEsperado = residuo === 0 ? 0 : 10 - residuo;
    return verificador === digitoEsperado;
  }

  async login(identificador: string, password: string) {
    let usuario: any = null;

    const esCedula = /^\d{10}$/.test(identificador);
    const esEmail = identificador.includes('@');

    if (esCedula && this.validarCedulaEcuatoriana(identificador)) {
      usuario = await this.prisma.usuarios.findUnique({
        where: { cedula: identificador },
      });
    } else if (esEmail) {
      usuario = await this.prisma.usuarios.findUnique({
        where: { email: identificador },
      });
    } else {
      const todosUsuarios = await this.prisma.usuarios.findMany({
        where: { activo: true },
      });
      usuario = todosUsuarios.find((u) => {
        const username = this.generarUsername(u.nombre, u.apellido);
        return username === identificador.toLowerCase();
      });
    }

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const usuarioRoles = await this.prisma.usuario_roles.findMany({
      where: { usuario_id: usuario.id, activo: true },
      include: { roles: true },
    });

    const roles = usuarioRoles.map((ur: any) => ur.roles.nombre);

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        cedula: usuario.cedula,
        roles,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        valid: true,
        usuario: {
          id: payload.sub,
          email: payload.email,
          nombre: payload.nombre,
          apellido: payload.apellido,
          roles: payload.roles,
        },
      };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}