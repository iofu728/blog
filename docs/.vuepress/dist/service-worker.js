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
    "revision": "d6193fcfc554b70cb0855e9db138011e"
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
    "url": "assets/js/app.7c4dfd50.js",
    "revision": "a9ccf92f19c60ba89cb5ac424c12d0ba"
  },
  {
    "url": "index.html",
    "revision": "43dfd978a2f08c5482e0b18b18d2d87e"
  },
  {
    "url": "pdd/deploy.html",
    "revision": "0833d371902263e9e0994f51b4d4be28"
  },
  {
    "url": "pdd/dva.html",
    "revision": "7873991a0a172889adac6809888f731c"
  },
  {
    "url": "pdd/faq.html",
    "revision": "49fec05570ce5048f609ded6ddf95c1e"
  },
  {
    "url": "pdd/fetch.html",
    "revision": "d2a4065c17a30d8d52e38d3731095eae"
  },
  {
    "url": "pdd/index.html",
    "revision": "cb95d28d7b71b84c54c8dc42d088bc6f"
  },
  {
    "url": "pdd/mock.html",
    "revision": "f77af25f0a4c09b1e9c9d2a31b0e5429"
  },
  {
    "url": "pdd/promise.html",
    "revision": "0912f0a1b7c72fcaf7f10c2a7122d22b"
  },
  {
    "url": "pdd/router.html",
    "revision": "a8e88214a7e7acbfce2f423d23f1bbad"
  },
  {
    "url": "pdd/structure.html",
    "revision": "9c11c1d4ad02ec97e0ced564c31a462b"
  },
  {
    "url": "pdd/style.html",
    "revision": "3afddf56578331edcfc53a621a6e2a4b"
  },
  {
    "url": "react/component.html",
    "revision": "f0d8357369c3e2f3cd3a3e1e5a8d5f61"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "d7d73654b155253a0b370a8fc1afc1e4"
  },
  {
    "url": "react/immutable.html",
    "revision": "7da664da4fcc8ebdb498d96d92b76418"
  },
  {
    "url": "react/index.html",
    "revision": "9727d86eaf917690c863f4a0880f0c55"
  },
  {
    "url": "react/redux.html",
    "revision": "1306690bde7329a074f1f0e2f8a6a890"
  },
  {
    "url": "react/reduxs.html",
    "revision": "6134dab2c1039da5cea1398238797209"
  },
  {
    "url": "summary/cs.html",
    "revision": "5876765d9e6dcb27ce9621c572c4e97c"
  },
  {
    "url": "summary/index.html",
    "revision": "1fc8a69d182019eaaca0e7ab23667654"
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
