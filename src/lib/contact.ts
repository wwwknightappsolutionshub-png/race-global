export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`
}

export function whatsappHref(phone: string) {
  return `https://wa.me/${digitsOnly(phone)}`
}
