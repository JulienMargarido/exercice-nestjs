import { SharedConfigurationModule } from '@/shared-configuration';
import { Logger, Module, Type } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatInMemoryRepository } from './inmemory/inmemory.repository';

const repository: Type<ChatRepository> = ChatInMemoryRepository;

@Module({
  imports: [SharedConfigurationModule],
  providers: [
    {
      provide: ChatRepository,
      useClass: repository,
    },
  ],
  exports: [ChatRepository],
})
export class PersistanceChatModule {
  constructor() {
    Logger.debug(`Utilisation du repository '${repository.name}'`, PersistanceChatModule.name);
  }
}
