const {Task} = require('../models')

module.exports.batchTask = async (taskIds) => {
    console.log('Batch tasks: ', taskIds)
    const tasks = await Task.find({_id: { $in: taskIds}})

    return taskIds.map(taskId => tasks.find(task => task.id === taskId))
}