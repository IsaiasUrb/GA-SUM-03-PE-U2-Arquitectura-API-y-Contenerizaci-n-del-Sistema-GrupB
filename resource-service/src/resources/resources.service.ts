import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearResourceDto } from './dto/crear-resource.dto';
import { ActualizarResourceDto } from './dto/actualizar-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  crear(dto: CrearResourceDto) {
    return this.prisma.resource.create({
      data: dto,
    });
  }

  listar() {
    return this.prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async buscarPorId(id: string) {
    const recurso = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    return recurso;
  }

  async actualizar(id: string, dto: ActualizarResourceDto) {
    await this.buscarPorId(id);

    return this.prisma.resource.update({
      where: { id },
      data: dto,
    });
  }

  async eliminar(id: string) {
    await this.buscarPorId(id);

    return this.prisma.resource.delete({
      where: { id },
    });
  }
}