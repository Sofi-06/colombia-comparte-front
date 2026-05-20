import { countryConfigs, type CountrySlug } from '../config/countries'

export type PublicModalIntent = 'request' | 'donation'
export const OPEN_PUBLIC_MODAL_EVENT = 'cc:open-public-modal'
export const SUPPRESS_CHATBOT_COUNTRY_REDIRECT_KEY = 'chatbot:suppress-country-redirect'

const PUBLIC_MODAL_INTENT_KEY = 'public:modal-intent'

type ParsedPublicHash = {
  routeHash: string
  sectionId: string
}

export function parsePublicHash(hash: string): ParsedPublicHash {
  const normalizedHash = hash || ''
  const hashWithoutPrefix = normalizedHash.startsWith('#') ? normalizedHash.slice(1) : normalizedHash
  const [routePart, sectionPart = ''] = hashWithoutPrefix.split('#')

  return {
    routeHash: routePart ? `#${routePart}` : '',
    sectionId: sectionPart.trim(),
  }
}

export function savePendingPublicModalIntent(intent: PublicModalIntent) {
  globalThis.sessionStorage.setItem(PUBLIC_MODAL_INTENT_KEY, intent)
}

export function consumePendingPublicModalIntent(): PublicModalIntent | null {
  const storedIntent = globalThis.sessionStorage.getItem(PUBLIC_MODAL_INTENT_KEY)

  if (storedIntent !== 'request' && storedIntent !== 'donation') {
    return null
  }

  globalThis.sessionStorage.removeItem(PUBLIC_MODAL_INTENT_KEY)
  return storedIntent
}

export function getCountrySectionHash(countrySlug: CountrySlug, sectionId: string) {
  return `${countryConfigs[countrySlug].homePath}#${sectionId}`
}

export function openCountryContactFlow(countrySlug: CountrySlug, intent: PublicModalIntent) {
  savePendingPublicModalIntent(intent)
  globalThis.location.hash = getCountrySectionHash(countrySlug, 'contacto')
}

export function openRegionalDonationFlow() {
  globalThis.sessionStorage.setItem(SUPPRESS_CHATBOT_COUNTRY_REDIRECT_KEY, 'true')
  globalThis.location.hash = '#como-apoyar'
}

export function dispatchOpenPublicModal(intent: PublicModalIntent, countrySlug?: CountrySlug | null) {
  globalThis.dispatchEvent(
    new CustomEvent(OPEN_PUBLIC_MODAL_EVENT, {
      detail: {
        intent,
        countrySlug: countrySlug ?? null,
      },
    }),
  )
}
