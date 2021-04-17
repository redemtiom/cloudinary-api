const fs = require('fs')
const readline = require('readline')
var cloudinary = require('cloudinary').v2
const { cloud_name, api_key, api_secret } = require('../config').cloudinary
const { Parser } = require('json2csv')

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
            fs.unlink(localFile.path, (err) => { console.log(err) })
            res.send(imagesNotUploaded.length ? imagesNotUploaded : imagesUploaded).status(200)
        })
    },

    reportByFolder: async (req, res) => {
        console.log('entre a report by folder')
        let { folder, type } = req.body
        type = (type) ? type : 'upload'

        let items = []
        let nextCursor = ''
        /*let options = {
            type: type,
            prefix : `${folder}/`,
            max_results: 500
        }*/

        try {
            do {
                //let { resources, next_cursor } = await getItemsByFolder({...options, next_cursor: nextCursor})
                let { resources, next_cursor } = await getItemsBySearch(folder, nextCursor)
                items.push(...resources)
                nextCursor = next_cursor
                //console.log(`next cursor: ${next_cursor}`)
                //console.log(`Resources: ${resources.length}`)
            } while (nextCursor)

            console.log(`items in items: ${items.length}`)

            const csv = await dataToCsv(items)
            fs.writeFile('file01.csv', csv, (err) => {
                console.log(`err ${err}`)
            })
            //controller.abort()
            //res.header('Content-Type', 'text/csv')
            //res.attachment('file')
            res.send('hola')
            //res.send(items)
        } catch (e) {
            console.log(e)
            res.send(e).status(400)
        }
    }
}

const dataToCsv = (data) => {
    const fields = [
        "asset_id",
        "public_id",
        "format",
        "version",
        "resource_type",
        "type",
        "created_at",
        "bytes",
        "width",
        "height",
        "backup",
        "access_mode",
        "url",
        "secure_url"
    ]
    const json2csv = new Parser({ fields })

    return new Promise((resolve, reject) => {
        try {
            const csv = json2csv.parse(data)
            resolve(csv)
        } catch (err) {
            reject(err)
        }
    })
}

const getItemsByFolder = async (options) => {
    return new Promise((resolve, reject) => {
        cloudinary.api.resources(options, (error, result) => {
            (result) ? resolve(result) : reject(error)
        })
    })
}

const getItemsBySearch = async (folder, nextCursor) => {
    console.log('entre a get items by search')
    return new Promise((resolve, reject) => {
        try {
            cloudinary.search.expression(`folder:${folder}`).max_results(500).next_cursor(nextCursor).execute().then(result => {
                (result) ? resolve(result) : reject('error critico')
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

const uploadToCloudinary = (folder, image, url) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(url, { folder: `external/${folder}/`, public_id: `${image}` }, (error, result) => {
            (result) ? resolve(result) : reject(error)
        })
    })
}