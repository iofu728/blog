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
    "revision": "96916c6c9e3f3e6a045b7458ea7b8b18"
  },
  {
    "url": "assets/css/0.styles.3df96cd7.css",
    "revision": "e5c9703e6f584c4296fce2469d8bae7f"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.275d0ba9.js",
    "revision": "70bf22fdd04ba241019f33911614b5ef"
  },
  {
    "url": "assets/js/11.6d8af449.js",
    "revision": "7e9b894a4985036cd492fa448801ee77"
  },
  {
    "url": "assets/js/12.5024b96c.js",
    "revision": "0be2b831060ac00b54b3f6042ad4d103"
  },
  {
    "url": "assets/js/13.61196969.js",
    "revision": "6ae8ebd0530d085179eb30453585c0f2"
  },
  {
    "url": "assets/js/14.1196453e.js",
    "revision": "9a62e167630197b11c8a52c9ccd1f51a"
  },
  {
    "url": "assets/js/15.50b8da17.js",
    "revision": "fef679334d5cc2e6ac9d76dea3ff11a2"
  },
  {
    "url": "assets/js/16.3a1ab1a0.js",
    "revision": "b66689aa4858ae9bb24efc4f7eb3b81a"
  },
  {
    "url": "assets/js/17.5b30a4a1.js",
    "revision": "8e8eed237d37e32bc4b28fa622dfd7e3"
  },
  {
    "url": "assets/js/18.a2f84b85.js",
    "revision": "af23ed8e4337a513b8791de2d8009c4e"
  },
  {
    "url": "assets/js/19.1b5a077f.js",
    "revision": "9f48af23f88a285a2bf41c18c589a80b"
  },
  {
    "url": "assets/js/2.4b44695e.js",
    "revision": "386909733073ee4efadbc69ba23bcd42"
  },
  {
    "url": "assets/js/20.c4f4c19e.js",
    "revision": "990a595b34bc90cb31dafc8ea69364c3"
  },
  {
    "url": "assets/js/21.6d610b78.js",
    "revision": "3b59bc383c398fbab0919c4b16a4d6e7"
  },
  {
    "url": "assets/js/22.3f98e06d.js",
    "revision": "ab0486d4473991bad3d044a8d294d400"
  },
  {
    "url": "assets/js/23.be6e8507.js",
    "revision": "94b3091471f08e8f4c2baf5d1e0cb75d"
  },
  {
    "url": "assets/js/3.6da0c082.js",
    "revision": "f7bd63cc68bc8c6ee22b4a8ef0b7fded"
  },
  {
    "url": "assets/js/4.f1dd9c9b.js",
    "revision": "4d0f18b53ea5ecbfc380915f007f358f"
  },
  {
    "url": "assets/js/5.bedf5a1e.js",
    "revision": "72cbd9eb87fa4010af3b848e0fef5967"
  },
  {
    "url": "assets/js/6.98acfe1f.js",
    "revision": "effb0e66d261f4f5b13c9c82f06cfca8"
  },
  {
    "url": "assets/js/7.2827a314.js",
    "revision": "f20e22fdacf18add84f17ca9845f948e"
  },
  {
    "url": "assets/js/8.68db99ee.js",
    "revision": "9414c70e9e1285918530a5afe17ce2c2"
  },
  {
    "url": "assets/js/9.2ae44c3c.js",
    "revision": "a3204c925a0cb58afd32b80de3613521"
  },
  {
    "url": "assets/js/app.8b7bc7c5.js",
    "revision": "7da51e762a13393d03efa6de5f9b522c"
  },
  {
    "url": "assets/js/vendors~docsearch.e0158197.js",
    "revision": "2f3a8df461c7c291e4c13786d5a8573d"
  },
  {
    "url": "collect/index.html",
    "revision": "78cb66a490d46b2c0d794ad626fab75f"
  },
  {
    "url": "index.html",
    "revision": "89bf57e7288db3c95306148e41c3cad4"
  },
  {
    "url": "pdd/deploy.html",
    "revision": "9bebb48f46408187d661ec0e9f7af87e"
  },
  {
    "url": "pdd/dva.html",
    "revision": "c633bfd80bfe89c9474729646aeeee59"
  },
  {
    "url": "pdd/faq.html",
    "revision": "61aa01b2670dda00429656d06f88c28a"
  },
  {
    "url": "pdd/fetch.html",
    "revision": "59d1d66288a1f17f9ba5ab64c2617424"
  },
  {
    "url": "pdd/index.html",
    "revision": "16ec50a316a19e98f94ae59ac61115f5"
  },
  {
    "url": "pdd/mock.html",
    "revision": "2eaad7c4f78f9f31dc62bd5a59f6ffb0"
  },
  {
    "url": "pdd/promise.html",
    "revision": "c2b5898c477c1b61ac68f489587260da"
  },
  {
    "url": "pdd/router.html",
    "revision": "d29f954ee27279fbb754ab9b11df91b2"
  },
  {
    "url": "pdd/structure.html",
    "revision": "1127556f68986d60f134fe0aa889ce0b"
  },
  {
    "url": "pdd/style.html",
    "revision": "e24689eeceaf62a003bf98e2de0a70fa"
  },
  {
    "url": "react/component.html",
    "revision": "dd3887ddfb0642b073da58308453c221"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "a57aaae7d445786f9c00b66a87ec4262"
  },
  {
    "url": "react/immutable.html",
    "revision": "40b5a5d449067742ac49cc6a667d0d07"
  },
  {
    "url": "react/index.html",
    "revision": "8a3b5c5213f0cc44473810798f6a20c7"
  },
  {
    "url": "react/redux.html",
    "revision": "508ccbeaaf4bfd86cb2aaa7dfe108caa"
  },
  {
    "url": "react/reduxs.html",
    "revision": "9355413b646782066a0e3378016a022a"
  },
  {
    "url": "summary/cs.html",
    "revision": "9b6eecdbc2bea7732e0c8fbaf62c70cf"
  },
  {
    "url": "summary/index.html",
    "revision": "2789b61859b88194606643dafdb001bb"
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
