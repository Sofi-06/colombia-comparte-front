import React, { useState } from 'react'

type Props = {
  apiUrl?: string
}

export default function ChatWidgetApp({ apiUrl }: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

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
        </div>

        <div className="cc-chat-widget__messages" />

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
