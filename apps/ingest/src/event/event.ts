import { CritEvent } from '@/domain';
import { ChatEventPayload, ChatEventType } from './chat';

export class IngestionChatEvent extends CritEvent<ChatEventType, ChatEventPayload> {}

export class EventMessage {
  detail: IngestionChatEvent | string;
}
