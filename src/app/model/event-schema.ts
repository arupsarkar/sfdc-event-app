import { EventFieldSchema} from './event-field-schema';

export class EventSchema {
  fullName: string;
  deploymentStatus: false;
  eventType: false;
  fields: EventFieldSchema[];
  label: string;
  pluralLabel: string;
}
