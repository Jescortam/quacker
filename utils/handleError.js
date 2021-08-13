module.exports = (err) => {
    return (req, res, next) => {
        next(err);
    }
}