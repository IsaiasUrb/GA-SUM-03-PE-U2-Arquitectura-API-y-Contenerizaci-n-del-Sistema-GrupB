import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CrearNotificationDto } from './dto/crear-notification.dto';

@Injectable()
export class NotificationsService {
  crear(dto: CrearNotificationDto) {
    return {
      id: randomUUID(),
      destinatario: dto.destinatario,
      mensaje: dto.mensaje,
      tipo: dto.tipo ?? 'info',
      estado: 'enviada',
      createdAt: new Date().toISOString(),
    };
  }
}