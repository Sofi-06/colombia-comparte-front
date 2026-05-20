import { useEffect, useState } from 'react'
import { countryConfigs, type CountrySlug } from '../../config/countries'

type Props = {
  apiUrl?: string
  initialCountrySlug?: CountrySlug | null
  initialOpen?: boolean
  onCountryChange?: (countrySlug: CountrySlug) => void
}

export default function ChatWidgetApp({
  apiUrl,
  initialCountrySlug,
  initialOpen = false,
  onCountryChange,
}: Readonly<Props>) {
  const [open, setOpen] = useState(initialOpen)
  const [text, setText] = useState('')
  const [countrySlug, setCountrySlug] = useState<CountrySlug>(initialCountrySlug ?? 'colombia')

  useEffect(() => {
    setOpen(initialOpen)
  }, [initialOpen])

  const handleCountryChange = (nextCountrySlug: CountrySlug) => {
    setCountrySlug(nextCountrySlug)
    setOpen(true)
    onCountryChange?.(nextCountrySlug)
  }

  return (
    <div className="cc-chat-widget">
      <button
        className="cc-chat-widget__launcher"
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir chat"
      >
        💬
      </button>

      <div className={`cc-chat-widget__panel ${open ? 'cc-chat-widget__panel--open' : ''}`}>
        <div className="cc-chat-widget__header">
          <div className="cc-chat-widget__title">Chat</div>
          <select
            className="cc-chat-widget__country-select"
            aria-label="Seleccionar pais"
            value={countrySlug}
            onChange={(event) => handleCountryChange(event.target.value as CountrySlug)}
          >
            {Object.values(countryConfigs).map((country) => (
              <option key={country.slug} value={country.slug}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="cc-chat-widget__messages">
          <p className="cc-chat-widget__hint">
            Estas conversando con {countryConfigs[countrySlug].brandName}.
          </p>
          <p className="cc-chat-widget__hint">
            API: {apiUrl}
          </p>
        </div>

        <div className="cc-chat-widget__composer-row">
          <textarea
            className="cc-chat-widget__composer"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            type="button"
            className="cc-chat-widget__send"
            onClick={() => { setText('') }}
            aria-label="Enviar"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
