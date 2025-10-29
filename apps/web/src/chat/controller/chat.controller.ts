import { ChatDto, CreerChatDto } from '@/domain';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ChatService } from '@/service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: `Récupération des chats sauvegardés` })
  @ApiOkResponse({ description: `Le résultat de la récupération des chats sauvegardés`, type: ChatDto })
  recupereChats(): Promise<ChatDto[]> {
    return this.chatService.recupererChats();
  }

  @Post('/creer')
  @ApiBody({
    description: `Un chat a créer`,
    type: CreerChatDto,
    required: true,
  })
  @ApiOperation({ summary: `Création d'un chat` })
  @ApiCreatedResponse({ description: `Chat créé`, type: ChatDto })
  creerChat(@Body() chatDto: CreerChatDto): Promise<ChatDto> {
    return this.chatService.creerChat(chatDto);
  }
}
