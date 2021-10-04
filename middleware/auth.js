const auth = (handler) => async (req, res) => {    
    try {
        const { authorization } = req.headers
        if (authorization === `Bearer ${process.env.BOT_AUTH}`) {
            return handler(req, res)
        } else {
            res.status(401).end()
        }
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message }).end();
    }
}

export default auth