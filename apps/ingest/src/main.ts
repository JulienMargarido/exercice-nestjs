import { bootstrapApp, BootstrapConfig } from '@/shared-configuration';
import { Logger } from '@nestjs/common';
import { IngestModule } from './ingest.module';
import { IngestService } from './service/ingest.service';
import { EventMessage, IngestionChatEvent } from './event/event';
import { ChatEventType, ChatPayload } from './event/chat';
import { v4 as uuidv4 } from 'uuid';

async function startLocal() {
  Logger.debug(`Démarrage de l'application Ingest en local...`);

  const bootstrapConfig: BootstrapConfig = {
    includePrefix: false,
    includeSwagger: false,
    includeFilters: false,
    includeInterceptors: true,
  };
  const { app } = await bootstrapApp(IngestModule, bootstrapConfig);
  Logger.debug(`Application locale Ingest bootstrappée...`);

  // NOTE : votre événement personnalisé ici
  const domainEventMessage: IngestionChatEvent = {
    eventType: ChatEventType.CREATION,
    eventId: 'event-123',
    entityId: 'id-456',
    timestamp: new Date().toISOString(),
    entityData: {
      id: uuidv4(),
      nom: 'Chat Name',
      age: 30,
      sexe: 'M',
    } as ChatPayload,
    additionalInfo: null,
  };

  const eventMessage = {
    detail: domainEventMessage,
  } as EventMessage;
  await app.get(IngestService).ingestEvent(eventMessage);
}

startLocal().then(() => {
  Logger.log(`🚀 Processus d'ingestion d'events terminé !`, 'Main');
});
