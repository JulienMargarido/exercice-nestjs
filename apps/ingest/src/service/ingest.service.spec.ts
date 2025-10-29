import { createMock } from '@golevelup/ts-jest';
import { HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { EventMessage } from '../event/event';
import { EventMessageMock } from '../event/mocks/event-message.mock';
import { IngestService } from './ingest.service';
import { ChatService } from '@/service';
import { IngestionChatEventMock } from '../event/mocks/ingestion-chat-event-mock';
import { ChatEventType } from '../event/chat';
import { ChatDtoMock } from '@/domain';

describe('IngestService', () => {
  let ingestService: IngestService;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestService],
      providers: [{ provide: ChatService, useValue: createMock<ChatService>() }],
    }).compile();

    ingestService = module.get<IngestService>(IngestService);
    chatService = module.get(ChatService);
  });

  describe('ingestEvent', () => {
    it(`doit appeler gestionEvent si l'événement est valide`, async () => {
      const eventMessage: EventMessage = EventMessageMock.eventMessageMock();

      const ingestEventSpy = jest.spyOn(ingestService, 'gestionEvent').mockResolvedValue(HttpStatus.CREATED);

      const result = await ingestService.ingestEvent(eventMessage);

      expect(ingestEventSpy).toHaveBeenCalledTimes(1);
      expect(ingestEventSpy).toHaveBeenCalledWith(eventMessage.detail);
      expect(result).toBe(HttpStatus.CREATED);
    });

    it(`doit retourner BAD_REQUEST lorsque le traitement de l'event produit une erreur`, async () => {
      const event = IngestionChatEventMock.ingestionEventCreationMock();
      const eventMessage: EventMessage = EventMessageMock.eventMessageMock({ detail: event });
      const ingestEventSpy = jest.spyOn(ingestService, 'gestionEvent').mockResolvedValue(HttpStatus.BAD_REQUEST);

      const result = await ingestService.ingestEvent(eventMessage);

      expect(result).toBe(HttpStatus.BAD_REQUEST);
      expect(ingestEventSpy).toHaveBeenCalledTimes(1);
      expect(ingestEventSpy).toHaveBeenCalledWith(event);
    });

    it('doit retourner BAD_REQUEST pour un événement inconnu', async () => {
      const event = { invalidField: 'value' };

      const result = await ingestService.ingestEvent(event);

      expect(result).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('gestionEvent', () => {
    it('doit retourner BAD_REQUEST quand le repository rencontre une erreur', async () => {
      const event = IngestionChatEventMock.ingestionEventCreationMock();

      chatService.creerChat.mockRejectedValue(new Error('Erreur dans le repository'));

      const result = await ingestService.gestionEvent(event);

      expect(chatService.creerChat).toHaveBeenCalledWith(event.entityData);
      expect(result).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`doit retourner BAD_REQUEST pour un type d'opération inconnu`, async () => {
      const event = IngestionChatEventMock.ingestionEventCreationMock({
        eventType: 'UNKNOWN' as ChatEventType,
      });

      const result = await ingestService.gestionEvent(event);

      expect(result).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('ingest', () => {
    describe(ChatEventType.CREATION, () => {
      it('doit créer un chat et retourner CREATED', async () => {
        const event = IngestionChatEventMock.ingestionEventCreationMock();
        chatService.creerChat.mockResolvedValue(ChatDtoMock.chatDtoMock);

        const result = await ingestService.gestionEvent(event);

        expect(chatService.creerChat).toHaveBeenCalledWith(event.entityData);
        expect(result).toBe(HttpStatus.CREATED);
      });
    });
  });
});
