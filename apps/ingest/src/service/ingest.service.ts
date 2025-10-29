import { ChatService } from '@/service';
import { stringify } from '@/shared-configuration';
import { extractMessageContent } from '../event/utils/event-extractor';
import { ChatEventType, ChatPayload } from '../event/chat';
import { EventMessage, IngestionChatEvent } from '../event/event';
import { Injectable, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class IngestService {
  constructor(private readonly chatService: ChatService) {}

  public ingestEvent(eventMessage?: EventMessage | object): Promise<HttpStatus> {
    Logger.log(`Début de l'ingestion...`, IngestService.name);
    Logger.debug(`Événement : ${stringify(eventMessage)}`, IngestService.name);

    try {
      const eventMessageContent = extractMessageContent(eventMessage);
      if (eventMessageContent) {
        return this.gestionEvent(eventMessageContent);
      } else {
        Logger.error(`Événement inconnu... ${eventMessage}`, IngestService.name);
      }
    } catch (error) {
      Logger.error(`Une erreur est survenue lors du traitement de l'événement '${eventMessage}': ${error}`, IngestService.name);
    }

    return Promise.resolve(HttpStatus.BAD_REQUEST);
  }

  public async gestionEvent(event: IngestionChatEvent): Promise<HttpStatus> {
    Logger.log(`Ingestion d'un événement : ${stringify(event)}`, IngestService.name);

    switch (event.eventType) {
      // Events de Chats
      case ChatEventType.CREATION:
        return await this.ingestionChat(event.entityData as ChatPayload);
      default:
        Logger.error('Événement inconnu...', IngestService.name);
        return HttpStatus.BAD_REQUEST;
    }
  }

  private async ingestionChat(chatPayload: ChatPayload): Promise<HttpStatus> {
    try {
      Logger.log(`Ingestion d'un chat : ${stringify(chatPayload)}`, IngestService.name);

      await this.chatService.creerChat(chatPayload);
      Logger.log(`Chat récupéré avec succès !`, IngestService.name);

      return HttpStatus.CREATED;
    } catch (error) {
      Logger.error(`Une erreur est survenue lors de la création du chat : ${error}`, IngestService.name);
      return HttpStatus.BAD_REQUEST;
    }
  }
}
