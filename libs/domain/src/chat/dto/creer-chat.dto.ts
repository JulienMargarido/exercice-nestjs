import { OmitType } from '@nestjs/swagger';
import { ChatDto } from './chat.dto';
import { plainToInstance } from 'class-transformer';

type CreerChatDtoType = Omit<ChatDto, 'id'>;

export class CreerChatDto extends OmitType(ChatDto, ['id']) {
  constructor(dto?: CreerChatDtoType) {
    super();
    Object.assign(this, plainToInstance(CreerChatDto, dto, { enableImplicitConversion: true }));
  }
}
