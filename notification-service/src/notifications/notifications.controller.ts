import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CrearNotificationDto } from './dto/crear-notification.dto';
import { successResponse } from '../common/response.util';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  crear(@Body() dto: CrearNotificationDto) {
    const notification = this.notificationsService.crear(dto);

    return successResponse(
      notification,
      'Notificación procesada correctamente',
    );
  }
}