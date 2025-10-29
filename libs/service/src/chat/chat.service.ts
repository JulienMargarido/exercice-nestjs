import { Chat, ChatDto, CreerChatDto } from '@/domain';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from '@/persistence';

/**
 * ChatService : contient la logique métier.
 */
@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async recupererChats(): Promise<ChatDto[]> {
    return (await this.chatRepository.recupererChats()).map(this.toChat);
  }

  creerChat(chatDto: CreerChatDto): Promise<ChatDto> {
    return this.chatRepository.creerChat(chatDto);
  }

  private toChat(chatDto: ChatDto): Chat {
    const chat = new Chat();
    chat.id = chatDto.id;
    chat.nom = chatDto.nom;
    chat.age = chatDto.age;
    chat.sexe = chatDto.sexe;
    return chat;
  }
}
