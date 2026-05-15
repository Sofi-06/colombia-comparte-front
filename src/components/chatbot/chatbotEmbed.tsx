import { useEffect, useRef, useState } from 'react'

const WIDGET_VERSION = '20260515-1'
const DEFAULT_WIDGET_SCRIPT_URL = `/chatbot/chat-widget.js?v=${WIDGET_VERSION}`

type ChatWidgetModule = {
  mountChatWidget?: (
    element: HTMLElement,
    options?: {
      apiUrl?: string
    },
  ) => void | (() => void)
}

type ChatbotEmbedProps = {
  readonly title?: string
}

function getWidgetScriptUrl() {
  return import.meta.env.VITE_CHAT_WIDGET_SCRIPT_URL?.trim() || DEFAULT_WIDGET_SCRIPT_URL
}

function resolveScriptUrl(scriptUrl: string) {
  const baseUrl = 'document' in globalThis ? document.baseURI : location.href
  try {
    return new URL(scriptUrl, baseUrl).href
  } catch {
    return scriptUrl
  }
}

function isPublicOrRelativeUrl(url: string) {
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
}

async function fetchWidgetSource(scriptUrl: string) {
  const resolvedScriptUrl = resolveScriptUrl(scriptUrl)
  const response = await fetch(resolvedScriptUrl)

  if (!response.ok) {
    throw new Error(`No fue posible cargar el widget remoto del chat (${response.status}).`)
  }

  return {
    resolvedScriptUrl,
    source: await response.text(),
  }
}

async function chooseCssUrl(resolvedScriptUrl: string) {
  const envCss = import.meta.env.VITE_CHAT_WIDGET_CSS_URL?.trim()
  const candidates = [
    envCss,
    new URL('./frontend.css', resolvedScriptUrl).href,
    new URL('/frontend.css', resolvedScriptUrl).href,
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { method: 'GET' })
      if (response.ok) {
        return candidate
      }
    } catch {
      // try the next candidate
    }
  }

  return null
}

function transformWidgetSource(source: string, resolvedScriptUrl: string, cssUrl: string | null) {
  let transformedSource = source
    .replaceAll('import.meta.url', JSON.stringify(resolvedScriptUrl))
    .replaceAll('"" + ' + 'import.meta.url', JSON.stringify(resolvedScriptUrl))
    .replaceAll('""+import.meta.url', JSON.stringify(resolvedScriptUrl))

  if (cssUrl) {
    const cssLiteral = JSON.stringify(cssUrl)
    transformedSource = transformedSource.replace(
      /new URL\(\s*["']\.\/frontend\.css["']\s*,\s*(?:""\s*\+\s*)?import\.meta\.url\s*\)\.href/g,
      cssLiteral,
    )
  }

  return transformedSource
}

async function importWidgetFromBlob(source: string) {
  const blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))

  try {
    return (await import(/* @vite-ignore */ blobUrl)) as ChatWidgetModule
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

async function loadWidgetModule(scriptUrl: string) {
  const { resolvedScriptUrl, source } = await fetchWidgetSource(scriptUrl)
  const cssUrl = await chooseCssUrl(resolvedScriptUrl)
  const transformedSource = transformWidgetSource(source, resolvedScriptUrl, cssUrl)

  if (isPublicOrRelativeUrl(scriptUrl)) {
    return importWidgetFromBlob(transformedSource)
  }

  try {
    return (await import(/* @vite-ignore */ resolvedScriptUrl)) as ChatWidgetModule
  } catch {
    return importWidgetFromBlob(transformedSource)
  }
}

function ChatbotEmbed({ title = 'Chatbot Latinoamerica' }: Readonly<ChatbotEmbedProps>) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cleanup: void | (() => void)
    let mountedStyle: HTMLStyleElement | null = null

    const injectVisibilityOverrides = (host: HTMLElement) => {
      // Removed old CSS overrides that broke the new chatbot layout
    }

    const mountWidget = async () => {
      const host = hostRef.current

      if (!host) {
        return
      }

      try {
        setError('')

        const globalProcess = globalThis as {
          process?: { env?: Record<string, string> }
        }

        if (globalProcess.process === undefined) {
          globalProcess.process = { env: {} }
        } else if (globalProcess.process.env === undefined) {
          globalProcess.process = {
            ...globalProcess.process,
            env: {},
          }
        }

        const widgetModule = await loadWidgetModule(getWidgetScriptUrl())

        if (typeof widgetModule.mountChatWidget !== 'function') {
          throw new TypeError('El widget no exporta mountChatWidget. Revisa la URL del archivo remoto.')
        }

        const apiUrl = import.meta.env.VITE_CHAT_API_URL?.trim()
        cleanup = widgetModule.mountChatWidget(host, { apiUrl })
        injectVisibilityOverrides(host)
      } catch (mountError) {
        setError(
          mountError instanceof Error
            ? mountError.message
            : 'No fue posible cargar el widget remoto del chat.',
        )
      }
    }

    mountWidget().catch(() => undefined)

    return () => {
      if (typeof cleanup === 'function') {
        cleanup()
      }
      mountedStyle?.remove()
    }
  }, [])

  return (
    <>
      <div
        ref={hostRef}
        aria-label={title}
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 60,
        }}
      />
      {error ? (
        <div
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: '6rem',
            maxWidth: '20rem',
            padding: '0.75rem 0.9rem',
            borderRadius: '0.9rem',
            background: 'rgba(127, 29, 29, 0.92)',
            color: '#fff',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            zIndex: 61,
          }}
        >
          {error}
        </div>
      ) : null}
    </>
  )
}

export default ChatbotEmbed
