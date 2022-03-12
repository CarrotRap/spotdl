const axios = require('axios').default
const fs = require('fs');

const clientID = 'e3a1001be5634dd6b0d6bd5cdca44e57';
const clientSecret = 'a526fd3092914dc2b136cff25da576c7';

module.exports.init = () => {
    const refreshToken = () => {
        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + new Buffer(clientID + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString()
        }).then(res => {
            console.log(res.data)
            this.accessToken = res.data.access_token
        })
    }

    refreshToken()
    setInterval(() => {
        refreshToken()
    }, 3600000)
}

module.exports.getTrack = (id) => {
    return new Promise(resolve => {
        axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/tracks/' + id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            }
        }).then(async ({data}) => {
            var artist = ""
            for(var i = 0; i < data.artists.length; i++) {
                artist = artist + data.artists[i].name + ((i + 1 !== data.artists.length) ? ', ' : '');
            }

            const image = Buffer.from((await axios.get((data.album.images.find(a => a.width === 300)).url, { responseType: 'arraybuffer' })).data, 'utf-8')

            const song = {
                id: data.id,
                title: data.name,
                album: data.album.name,
                seconds: Math.round(data.duration_ms / 1000),
                artist, image,
            }

            resolve(song)
        })
    })

}