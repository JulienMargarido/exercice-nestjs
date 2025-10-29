import { createMock } from '@golevelup/ts-jest';
import { ChatService } from '@/service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';

describe(ChatController.name, () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: createMock<ChatService>() }],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);
  });

  it('doit être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('recupereChats', () => {
    it('doit appeler chatService.recupereChats et retourner un tableau de chats', async () => {
      chatService.recupererChats.mockResolvedValue([]);

      const result = await controller.recupereChats();

      expect(chatService.recupererChats).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
