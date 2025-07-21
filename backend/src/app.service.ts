import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'CRM Farmacêutico API está funcionando! 🚀';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'CRM Farmacêutico API',
      version: '1.0.0',
    };
  }
}
