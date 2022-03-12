const spotify = require('./src/utils/spotify');

spotify.init()

global.dirname = __dirname


require('./src/app').listen(8080)