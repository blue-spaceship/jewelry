const handle = (req,res) => {
    return res.status(200).json(process.env)
}

export default handle