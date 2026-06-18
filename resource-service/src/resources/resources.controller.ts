import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CrearResourceDto } from './dto/crear-resource.dto';
import { ActualizarResourceDto } from './dto/actualizar-resource.dto';
import { successResponse } from '../common/response.util';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async crear(@Body() dto: CrearResourceDto) {
    const recurso = await this.resourcesService.crear(dto);

    return successResponse(recurso, 'Recurso creado correctamente');
  }

  @Get()
  async listar() {
    const recursos = await this.resourcesService.listar();

    return successResponse(recursos, 'Recursos obtenidos correctamente');
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const recurso = await this.resourcesService.buscarPorId(id);

    return successResponse(recurso, 'Recurso obtenido correctamente');
  }

  @Put(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarResourceDto,
  ) {
    const recurso = await this.resourcesService.actualizar(id, dto);

    return successResponse(recurso, 'Recurso actualizado correctamente');
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const recurso = await this.resourcesService.eliminar(id);

    return successResponse(recurso, 'Recurso eliminado correctamente');
  }
}