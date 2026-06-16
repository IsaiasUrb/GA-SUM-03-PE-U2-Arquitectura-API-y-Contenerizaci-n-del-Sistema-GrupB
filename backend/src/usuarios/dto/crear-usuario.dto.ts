import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  Length,
  Matches,
} from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsString()
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener solo números' })
  cedula: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @Length(2, 100, {
    message: 'El apellido debe tener entre 2 y 100 caracteres',
  })
  apellido: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @Length(8, 100, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^09\d{8}$/, {
    message: 'El celular 1 debe ser un número ecuatoriano válido',
  })
  celular1?: string;

  @IsOptional()
  @IsString()
  @Matches(/^09\d{8}$/, {
    message: 'El celular 2 debe ser un número ecuatoriano válido',
  })
  celular2?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
