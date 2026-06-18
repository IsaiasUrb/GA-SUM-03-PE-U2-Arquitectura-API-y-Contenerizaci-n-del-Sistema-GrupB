import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CrearNotificationDto {
  @IsNotEmpty({ message: 'El destinatario es obligatorio' })
  @IsString()
  destinatario: string;

  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  @IsString()
  @Length(2, 500, {
    message: 'El mensaje debe tener entre 2 y 500 caracteres',
  })
  mensaje: string;

  @IsOptional()
  @IsString()
  @IsIn(['info', 'advertencia', 'error'], {
    message: 'El tipo debe ser info, advertencia o error',
  })
  tipo?: string;
}