// Config
export { CHURCH_PIX_KEY } from './config';

// Types
export * from './types';

// Contexts
export * from './contexts';

// Hooks
export * from './hooks/useClient';
export * from './hooks/useSession';

// Lib
export * from './lib';

// Utils
export { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, PAYMENT_METHOD_LABEL } from './utils/labels';
export { calculateTotalWithPixSurcharge, PIX_SURCHARGE } from './utils/payment';
export { PHONE_PLACEHOLDER } from './utils/text';
