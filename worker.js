addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // Mantém o index.html na raiz (startapro.com.br/)
  if (hostname === 'startapro.com.br' && pathname === '/') {
    return fetch(request);
  }

  // Roteia caminhos para subdomínios correspondentes
  if (hostname === 'startapro.com.br' && pathname !== '/') {
    // Remove a barra inicial e usa o caminho como subdomínio
    const subdomain = pathname.replace(/^\//, ''); // Remove a barra inicial (ex.: /exemplo -> exemplo)
    const targetUrl = `https://${subdomain}.startapro.com.br${pathname}`; // Monta o subdomínio (ex.: exemplo.startapro.com.br/exemplo)
    
    try {
      const response = await fetch(targetUrl, {
        headers: request.headers,
        redirect: 'follow'
      });
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (error) {
      return new Response('Subdomínio não encontrado ou erro de conexão', { status: 502 });
    }
  }

  // Retorna 404 para outros casos não tratados
  return new Response('Página não encontrada', { status: 404 });
}
