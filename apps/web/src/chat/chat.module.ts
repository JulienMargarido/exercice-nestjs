import { ChatServiceModule } from '@/service';
import { SharedConfigurationModule } from '@/shared-configuration';
import { Module } from '@nestjs/common';
import { ChatController } from './controller/chat.controller';

@Module({
  imports: [ChatServiceModule, SharedConfigurationModule],
  controllers: [ChatController],
  providers: [],
})
export class ChatModule {}
