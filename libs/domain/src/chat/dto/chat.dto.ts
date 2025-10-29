import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, validateSync } from 'class-validator';
import { Sexe } from '../sexe.enum';
import { Chat } from '../chat';
import { plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';

export class ChatDto implements Chat {
  @ApiProperty({ description: 'Identifiant unique du chat', type: String })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nom du chat', type: String })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Age du chat en année', type: Number })
  @IsNumber()
  @Min(0)
  age: number;

  @ApiProperty({ description: 'Sexe du chat', type: String, enum: Sexe })
  @IsEnum(Sexe)
  sexe: Sexe;

  constructor(dto?: unknown) {
    if (dto) {
      Object.assign(this, plainToInstance(this.constructor as new () => ChatDto, dto, { enableImplicitConversion: true }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        const error = `Erreur lors du mapping de ChatDto : ${JSON.stringify(errors)}`;
        throw new InternalServerErrorException(error);
      }
    }
  }
}
