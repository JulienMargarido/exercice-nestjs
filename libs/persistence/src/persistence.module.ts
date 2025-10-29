import { SharedConfigurationModule } from '@/shared-configuration';
import { Module } from '@nestjs/common';
import { PersistanceChatModule } from './chat';

@Module({
  imports: [SharedConfigurationModule, PersistanceChatModule],
  providers: [],
  exports: [],
})
export class PersistenceModule {}
