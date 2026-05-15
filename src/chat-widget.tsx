import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import ChatWidgetApp from './components/chatbot/ChatWidgetApp'
import widgetStyles from './components/chatbot/chatWidget.css?inline'

type MountChatWidgetOptions = {
  apiUrl?: string
}

const DEFAULT_API_URL = 'http://127.0.0.1:8000/chat'

export function mountChatWidget(
  element: HTMLElement,
  options: MountChatWidgetOptions = {},
) {
  const shadowRoot = element.shadowRoot ?? element.attachShadow({ mode: 'open' })

  shadowRoot.replaceChildren()

  const style = document.createElement('style')
  style.textContent = widgetStyles

  const appHost = document.createElement('div')
  shadowRoot.append(style, appHost)

  const root: Root = createRoot(appHost)
  root.render(
    <StrictMode>
      <ChatWidgetApp apiUrl={options.apiUrl?.trim() || DEFAULT_API_URL} />
    </StrictMode>,
  )

  return () => {
    root.unmount()
    shadowRoot.replaceChildren()
  }
}
