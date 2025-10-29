import { IngestionChatEvent } from '../event';
import { ChatEventType, ChatPayload } from '../chat';

export class IngestionChatEventMock {
  static ingestionEventCreationMock(override?: Partial<IngestionChatEventMock>): IngestionChatEvent {
    return {
      eventType: ChatEventType.CREATION,
      eventId: 'event-123',
      entityId: 'id-456',
      timestamp: new Date('2025-01-08T11:11:00.000Z').toISOString(),
      entityData: {
        id: 'id-456',
        nom: 'Chat Name',
        age: 30,
        sexe: 'M',
      } as ChatPayload,
      additionalInfo: null,
      ...override,
    };
  }
}
