/**Static cache name*/
const staticCacheName = 'site-static-v4'
/**Dynamic cache name*/
const dynamicCacheName = 'site-dynamic-v6'
/**Static array of references that request assets*/
const staticAssets = [
  '/', 
  '/index.html',
  '/js/App.js',
  '/js/UI.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/404.html'
]

/**
 * Cache size limiter
 * @param {String} name Name of the cache that its going to be reduced
 * @param {Number} size Number of items that will be allowed in the cache
 */
const limitCacheSize = (name, size) => {
  //Open the cache
  caches.open(name)
  .then(cache => { //When the cache opens get the 'keys' of the resources
    cache.keys()
    .then(keys => { //When the keys are returned check
      if(keys.length > size){ //If the cache has more item than allowed
        cache.delete(keys[0]) //Delete the first element
        .then(limitCacheSize(name, size)) //Recursivity to keep deleting until the cache is the wanted size
      }
    })
  })
}

/**
 * Install event listener
 * Can be used to cache assets that dont change a lot on an sw update
 */
self.addEventListener('install', evt => {
  // console.log('Service worker has been installed', evt)
  //Wait so the browser doesnt kills the service worker
  evt.waitUntil(
    //Open or create a cache named staticCacheName
    caches.open(staticCacheName)
    .then(cache => { //Cache is opened
      console.log('Caching shell assets')
      //Reach out to the server and cache
      cache.addAll(staticAssets)
    })
    .catch(err => console.log(err))
  )
})

/**
 * Activate event listener
 * Can be used to deleted old cache and manage cache versions
 */
self.addEventListener('activate', evt => {
  // console.log('Service worker has been activated', evt)
    //Let the event wait until the action is done
  evt.waitUntil(
    //Get an array of keys in the cache
    caches.keys()
    .then(keys => {
      // console.log(keys)
      //Cycle through the keys and delete the old cache all promises need to be resolved
      return Promise.all(
        //Filter the ones that will stay
        keys.filter( key => key !== staticCacheName && key !== dynamicCacheName )
        //Delete the caches that werent filtered
        .map(key => caches.delete(key))
      )
    })
  )
})

/**
 * Fetch event listener
 * Used modify network response and enhance user experience
 */
self.addEventListener('fetch', evt => {
  //Filter certain APIs URLs
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    // console.log('Fetch event', evt)
    // Pause fetch and respond with a custom event
    evt.respondWith(
      //Look if something in the caches matches the event request
      caches.match(evt.request)
      .then(cacheRes => { //Returns a cache response
        // console.log(cacheRes)
        //If the response matches the request and was precached return the cache response
        //If not return the original fetch
        return cacheRes 
        || fetch(evt.request).then(
          fetchRes => {
            //Take what has been returned from the server and store it in the dynamic cache
            return caches.open(dynamicCacheName)
              .then(cache =>{ 
                //Copy the response to return it 
                //Put into the cache the server response with the url as the access key
                cache.put(evt.request.url, fetchRes.clone())
                //Check to limit the cache size
                limitCacheSize(dynamicCacheName, 15)
                //Return the response to the browser
                return fetchRes
              })
            }
          )
      }).catch(() => { //If there was an error in the request go to the fall back options
        //If the request was for a html page
        if(evt.request.url.indexOf('.html') > -1){
          //Return the 404 offline fallback
          return caches.match('pages/404.html')
        }
        //Other conditions for other type of requests
      })
    )
  }
})