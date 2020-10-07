const {User} = require('../models')

module.exports.bacthLoadUser =
    async (userIds) => {
        console.log('Batch loaders Users: ', userIds)
        const users = await User.find({_id: { $in: userIds }})

        return userIds.map( userId => users.find( user => user.id === userId) )
    }