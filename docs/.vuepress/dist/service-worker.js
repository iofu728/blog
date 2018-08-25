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
    "revision": "b610c0c70e9f10ecd40e2870cefe73f7"
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
    "url": "assets/js/app.61265c67.js",
    "revision": "8dab7432c3ed71e7de21b3e1183b55fe"
  },
  {
    "url": "index.html",
    "revision": "011ce981ebfebafb421d9b4dde360c2b"
  },
  {
    "url": "pdd/deploy.html",
    "revision": "7de27962a17ca8191a31afb84e2c5bf7"
  },
  {
    "url": "pdd/dva.html",
    "revision": "967f350b6e7506785ac22ed09d5a678f"
  },
  {
    "url": "pdd/faq.html",
    "revision": "2f57ec888b2a3247c3c3d33928d6a652"
  },
  {
    "url": "pdd/fetch.html",
    "revision": "a8b726d7858a79c460cb4d101d2eaaf8"
  },
  {
    "url": "pdd/index.html",
    "revision": "de1a012a84876723bc02c64b4cd2f446"
  },
  {
    "url": "pdd/mock.html",
    "revision": "6088977b2ac934097276b67fa1f03f78"
  },
  {
    "url": "pdd/promise.html",
    "revision": "e228d1cfbff391956e1fd3251eee6f98"
  },
  {
    "url": "pdd/router.html",
    "revision": "6bde0d41e65c06f10363f5b6683b83b2"
  },
  {
    "url": "pdd/structure.html",
    "revision": "3eb72badf41d66c8e279143bed445a7f"
  },
  {
    "url": "pdd/style.html",
    "revision": "4ec2a4a9d99a3cf8620f0e0d12396d22"
  },
  {
    "url": "react/component.html",
    "revision": "4a87f40c0c1519860a351329ac8760f9"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "c96810ea1b5f544359f169d04b978ceb"
  },
  {
    "url": "react/immutable.html",
    "revision": "5d957abd34fb61b83c80d83e3e0d3f88"
  },
  {
    "url": "react/index.html",
    "revision": "7e946295fe1ec7f9b01baa797c9ed99a"
  },
  {
    "url": "react/redux.html",
    "revision": "2901e906836ab188d9f440216c9eed74"
  },
  {
    "url": "react/reduxs.html",
    "revision": "cd4925d1a59bb60ab25a9346082c527f"
  },
  {
    "url": "summary/cs.html",
    "revision": "5876adb8416af2136f11688535d50733"
  },
  {
    "url": "summary/index.html",
    "revision": "5f03b43b5c3fd599dfebfcb9e8c13ed7"
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
