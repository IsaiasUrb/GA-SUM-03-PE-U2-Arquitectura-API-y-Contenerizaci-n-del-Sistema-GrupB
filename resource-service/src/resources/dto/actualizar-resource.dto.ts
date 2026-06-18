import { PartialType } from '@nestjs/mapped-types';
import { CrearResourceDto } from './crear-resource.dto';

export class ActualizarResourceDto extends PartialType(CrearResourceDto) {}