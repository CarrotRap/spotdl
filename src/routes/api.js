const express = require('express');
const yts = require('yt-search');
const ytdl = require("ytdl-core");
const fs = require('fs');

const spotify = require('../utils/spotify');
const metadata = require('../utils/metadata');

const router = express.Router();

router.get('/', (req,res) => {
    res.send('Welcome to api')
})

router.get('/song', async (req,res) => {
    const id = req.headers.id

    if(!id) {
        return res.status(400).json({error: 'all headers are not finding'})
    }

    // Fetch metadata song
    const song = await spotify.getTrack(id)

    // Request YT for search
    const r = await yts(song.artist + ' - ' + song.title);

    // Find better music with duration
    const music = r.all.find((element) => {
        const gap = Math.abs(song.seconds - element.seconds) / song.seconds * 100

        return (gap < 1)
    })

    if(!music) {
        return res.status(200).json({error: 'not music in youtube'})
    }

    // Donwload music from yt
    const buffers = []
    ytdl(music.url, {quality: 'highestaudio', format: 'mp3'})
        .on('response', response => {
            //console.log(response)
        })
        .on('data', d => buffers.push(d))
        .on('end', async () => {
            const buf = Buffer.concat(buffers);

            res.send(await metadata.addMetadata('./src/download/', buf, song));
        })
})

module.exports = router