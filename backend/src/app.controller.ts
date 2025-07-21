import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({ status: 200, description: 'Retorna mensagem de boas-vindas' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificação de saúde da API' })
  @ApiResponse({ status: 200, description: 'Retorna status da API' })
  getHealth() {
    return this.appService.getHealth();
  }
}
