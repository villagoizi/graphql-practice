const {Task} = require('../models')

module.exports = {
    async getAllTasks() {
        return await Task.find()
    },
    async getTaskByUserId(id,{skip, limit}) {
        return await Task.find({ user: id }).sort({_id: -1}).skip(skip).limit(limit)
    },
    async getTaskById(id) {
        return await Task.findById(id)
    }
}