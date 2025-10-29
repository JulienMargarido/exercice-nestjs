import { EventMessage } from '../event';
import { IngestionChatEventMock } from '../mocks/ingestion-chat-event-mock';
import { extractMessageContent } from './event-extractor';

describe('extractMessageContent', () => {
  it('doit retourner null lorsque eventMessage est indéfini', () => {
    expect(extractMessageContent(undefined)).toBeNull();
  });

  it('doit extraire et analyser le JSON depuis un EventMessage contenant un message sous forme de chaîne', () => {
    const jsonMessage = JSON.stringify(IngestionChatEventMock.ingestionEventCreationMock());
    const eventMessage = new EventMessage();
    eventMessage.detail = jsonMessage;

    expect(extractMessageContent(eventMessage)).toEqual(JSON.parse(jsonMessage));
  });

  it("doit retourner directement le message s'il est déjà un IngestionChatEvent", () => {
    const eventData = IngestionChatEventMock.ingestionEventCreationMock();

    const eventMessage = new EventMessage();
    eventMessage.detail = eventData;

    expect(extractMessageContent(eventMessage)).toEqual(eventData);
  });

  it('doit analyser le JSON lorsque eventMessage est une chaîne JSON valide', () => {
    const jsonMessage = JSON.stringify(IngestionChatEventMock.ingestionEventCreationMock());
    expect(extractMessageContent(jsonMessage)).toEqual(JSON.parse(jsonMessage));
  });

  it("doit retourner eventMessage s'il est déjà un IngestionChatEvent", () => {
    const eventData: IngestionChatEventMock = IngestionChatEventMock.ingestionEventCreationMock();

    expect(extractMessageContent(eventData)).toEqual(eventData);
  });
});
