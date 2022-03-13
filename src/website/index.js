const accessToken = window.location.hash.substr(1).split('&')[0].split('=')[1];

Vue.createApp({
    data() {
        return {
            showConnect: (!accessToken),
            playlists: [],
            playlistOpen: null,
            trackPlaylistOpen: [],
        }
    },
    methods: {
        openConfirm() {
          let url = 'https://accounts.spotify.com/authorize';
          url += '?response_type=token';
          url += '&client_id=' + encodeURIComponent('e3a1001be5634dd6b0d6bd5cdca44e57');
          url += '&scope=' + encodeURIComponent('playlist-read-private');
          url += '&redirect_uri=' + encodeURIComponent(window.location.origin);
          window.location.replace(url)
        },
        getArtist(track) {
            var artist = ""
            for(var i = 0; i < track.artists.length; i++) {
                artist = artist + track.artists[i].name + ((i + 1 !== track.artists.length) ? ', ' : '');
            }
            return artist
        },
        develop(playlist) {
            if(this.playlistOpen !== playlist.id) {
                fetch(playlist.tracks.href, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                }).then(res => res.json()).then(data => {
                    this.trackPlaylistOpen = data.items
                    this.playlistOpen = playlist.id
                })
            } else {
                this.playlistOpen = null;
            }
        },
        download(track, e) {
            e.target.setAttribute('data-state', 'dl')
            fetch('/api/song', {headers: {id: track.id}}).then(res => res.arrayBuffer()).then(buffer => {
                e.target.setAttribute('data-state', 'isdl')
                saveBuffer(buffer, track.name + ' - ' + this.getArtist(track))
            });
        },
        downloadPlaylist(playlist) {
            for(const track of this.trackPlaylistOpen) {
                document.getElementById(track.track.id).click()
            }
        }
    },
    mounted() {
        if(accessToken) {
            fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }).then(res => res.json()).then(data => {
                this.playlists = data.items
            })
        }
    }
}).mount('#app');

function saveBuffer(buffer, filename) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display="none";
    const blob = new Blob([buffer], {type: 'audio/mpeg3'})
    const url = window.URL.createObjectURL(blob);
    a.href=url;
    a.download=filename + '.mp3';
    a.click()
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}