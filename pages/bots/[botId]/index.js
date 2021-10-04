import { useCallback, useEffect, useState } from 'react'
import Axios from 'axios'

import Handlebars from 'handlebars/dist/cjs/handlebars'
import Head from 'next/head'

import styles from '/styles/Layout.module.scss'
import inputs from '/styles/Input.module.scss'

const Bot = ({ data }) => {
    const [bot, setBot] = useState( data )
    const [template, setTemplate] = useState({ content: bot.template, isValid: null })
    const [testData, setTestData] = useState({ content: bot.test, isValid: null })
    const [result, setResult] = useState('')

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {
            const jsonData = testData.isValid ? JSON.parse(testData.content) : {}
            const toParse = Handlebars.compile(template.content)
            const toShow = toParse(jsonData)
            setResult({ message: toShow })
        } catch (error) {
            setResult({ error: JSON.stringify("error") })
        }
    }, [template, testData])

    function onChangeTemplate(event){
        try {
            Handlebars.precompile(event.target.value)
            setTemplate({ content: event.target.value, isValid: true })
        } catch (error) {
            setTemplate({ content: event.target.value, isValid: false, error: "Template com erros." })
        }
    }

    function onChangeData(event){
        try {
            JSON.parse(event.target.value)
            setTestData({ content: event.target.value, isValid: true })
        } catch (error) {
            setTestData({ content: event.target.value, isValid: false, error: "Dados de testes em formato inválido." })
        }
    }

    const submit = useCallback(() => {
        setLoading(true)
        async function request(){
            try {
                await Axios.put(`/api/bots/${bot._id}`,{
                    ...bot,
                    template: template.content,
                    test: testData.content
                } ).then( result => {
                    setBot(result.data)
                    setTemplate({ ...template, content: result.data.template })
                    setTestData({ ...template, content: result.data.test })
                } ).catch( error => {
                    console.error(error)
                    alert("Algo deu errado na hora de salvar")
                })
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        request()
    }, [bot, template, testData])

    const testButton = async (event) => {
        event.preventDefault()

        const test = JSON.parse(testData.content)
        
        await Axios.post(`/api/bots/${bot._id}/webhook`, {...test}).then( result => {
            alert("Teste enviado com sucesso")
        } ).catch( error => {
            console.error(error)
            alert("Algo deu errado")
        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Jewelry</title>
                <meta name="description" content="A box of jews!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div style={{ gap: '1rem', justifyContent: 'end', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                { testData.isValid !== false && <button className={ inputs.button } onClick={ testButton }>Enviar teste</button> }
                <label className={ bot.isActive ? inputs.checkButtonActive : inputs.checkButton }>
                    <span>Bot { bot.isActive ? 'ativo' : 'inativo' }</span>
                    <input type="checkbox" onChange={ event => { setBot( { ...bot, isActive : event.target.checked } ) }} checked={bot.isActive} required/>
                </label>
                <label className={ bot.isArchived ? inputs.checkButton : inputs.checkButtonActive }>
                    <span>Bot { bot.isArchived ? 'arquivado' : 'não arquivado' }</span>
                    <input type="checkbox" onChange={ event => { setBot( { ...bot, isArchived : event.target.checked } ) }} checked={bot.isArchived} required/>
                </label>
                { loading ? <span className={ inputs.button }>salvando</span> : <button accessKey="s" className={ inputs.buttonSubmit } onClick={ submit }>Salvar</button> }
            </div>

            <div className={styles.cardBox} style={{ flex: 1 }}>
                <label className={inputs.inputGroup}>
                    <span>Nome</span>
                    <input type="text" onChange={ event => { setBot( { ...bot, name : event.target.value } ) }} value={ bot.name } required/>
                </label>
                <label className={inputs.inputGroup}>
                    <span>Webhook</span>
                    <input type="text" onChange={ event => { setBot( { ...bot, botWebhook : event.target.value } ) }} value={ bot.botWebhook } required/>
                </label>
                <label className={inputs.inputGroup}>
                    <span>Cor</span>
                    <input type="color" onChange={ event => { setBot( { ...bot, color : event.target.value } ) }} value={ bot.color } required/>
                </label>
                <label className={inputs.inputGroup}>
                    <span>Descrição</span>
                    <textarea onChange={ event => { setBot( { ...bot, description : event.target.value } ) } } value={ bot.description }></textarea>
                </label>
            </div>

            <div className={ styles.flexRowToCol }>
                <div className={styles.cardBox} style={{ flex: 1 }}>
                    <label className={inputs.inputGroup}>
                        <span>Título da Mensagem</span>
                        <input type="text" onChange={ event => { setBot( { ...bot, title : event.target.value } ) }} value={bot.title} required/>
                    </label>
                    <label className={inputs.inputGroup}>
                        <span>Template</span>
                        <textarea onChange={onChangeTemplate} value={template.content} className={ template.isValid === false ? inputs.inputInvalid : ''}></textarea>
                    </label>
                    { template.isValid === false && <p className={styles.errorMessage}>{template.error}</p> }
                    <p style={{ marginTop: '1rem' }}>Os templates são baseados em <a href="https://handlebarsjs.com/guide/expressions.html">handlebars</a>. Usando <code>{'{{mustaches}}'}</code> para exibir conteúdo dinâmico.</p>
                </div>
                <div className={styles.cardBox} style={{ flex: 1 }}>
                    <label className={inputs.inputGroup}>
                        <span>Dados de Teste</span>
                        <textarea onChange={onChangeData} value={testData.content} className={ testData.isValid === false ? inputs.inputInvalid : ''}></textarea>
                    </label>
                    { testData.isValid === false && <p className={styles.errorMessage}>{testData.error}</p> }
                    <p style={{ marginTop: '1rem' }}>Os dados dinamicos são baseados em <a href="https://www.json.org/json-en.html">JSON</a>. Você pode validar seu JSON de forma mais completa usando um <a href="https://jsonformatter.curiousconcept.com/">validador</a>.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Pré-visualização</strong>
                        {result.error ? <p className={styles.errorMessage}>{result.error}</p> : <p className={styles.infoMessage}>{result.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

Bot.getInitialProps = async ({ req, query: { botId } }) => {     
    var host = req ? `http://${req.headers.host}` : window.location.origin
    const data = await Axios.get(`${host}/api/bots/${botId}`).then( result => result.data ).catch( err => ({ status: 404, error: { message: "Não encontrado" } }) )
    return { data }
}

export default Bot