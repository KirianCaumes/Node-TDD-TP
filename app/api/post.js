const baseModel = require('../../models/_base')

module.exports = (app, db) => {
    app.post('/post', async (req, res) => {
        let post = new db.Post({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        })
        await post.save()
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err))
    })

    app.get('/posts', async (req, res) => {
        const { include } = req.query

        let posts = await db.Post.find({}).sort({ '_id': 1 }).exec()
            .then(data => { return data })
            .catch(err => res.status(400).json(err))

        let authors = await db.Author.find({ _id: { $in: posts.map(x => x.author) } }).exec()
            .then(data => { return data })
            .catch(err => res.status(400).json(err))

        //Set data
        const base = { ...baseModel.base }
        const objTemp = { ...baseModel.base.data[0] }
        const objTempRel = { ...baseModel.relationships.data }
        base.data = posts.map(el => {
            const obj = { ...objTemp }
            obj.type = "posts"
            obj._id = el._id.toString()
            obj.attributes = {
                title: el.title,
                content: el.content,
            }
            const objRel = { ...objTempRel }
            objRel._id = el.author
            objRel.type = "author"

            obj.relationships = {
                "author": {
                    data: objRel
                }
            }

            return obj
        })

        //Set included
        if (include === "author") {
            const objTempInc = { ...baseModel.base.included[0] }
            base.included = authors.map(el => {
                const obj = { ...objTempInc }
                obj.type = "author"
                obj._id = el._id.toString()
                obj.attributes = {
                    firstName: el.firstName,
                    lastName: el.lastName,
                }
                return obj
            })
        } else {
            base.included = []
        }


        res.status(200).json(base)
    })
}
