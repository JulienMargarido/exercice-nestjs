import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class MyTemplateController {
  @Get()
  getHello(): string[] {
    return ['Hello !', 'Tu devrais jeter un oeil à localhost:3000/swagger ;)'];
  }
}
