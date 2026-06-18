import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CrearResourceDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}