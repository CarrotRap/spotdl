const { exec } = require('child_process')
const fs = require('fs')

module.exports.addMetadata = (file, buffer, song) => {
    return new Promise(resolve => {
        const fileMusic = file + song.id + '_music.mp3'
        const fileCover = file + song.id + '_cover.jpg'

        fs.writeFileSync(fileMusic, buffer)
        fs.writeFileSync(fileCover, song.image)

        exec(`ffmpeg -i ${fileMusic} -i ${fileCover} -map 0 -map 1:0 -metadata title="${song.title}" -metadata artist="${song.artist}" -metadata album="${song.album}" ${file + song.id}.mp3`, ((err, stdout, stderr) => {
            if(!err) {
                const buf = fs.readFileSync(file + song.id + '.mp3')

                fs.rmSync(fileMusic)
                fs.rmSync(fileCover)
                fs.rmSync(file + song.id + '.mp3')

                resolve(buf)
            }
        }))
    });
}