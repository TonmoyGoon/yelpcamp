module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

// Used for all async function in our routes.
// Basically catches validation error,objectid error