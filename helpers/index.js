module.exports = {
    transformBase64OrString(data, type) {
        if(type === 'string') {
            return Buffer.from(data,'base64').toString('ascii')
        }
        return Buffer.from(data).toString('base64')
    }
}