const jwt = require('jsonwebtoken')

module.exports = {
    async verifyJwt(req) {
        req.email = null
        req.userId = null
        try {
            const header = req.headers.authorization
            if(header){
                const token = header.split(' ')[1]
                const data = jwt.verify(token, process.env.JWT_SECRET)
                req.email = data.email
                req.userId = data.id
            }
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}