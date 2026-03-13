'use strict';

/**
 * Service Worker — 原生 Cache API 实现
 *
 * 三层缓存策略：
 *   1. App 壳（JS/CSS/HTML）：预缓存 + cacheFirst
 *   2. 课程 JSON 数据：networkFirst（内容会更新）
 *   3. 音频资源：cacheFirst + 容量限制（按需缓存）
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = 'shell-'  + CACHE_VERSION;
const DATA_CACHE    = 'data-'   + CACHE_VERSION;
const AUDIO_CACHE   = 'audio-'  + CACHE_VERSION;
const ALL_CACHES    = [SHELL_CACHE, DATA_CACHE, AUDIO_CACHE];

const AUDIO_MAX_ENTRIES = 80;

/** App 壳资源，安装时预缓存 */
const PRECACHE_URLS = [
  'index.html',
  'manifest.json',
  'build/main.js',
  'build/main.css',
  'build/polyfills.js',
  'assets/img/appicon.png',
  'assets/img/appicon-192.png'
];

// ─── install ───────────────────────────────────────────────────────────────

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(function(cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// ─── activate ──────────────────────────────────────────────────────────────

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return ALL_CACHES.indexOf(key) === -1; })
          .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ─── fetch ─────────────────────────────────────────────────────────────────

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // 非 GET 请求直接走网络
  if (event.request.method !== 'GET') return;

  // 音频资源：cacheFirst + 容量控制
  if (url.indexOf('/assets/site/assets/audio/') !== -1 ||
      url.indexOf('/assets/audio/') !== -1) {
    event.respondWith(audioCacheFirst(event.request));
    return;
  }

  // 课程 JSON 数据：networkFirst（优先拉最新，失败时用缓存）
  if (url.indexOf('/assets/site/') !== -1 && url.indexOf('.json') !== -1) {
    event.respondWith(networkFirst(event.request, DATA_CACHE));
    return;
  }

  // App 壳及其他本地资源：cacheFirst
  event.respondWith(cacheFirst(event.request, SHELL_CACHE));
});

// ─── 策略函数 ───────────────────────────────────────────────────────────────

function cacheFirst(request, cacheName) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }
      var clone = response.clone();
      caches.open(cacheName || SHELL_CACHE).then(function(cache) {
        cache.put(request, clone);
      });
      return response;
    });
  });
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(cacheName || DATA_CACHE).then(function(cache) {
          cache.put(request, clone);
        });
      }
      return response;
    })
    .catch(function() {
      return caches.match(request);
    });
}

function audioCacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (!response || response.status !== 200) return response;
      var clone = response.clone();
      caches.open(AUDIO_CACHE).then(function(cache) {
        cache.keys().then(function(keys) {
          if (keys.length >= AUDIO_MAX_ENTRIES) {
            cache.delete(keys[0]);
          }
          cache.put(request, clone);
        });
      });
      return response;
    });
  });
}
