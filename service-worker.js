// Define um nome e versão para o cache

const CACHE_NAME = 'bloco-matrix-v1';

// Lista de arquivos essenciais para o funcionamento offline do app

const FILES_TO_CACHE = [

  '/',

  '/index.html'

];

// Evento de Instalação: é acionado quando o service worker é registrado pela primeira vez.

self.addEventListener('install', (event) => {

  console.log('[Service Worker] Instalando...');

  

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => {

      console.log('[Service Worker] Colocando arquivos essenciais em cache');

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  

  self.skipWaiting();

});

// Evento de Ativação: é acionado após a instalação e serve para limpar caches antigos.

self.addEventListener('activate', (event) => {

  console.log('[Service Worker] Ativando...');

  

  event.waitUntil(

    caches.keys().then((keyList) => {

      return Promise.all(keyList.map((key) => {

        // Se o nome do cache não for o atual, ele é deletado

        if (key !== CACHE_NAME) {

          console.log('[Service Worker] Removendo cache antigo:', key);

          return caches.delete(key);

        }

      }));

    })

  );

  

  self.clients.claim();

});

// Evento de Fetch: intercepta todas as requisições de rede da página.

self.addEventListener('fetch', (event) => {

  console.log('[Service Worker] Fetching:', event.request.url);

  

  event.respondWith(

    // Tenta encontrar a resposta no cache primeiro

    caches.match(event.request).then((response) => {

      // Se encontrar no cache, retorna a resposta do cache.

      // Se não, faz a requisição à rede.

      return response || fetch(event.request);

    })

  );

});

