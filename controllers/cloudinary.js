const fs = require('fs')
const readline = require('readline')
var cloudinary = require('cloudinary').v2
const { cloud_name, api_key, api_secret } = require('../config').cloudinary

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
})

module.exports = {
    uploadUrls: (req, res) => {
        let localFile = req.file
        let stream = fs.createReadStream(localFile.path)

        const imagesUploaded = []
        const imagesNotUploaded = []

        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false
        })

        rl.on('line', async (line) => {
            rl.pause()
            let tmpArray = line.split(',')
            try {
                let algo = await uploadToCloudinary(tmpArray[0], tmpArray[1], tmpArray[2])
                imagesUploaded.push(algo)
            } catch (err) {
                imagesNotUploaded.push(err)
            }
            rl.resume()
        })


        rl.on('close', () => {
            rl.close()
            stream.destroy()    
            fs.unlink(localFile.path, (err) => {console.log(err)})
            res.send(imagesNotUploaded.length ? imagesNotUploaded : imagesUploaded ).status(200)
        })
    }
}

const uploadToCloudinary = (folder, image, url) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(url, { folder: `external/${folder}/`, public_id: `${image}`}, (error, result) => {
            (result) ? resolve(result) : reject(error)
        })
    })
}