import { Module } from '@nestjs/common';
import { MyTemplateController } from './my-template.controller';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [MyTemplateController],
  providers: [],
  exports: [],
})
export class WebModule {}
