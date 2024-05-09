let LIVE_BACKEND_URL = null
let DEV_BACKEND_URL = 'http://localhost:8000/api/app'
let PRODUCTION_BACKEND_URL = 'http://api.bindr.site/api/app'
let SANDBOX_BACKEND_URL = ''
let BACKEND_URL = null
switch(2){
  case 0:
    BACKEND_URL = DEV_BACKEND_URL
    break
  case 1:
    BACKEND_URL = SANDBOX_BACKEND_URL
    break   
  case 2:
    BACKEND_URL = PRODUCTION_BACKEND_URL
    break
}
export default {
  IS_DEV: BACKEND_URL,
  API_URL: BACKEND_URL + '/',
  BACKEND_URL: BACKEND_URL,
  TEST: false,
  HOST: 'http://localhost:8000',
  
}
