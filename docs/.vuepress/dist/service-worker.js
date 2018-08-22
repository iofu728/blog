/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "c7cb9f852c9d24c1ace87374ad2debed"
  },
  {
    "url": "assets/css/0.styles.fbe6ebeb.css",
    "revision": "467391bb1fc4644a41ab1abf7d1ba9ca"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.f6748a2b.js",
    "revision": "230bd67711f32b8b2a7ae25482e313da"
  },
  {
    "url": "assets/js/11.3beef752.js",
    "revision": "ca1c50a0a63f9a02cc488daffcefdbc3"
  },
  {
    "url": "assets/js/12.ca6a0a19.js",
    "revision": "2086c997f910d3e4b4c44083821e21fa"
  },
  {
    "url": "assets/js/2.285762ea.js",
    "revision": "93afbd4e91ed17280e84a6930dc81b17"
  },
  {
    "url": "assets/js/3.055c1421.js",
    "revision": "c9e3a150f63f1d228c2d27b507e46fdd"
  },
  {
    "url": "assets/js/4.8b704ce1.js",
    "revision": "16b306a56637258cc61342aedf6a4698"
  },
  {
    "url": "assets/js/5.e9ea53a3.js",
    "revision": "4c3c0a167ccaad499a8a5b31b018d3b1"
  },
  {
    "url": "assets/js/6.ab98a570.js",
    "revision": "cb19ea6b28e0ce1dcfcf5563b91e8527"
  },
  {
    "url": "assets/js/7.b75baddb.js",
    "revision": "627d0ddc13429da1a073ff0c85df49e8"
  },
  {
    "url": "assets/js/8.24169997.js",
    "revision": "eb8172651d1f8a17d313455e0266623c"
  },
  {
    "url": "assets/js/9.c1e638ed.js",
    "revision": "70973ca102b352d11ece496d0b005ec8"
  },
  {
    "url": "assets/js/app.a2971b80.js",
    "revision": "e62db413af49b340e995c96b1d1f7982"
  },
  {
    "url": "index.html",
    "revision": "0211b19474cf6cf3099c843a32240918"
  },
  {
    "url": "react/component.html",
    "revision": "d8bc75df3cf5613b702b6dca572f69c9"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "c71bea0ffe0398166a732b4f997def75"
  },
  {
    "url": "react/immutable.html",
    "revision": "4b3d24f7ab551e3a9fc5010377cedb09"
  },
  {
    "url": "react/index.html",
    "revision": "8d4a26d8e530f2dd8a942573af5a8715"
  },
  {
    "url": "react/redux.html",
    "revision": "e420a4a60bdccfd6b9f5a4f5376b806c"
  },
  {
    "url": "react/reduxs.html",
    "revision": "fadf9af22c5af0ee0deaa3be80af95ba"
  },
  {
    "url": "summary/cs.html",
    "revision": "71896908465ab7309fb8948f1160cd3a"
  },
  {
    "url": "summary/index.html",
    "revision": "2445aa44edce0726f47c6fdd19f0914b"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
