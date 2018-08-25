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
    "revision": "5de370b9fed03d0c5e64e11f24d25c42"
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
    "url": "assets/js/app.02cca196.js",
    "revision": "a20075dc2908c55ef58af015e950b60b"
  },
  {
    "url": "index.html",
    "revision": "074ce094eceaa14164c72a2a31e7338a"
  },
  {
    "url": "pdd/deploy.html",
    "revision": "5b5e54244111baeebe7a3a1afd419f0b"
  },
  {
    "url": "pdd/dva.html",
    "revision": "35d46fb1dd3d8d1d5d04e2404f930b80"
  },
  {
    "url": "pdd/faq.html",
    "revision": "614860c94833f0a458c420141e562a27"
  },
  {
    "url": "pdd/fetch.html",
    "revision": "7d2d7e6c7763272120034b06df9bd949"
  },
  {
    "url": "pdd/index.html",
    "revision": "35c0a60621ed5732f6d14fe53bed5062"
  },
  {
    "url": "pdd/mock.html",
    "revision": "e6b2da04de62cc506a8681d87eda76cf"
  },
  {
    "url": "pdd/promise.html",
    "revision": "7bdaf29fe105cecd170a4f85eb45ba96"
  },
  {
    "url": "pdd/router.html",
    "revision": "87eba1c5646c072c5f8bd389bf65a6ab"
  },
  {
    "url": "pdd/structure.html",
    "revision": "ef13c1c428c30413957074712560bd9b"
  },
  {
    "url": "pdd/style.html",
    "revision": "f6494c5a34255b5aa9a33ea233a9b876"
  },
  {
    "url": "react/component.html",
    "revision": "71c6503d7f493aa24996ac071441d9d7"
  },
  {
    "url": "react/componentdidupdate.html",
    "revision": "8be4783705b64c2919bbabae2f0d6abf"
  },
  {
    "url": "react/immutable.html",
    "revision": "d5fa62a163364f872d1f1c3d7538962f"
  },
  {
    "url": "react/index.html",
    "revision": "6de854fcf8b554c9c4d3cf1bf4630f68"
  },
  {
    "url": "react/redux.html",
    "revision": "1198011615314e7b1b1b6b6d6e9f2c3b"
  },
  {
    "url": "react/reduxs.html",
    "revision": "5d439d549aa1d0987a334978d299e184"
  },
  {
    "url": "summary/cs.html",
    "revision": "2e0824ff2a86eee20cd158eafd3be758"
  },
  {
    "url": "summary/index.html",
    "revision": "d9897bb93db41121df6648d6413ffbb6"
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
