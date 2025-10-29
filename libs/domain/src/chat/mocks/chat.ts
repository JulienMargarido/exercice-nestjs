import { Chat } from '../chat';
import { Sexe } from '../sexe.enum';
import { v4 as uuidV4 } from 'uuid';

export class ChatMock {
  static get chat(): Chat {
    return {
      id: uuidV4(),
      nom: 'John Doe',
      age: 30,
      sexe: Sexe.Male,
    };
  }

  static get chat2(): Chat {
    return {
      id: uuidV4(),
      nom: 'Jane Doe',
      age: 25,
      sexe: Sexe.Femelle,
    };
  }

  static get chat3(): Chat {
    return {
      id: uuidV4(),
      nom: 'Alice Smith',
      age: 28,
      sexe: Sexe.Femelle,
    };
  }
  static get chats(): Chat[] {
    return [this.chat, this.chat2, this.chat3];
  }
}
