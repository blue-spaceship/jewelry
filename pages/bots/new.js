import Axios from 'axios'

import styles from '/styles/Layout.module.scss'
import inputs from '/styles/Input.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'

const NewBot = () => {
    const router = useRouter()

    const [webhook, setWebhook] = useState('')
    const [bot, setBot] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setIsValid(false)
        setBot({})
    },[webhook])

    const validate = async (event) => {
        event.preventDefault()
        setLoading(true)

        await Axios.get(webhook).then( result => {
            if(result.data.id){
                setIsValid(true)
                setBot(result.data)
            }
        }).catch( error => {
            setIsValid(false)
            alert("Algo deu errado na validação, verifique o webhook")
        }).finally( () => {
            setLoading(false)
        })
    }

    const submit = async (event) => {
        event.preventDefault()
        setLoading(true)

        await Axios.post('/api/bots',{
            name: bot.name,
            botWebhook: webhook
        }).then(result => {
            router.push(`/bots/${result.data._id}`)
        }).catch( error => {
            alert("Algo deu errado na hora de salvar")
        }).finally( () => {
            setLoading(false)
        })
    }

    return (
        <section className={styles.container}>
            <div className={styles.cardBox} style={{ flex: 1 }}>
                <label className={inputs.inputGroup}>
                    <span>Webhook</span>
                    <input type="text" onChange={ event => { setWebhook( event.target.value ) }} value={ webhook } required/>
                </label>
                { !isValid && <button className={ inputs.button } onClick={validate}>Verificar webhook</button> }
                { isValid && <button className={ inputs.button } onClick={submit}>Salvar</button>}
            </div>

            { loading ? 'carregando' : '' }
        </section>
    )
}

export default NewBot