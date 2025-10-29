import { PersistanceChatModule } from '@/persistence';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';

@Module({
  imports: [PersistanceChatModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatServiceModule {}
