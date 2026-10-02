export const WHATSAPP_PHONE = '2348124680837';
export const SECONDARY_PHONE = '+234 806 543 0680';
export const DISPLAY_PHONE = '+234 812 468 0837';

export const WHATSAPP_MESSAGES = {
  fresh: 'Hello Lomstel Agro, I would like to order Fresh Oyster Mushrooms. Please send me the available sizes, prices and delivery options.',
  dried: 'Hello Lomstel Agro, I would like to order Dried Oyster Mushrooms. Please send me the available sizes, prices and delivery options.',
  wholesale: 'Hello Lomstel Agro, I am interested in wholesale/bulk oyster mushroom supply. Please send me your wholesale prices and minimum order quantities.',
  hospitality: 'Hello Lomstel Agro, I am interested in regular oyster mushroom supply for my restaurant/hotel. Please send me your business supply information.',
  general: 'Hello Lomstel Agro, I would like to order your oyster mushrooms. Please send me your available products, prices and delivery information.',
  tour: 'Hello Lomstel Agro, I would like to inquire about your farm and facility in Ogun State or discuss a bulk partnership tour.',
};

export function getWhatsAppUrl(message: string = WHATSAPP_MESSAGES.general, phone: string = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string = WHATSAPP_MESSAGES.general, phone: string = WHATSAPP_PHONE): void {
  window.open(getWhatsAppUrl(message, phone), '_blank', 'noopener,noreferrer');
}
