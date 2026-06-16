/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearUsuarioDto) {
    const existeCedula = await this.prisma.usuarios.findUnique({
      where: { cedula: dto.cedula },
    });
    if (existeCedula) {
      throw new ConflictException('Ya existe un usuario con esa cédula');
    }

    const existeEmail = await this.prisma.usuarios.findUnique({
      where: { email: dto.email },
    });
    if (existeEmail) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuarios.create({
      data: {
        cedula: dto.cedula,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password_hash: passwordHash,
        celular1: dto.celular1 ?? null,
        celular2: dto.celular2 ?? null,
      },
    });

    if (dto.roles && dto.roles.length > 0) {
      for (const nombreRol of dto.roles) {
        const rol = await this.prisma.roles.findFirst({
          where: { nombre: nombreRol },
        });
        if (rol) {
          await this.prisma.usuario_roles.create({
            data: {
              usuario_id: usuario.id,
              rol_id: rol.id,
            },
          });
        }
      }
    }

    return this.buscarPorId(usuario.id);
  }

  async listar() {
    const usuarios = await this.prisma.usuarios.findMany({
      where: { activo: true },
      select: {
        id: true,
        cedula: true,
        nombre: true,
        apellido: true,
        email: true,
        username: true,
        celular1: true,
        celular2: true,
        activo: true,
        created_at: true,
        usuario_roles_usuario_roles_usuario_idTousuarios: {
          where: { activo: true },
          include: { roles: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return usuarios.map((u) => ({
      ...u,
      roles: (u.usuario_roles_usuario_roles_usuario_idTousuarios as any[]).map(
        (ur: any) => ur.roles.nombre,
      ),
      usuario_roles_usuario_roles_usuario_idTousuarios: undefined,
    }));
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        cedula: true,
        nombre: true,
        apellido: true,
        email: true,
        username: true,
        celular1: true,
        celular2: true,
        activo: true,
        created_at: true,
        usuario_roles_usuario_roles_usuario_idTousuarios: {
          where: { activo: true },
          include: { roles: true },
        },
      },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return {
      ...usuario,
      roles: (
        usuario.usuario_roles_usuario_roles_usuario_idTousuarios as any[]
      ).map((ur: any) => ur.roles.nombre),
      usuario_roles_usuario_roles_usuario_idTousuarios: undefined,
    };
  }

  async actualizar(id: string, dto: Partial<CrearUsuarioDto>) {
    const usuario = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const data: any = {};
    if (dto.nombre) data.nombre = dto.nombre;
    if (dto.apellido) data.apellido = dto.apellido;
    if (dto.email) data.email = dto.email;
    if (dto.celular1 !== undefined) data.celular1 = dto.celular1;
    if (dto.celular2 !== undefined) data.celular2 = dto.celular2;
    if (dto.password) data.password_hash = await bcrypt.hash(dto.password, 10);

    await this.prisma.usuarios.update({ where: { id }, data });

    if (dto.roles) {
      await this.prisma.usuario_roles.updateMany({
        where: { usuario_id: id },
        data: { activo: false },
      });
      for (const nombreRol of dto.roles) {
        const rol = await this.prisma.roles.findFirst({
          where: { nombre: nombreRol },
        });
        if (rol) {
          const existeRol = await this.prisma.usuario_roles.findFirst({
            where: { usuario_id: id, rol_id: rol.id },
          });
          if (existeRol) {
            await this.prisma.usuario_roles.update({
              where: { id: existeRol.id },
              data: { activo: true },
            });
          } else {
            await this.prisma.usuario_roles.create({
              data: { usuario_id: id, rol_id: rol.id },
            });
          }
        }
      }
    }

    return this.buscarPorId(id);
  }

  async eliminar(id: string) {
    const usuario = await this.prisma.usuarios.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    await this.prisma.usuarios.update({
      where: { id },
      data: { activo: false },
    });

    return { mensaje: 'Usuario desactivado correctamente' };
  }

  async listarRoles() {
    return this.prisma.roles.findMany({ where: { activo: true } });
  }
}
