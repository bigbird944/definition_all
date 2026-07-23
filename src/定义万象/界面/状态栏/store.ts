import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';
import { getCurrentMessageId } from '@util/message';

export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId()
});
