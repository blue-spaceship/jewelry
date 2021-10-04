import Axios from 'axios'

const Handle = async (req,res) => {     
    const { id } = req.query 

    await Axios.post(`${process.env.NEXTAUTH_URL}api/bots/${id}/webhook`, { ...req.body } , {
        headers: {
            "Authorization" : `Bearer ${process.env.BOT_AUTH}`
        }
    }).then( result => {
        res.status(200)
    }).catch( error => {
        res.status(500)
    })

    res.end()
}

export default Handle