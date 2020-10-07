const { skip } = require('graphql-resolvers')
const { getTaskByUserId, getTaskById } = require('../../services')
const { Types: { ObjectId } } = require('mongoose')

module.exports = {
    isAuthenticated: (_,__,{email}) => email ? skip : new Error('Login please'),
    isTaskOwner: async (_, { id }, { userId } ) => {
        try {
            if(!ObjectId.isValid(id)){
                throw new Error('Invalid id')
            }
            const task = await getTaskById(id)
            if(!task) {
                throw new Error('Task is not found')
            }
            if( task.user.toString() !== userId ) {
                throw new Error('Task is not found')
            }
            return skip
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}