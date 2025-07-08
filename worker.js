addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname
  const pathname = url.pathname

  // Mantém o index.html na raiz (startapro.com.br/)
  if (hostname === 'startapro.com.br' && pathname === '/') {
    return fetch(request)
  }

  // Roteia qualquer caminho que não seja a raiz para o Afiliapage
  if (hostname === 'startapro.com.br' && pathname !== '/') {
    const afiliapageBaseUrl = 'https://seuusuario.afiliapage.com' // Substitua pelo seu URL base do Afiliapage
    const afiliapageUrl = afiliapageBaseUrl + pathname
    const response = await fetch(afiliapageUrl, {
      headers: request.headers
    })
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    })
  }

  // Retorna 404 para outros casos não tratados
  return new Response('Página não encontrada', { status: 404 })
}