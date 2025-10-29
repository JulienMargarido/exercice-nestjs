import { CreerChatDto } from '@/domain';

export enum ChatEventType {
  CREATION = 'CREATION',
}

export abstract class ChatEventPayload {
  id: string;
}

export type ChatPayload = ChatEventPayload & CreerChatDto;
