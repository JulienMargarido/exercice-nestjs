import { Chat, CreerChatDto } from '@/domain';

export abstract class ChatRepository {
  abstract recupererChats(): Promise<Chat[]>;
  abstract creerChat(chat: CreerChatDto): Promise<Chat>;
}
