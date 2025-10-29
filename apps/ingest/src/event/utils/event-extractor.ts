import { stringify } from '@/shared-configuration';
import { Logger } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { isJSON } from 'class-validator';
import { EventMessage, IngestionChatEvent } from '../event';

/**
 * Un message provenant d'une source comme EventBridge ou SNS n'étant pas formaté, à date, de la même manière,
 * il convient, dans un but de résilience, d'extraire de différentes manières le message utile.
 */
export function extractMessageContent(eventMessage?: object | string): IngestionChatEvent | null {
  if (!eventMessage) {
    Logger.debug('Event vide', 'extractMessageContent');
    return null;
  }

  if (instanceOf(eventMessage, EventMessage) && eventMessage.detail) {
    Logger.debug(`Event de type EventMessage : ${stringify(eventMessage)}`, 'extractMessageContent');

    if (typeof eventMessage.detail === 'string' && isJSON(eventMessage.detail)) {
      Logger.debug(`Champ 'detail' de type string : ${eventMessage.detail}`, 'extractMessageContent');
      return JSON.parse(eventMessage.detail);
    } else if (instanceOf(eventMessage.detail, IngestionChatEvent)) {
      Logger.debug(`Champ 'detail' de type IngestionChatEvent : ${stringify(eventMessage.detail)}`, 'extractMessageContent');
      return eventMessage.detail;
    }
  }

  if (typeof eventMessage === 'string' && isJSON(eventMessage)) {
    Logger.debug(`Event de type string : ${eventMessage}`, 'extractMessageContent');
    return JSON.parse(eventMessage);
  }

  if (instanceOf(eventMessage, IngestionChatEvent)) {
    Logger.debug(`Event de type IngestionChatEvent : ${stringify(eventMessage)}`, 'extractMessageContent');
    return eventMessage;
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceOf<T>(value: any, targetClass: ClassConstructor<T>): value is T {
  if (typeof value !== 'object' || value === null) return false;

  // Vérifie si toutes les propriétés du prototype de la classe cible sont dans l'objet.
  const targetPrototype = targetClass.prototype;
  return Object.keys(targetPrototype).every((key) => key in value);
}
