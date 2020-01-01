// Check if the serviceWorker property is in the navigator
if('serviceWorker' in navigator){
    //Register the service worker with the path of the sw file (async op)
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('Service worker registered', reg)) //Then
  .catch((err) => console.log('Service worker not registered', err)) //Error
}