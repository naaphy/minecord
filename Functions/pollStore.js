const polls = new Map()

module.exports = {
    createPoll (id, data) {
        polls.set(id, data)
    },
    getPoll (id) {
        return polls.get(id)
    },
    deletePoll (id) {
        polls.delete(id)
    }
}