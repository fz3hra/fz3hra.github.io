'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "c420e205d8eac4ccea99913b4a50bfa7",
"favicon_io.zip": "7512652a98d1f060241db5ea934f27cf",
"index.html": "a8ce2acf1d28019e586e3cc92f1f7442",
"/": "a8ce2acf1d28019e586e3cc92f1f7442",
"main.dart.js": "0c864d740f89910f67dcd0db889343cd",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "4c60b652db832e6a3bcab1888fbb6650",
"favicon_io/favicon-16x16.png": "850a2497652344dcc7d5fefdea130dd2",
"favicon_io/favicon.ico": "7992ff7ae5eafa02efe8711cb4627cf3",
"favicon_io/android-chrome-192x192.png": "9211291aa8e826d274d35584533bfb60",
"favicon_io/apple-touch-icon.png": "ec489f3b47ff4086ddffb8da31f77d3a",
"favicon_io/android-chrome-512x512.png": "ab17192a3df2987f371bb72ccc56d652",
"favicon_io/site.webmanifest": "053100cb84a50d2ae7f5492f7dd7f25e",
"favicon_io/favicon-32x32.png": "c4e7b45f2529c30320b6f9a6b7df8723",
"icons/favicon-16x16.png": "850a2497652344dcc7d5fefdea130dd2",
"icons/android-chrome-192x192.png": "9211291aa8e826d274d35584533bfb60",
"icons/apple-touch-icon.png": "ec489f3b47ff4086ddffb8da31f77d3a",
"icons/android-chrome-512x512.png": "ab17192a3df2987f371bb72ccc56d652",
"icons/logo.png": "4c60b652db832e6a3bcab1888fbb6650",
"icons/favicon-32x32.png": "c4e7b45f2529c30320b6f9a6b7df8723",
"manifest.json": "2a734046b2894aef4b189b1b3259961e",
"assets/AssetManifest.json": "dfac007e0eddda06902ef3c566d4d68a",
"assets/NOTICES": "81e35a750a97353f19de21513abd0131",
"assets/FontManifest.json": "daafbeb1f1394d7f8c8a41b71fa29d05",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "339a410a37fadce514f50f5795b44dd7",
"assets/fonts/MaterialIcons-Regular.otf": "912ee396719de8bdd8f456fe1b92481b",
"assets/assets/left_bottom_giffy.png": "1d1a6336c52930d145722c5eba5566de",
"assets/assets/menu_icon.png": "0592a224d738f9259f48e36a03a732bb",
"assets/assets/right_bottom.png": "c8ec225bb154fb136f3a597e6f020536",
"assets/assets/github.png": "b37b05a713d8eebcbb475119e587859b",
"assets/assets/left_top_giffy.png": "56494677c01d51daffad8e3f38fe6281",
"assets/assets/Blend%2520Group%25206@2x.png": "5274292c5f746ec7ff9856dee378f27b",
"assets/assets/font_styles/Rubik_Pixels/RubikPixels-Regular.ttf": "01997540f8c6d5126ac4770012a04a7f",
"assets/assets/techpng.png": "1d75b66a3fa229d13e200b6d5407377d",
"assets/assets/logo.png": "4c60b652db832e6a3bcab1888fbb6650",
"assets/assets/twitter.png": "6352d995b0c2a0f882503daa1d99a2e7",
"assets/assets/linkedin.png": "fd0d5546fdbdc85c76c4372a0d51f1bc",
"assets/assets/name.png": "4cff6f1aebee20bf00183e0102646dd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
