import { ChatDto } from '../dto/chat.dto';
import { CreerChatDto } from '../dto/creer-chat.dto';
import { ChatMock } from './chat';

export class ChatDtoMock {
  static get chatDtoMock(): ChatDto {
    return new ChatDto(ChatMock.chat);
  }

  static get chatDtoMock2(): ChatDto {
    return new ChatDto(ChatMock.chat2);
  }

  static get creerChatDtoMock() {
    return new CreerChatDto(ChatDtoMock.chatDtoMock);
  }

  static get creerChatDtoMock2() {
    return new CreerChatDto(ChatDtoMock.chatDtoMock2);
  }
}
