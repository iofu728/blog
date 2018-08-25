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
    "revision": "08f8880ce9b168291d29d02631d83d91"
  },
  {
    "url": "assets/css/0.styles.6acf8380.css",
    "revision": "e42c9a86c12568452a3e08c38719b12e"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.7ad27450.js",
    "revision": "1947cb80cf49ac00c1f35e22673610b1"
  },
  {
    "url": "assets/js/11.c37c162c.js",
    "revision": "b5bffcfd7a552f2f66e52fa4bf2ff0fa"
  },
  {
    "url": "assets/js/12.db5c7c0b.js",
    "revision": "b8639bb838faa3853087df2eb65a81d0"
  },
  {
    "url": "assets/js/13.8b613be9.js",
    "revision": "5b6b4ce4f33b8d31c37a42aa1b477a68"
  },
  {
    "url": "assets/js/14.8fa9218f.js",
    "revision": "3f05bca148425b37577b5b12e3b595ab"
  },
  {
    "url": "assets/js/15.a162fd7c.js",
    "revision": "f565a2f71a033e124c9fbd7cc42d9379"
  },
  {
    "url": "assets/js/16.00f5c57b.js",
    "revision": "78ce021693e179636644be1f7697ba80"
  },
  {
    "url": "assets/js/17.90d4a479.js",
    "revision": "e5dd993339a3ef8d8f1ec704bcf7f17e"
  },
  {
    "url": "assets/js/18.af519db8.js",
    "revision": "17dc0e775f5f4225f6a03c4a94b1ccc1"
  },
  {
    "url": "assets/js/19.355ef318.js",
    "revision": "85f0adc88780ab115d56f0ca3ef0c05c"
  },
  {
    "url": "assets/js/2.285762ea.js",
    "revision": "93afbd4e91ed17280e84a6930dc81b17"
  },
  {
    "url": "assets/js/20.171a4f1a.js",
    "revision": "e01ee80245b214e91681b77e0b2b066a"
  },
  {
    "url": "assets/js/21.77afc3d0.js",
    "revision": "ff5d507be5357b3591d9d04ccb13a67b"
  },
  {
    "url": "assets/js/22.e3dbb09b.js",
    "revision": "23eaba8e7f2703c98fbb5aeb71724916"
  },
  {
    "url": "assets/js/3.ad3b6e7c.js",
    "revision": "7e7e64c0fe18ebd4b8933dde30c7153d"
  },
  {
    "url": "assets/js/4.0f9f1586.js",
    "revision": "e4f0947c04348991d40008d51e4321b1"
  },
  {
    "url": "assets/js/5.5e526c6a.js",
    "revision": "444b0a6f0d7f6c147d462d8e3e489b0a"
  },
  {
    "url": "assets/js/6.d8844d1c.js",
    "revision": "e2f47607404122893d9d03176c327c72"
  },
  {
    "url": "assets/js/7.0005dfa0.js",
    "revision": "380d1becf98b6bc2128dc80dd3cf0fd3"
  },
  {
    "url": "assets/js/8.62c9f7e5.js",
    "revision": "bd93f4b84923500aecd395a7ff4bdb7d"
  },
  {
    "url": "assets/js/9.e81b42cd.js",
    "revision": "9f59a06246722279d6384c2dc5537fe1"
  },
  {
    "url": "assets/js/app.3c753b35.js",
    "revision": "989000d22c3483353315c593442fdd66"
  },
  {
    "url": "index.html",
    "revision": "f7778757161a6d30e95ed7a9193d58b1"
  },
  {
    "url": "pdd/deploy.html",
    "revision": "a9ab7ab646a04780c1048f57ef98bb01"
  },
  {
    "url": "pdd/dva.html",
    "revision": "d12e9d15b38e7b98b1398ed08d62deb2"
  },
  {
    "url": "pdd/faq.html",
    "revision": "2d693749d4d3a11e7a152659628fc631"
  },
  {
    "url": "pdd/fetch.html",
    "revision": "342d39bb532fa3e824236e2bc2340cb2"
  },
  {
    "url": "pdd/index.html",
    "revision": "17eb88323f6f7c8fc591ef854626a08a"
  },
  {
    "url": "pdd/mock.html",
    "revision": "422d283ef1d1ebef517728ca8ad1b7fb"
  },
  {
    "url": "pdd/promise.html",
    "revision": "3003a8d09a35c30666a76a058fd68515"
  },
  {
    "url": "pdd/router.html",
    "revision": "bc4433c337fb7d8f6ea0f960f264f722"
  },
  {
    "url": "pdd/structure.html",
    "revision": "cc51cfe1e20171615905f73df645cc71"
  },
  {
    "url": "pdd/style.html",
    "revision": "5d03d8a50449131835ed1b981b21362e"
  },
  {
    "url": "react/component.html",
    "revision": "0a67bff544d6ea5c0efb8cfca654ecf4"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "de9ab1afc1d9af217c400bdde2a17c81"
  },
  {
    "url": "react/immutable.html",
    "revision": "b341e5cae71293b19b5d24614227683d"
  },
  {
    "url": "react/index.html",
    "revision": "f7b3cd0091182a025d1342462cf27d8b"
  },
  {
    "url": "react/redux.html",
    "revision": "e660fb8fd831e2f58f3757bfd6982aa8"
  },
  {
    "url": "react/reduxs.html",
    "revision": "9004d8fd5631bf86a89a6055da1d786f"
  },
  {
    "url": "summary/cs.html",
    "revision": "e7f442489d841039f44d515c5a3f5512"
  },
  {
    "url": "summary/index.html",
    "revision": "38e071d7a4a9d6aeca27a99dffa182ec"
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
