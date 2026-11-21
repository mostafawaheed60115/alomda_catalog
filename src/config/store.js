/** Static business details shown across the catalog. */
export const CONTACT = {
  name: 'العمدة',
  tagline: 'كتالوج مواد البناء والعزل',
  phone: '01206989343',
  phoneIntl: '+201206989343',
  whatsapp: '201206989343', // wa.me expects digits only, with country code
  address: 'أسيوط - شارع كورنيش النيل - بجوار توكيل شيفروليه - وأمام كافيه Coffee66',
};

export const telLink = `tel:${CONTACT.phoneIntl}`;

/** WhatsApp link with a prefilled message. Inquiry only, not a checkout. */
export const waLink = (text = 'مرحبا اود الاستفسار عن منتجاتكم') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

/** Inquiry about one product: «مرحبا اود الاستفسار عن المنتج (اسم المنتج)». */
export const productInquiryLink = (productName) => waLink(`مرحبا اود الاستفسار عن المنتج (${productName})`);

export const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${CONTACT.address} أسيوط`,
)}`;
