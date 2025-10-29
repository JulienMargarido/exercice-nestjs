import { Chat, ChatMock, CreerChatDto } from '@/domain';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../chat.repository';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ChatInMemoryRepository implements ChatRepository {
  private readonly chatsInMemory: Chat[] = [...ChatMock.chats];

  recupererChats(): Promise<Chat[]> {
    return Promise.resolve(this.chatsInMemory);
  }

  creerChat(chat: CreerChatDto): Promise<Chat> {
    let newChat: Chat = { ...chat, id: uuidV4() };
    this.chatsInMemory.push(newChat);
    return Promise.resolve(newChat);
  }
}
