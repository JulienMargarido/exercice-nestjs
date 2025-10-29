import { EventMessage } from '../event';
import { IngestionChatEventMock } from './ingestion-chat-event-mock';

export class EventMessageMock {
  static eventMessageMock(override?: Partial<EventMessage>): EventMessage {
    return {
      detail: IngestionChatEventMock.ingestionEventCreationMock(),
      ...override,
    };
  }
}
