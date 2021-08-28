// Covers async functions with try and catch
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}