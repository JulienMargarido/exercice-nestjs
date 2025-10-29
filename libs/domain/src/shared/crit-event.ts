import { v4 as uuidV4 } from 'uuid';

export abstract class CritEvent<EventType, Payload> {
  eventType: EventType;
  eventId: string;
  entityId: string;
  timestamp: string;
  entityData: Payload;
  additionalInfo?: unknown;
}

export function toEvent<T, P>(entityId: string, eventType: T, entityData: P): CritEvent<T, P> {
  return {
    eventType,
    eventId: uuidV4(),
    entityId,
    timestamp: Date.now().toString(),
    entityData,
  };
}
