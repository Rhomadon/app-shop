const path = require('path')
const fs = require('fs')
const config = require('../config')
const Products = require('./models')

const store = async (req, res, next) => {
    try {
        let payload = req.body
        if(req.file) {
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    let product = new Products({...payload, image_url: filename})
                    await product.save()
                    return res.json(product)
                } catch (err) {
                    fs.unlinkSync(target_path)
                    if(err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
            })
            src.on('error', async() => {
                next(err)
            })
        } else {
            let product = new Products(payload)
            await product.save()
            return res.json(product)
        }
    } catch (err) {
        if(err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        let payload = req.body
        let { id } = req.params

        if(req.file) {
            let tmp_path = req.file.path
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1]
            let filename = req.file.filename + '.' + originalExt
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`)

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(target_path)
            src.pipe(dest)

            src.on('end', async () => {
                try {
                    let product = await Products.findById(id)
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}` 
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage)
                    }

                    product = await Products.findByIdAndUpdate(id, payload, {
                        new: true,
                        runValidators: true
                    })
                    return res.json(product)
                } catch (err) {
                    fs.unlinkSync(target_path)
                    if(err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
            })
            src.on('error', async() => {
                next(err)
            })
        } else {
            let product = await Products.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            })
            return res.json(product)
        }
    } catch (err) {
        if(err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 8 } = req.query
        let product = await Products
        .find()
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        return res.json(product)
    } catch (err) {
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try {
        let product = await Products.findOneAndDelete({_id: req.params.id})

        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`

        if(fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }

        return res.json(product)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    store,
    update,
    index,
    destroy
}