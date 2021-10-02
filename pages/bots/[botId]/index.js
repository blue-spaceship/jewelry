import { useEffect, useState } from 'react'
import Handlebars from 'handlebars/dist/cjs/handlebars'
import Head from 'next/head'

import styles from '/styles/Layout.module.scss'
import inputs from '/styles/Input.module.scss'

export default function Home() {
    const [template, setTemplate] = useState({ content: 'Hello {{ name }}!', isValid: true })
    const [data, setData] = useState({ content: '{"name":"World"}', isValid: true })
    const [result, setResult] = useState('')

    useEffect(() => {
        try {
            const jsonData = data.isValid ? JSON.parse(data.content) : {}
            const toParse = Handlebars.compile(template.content)
            const toShow = toParse(jsonData)
            setResult({ message: toShow })
        } catch (error) {
            setResult({ error: JSON.stringify("error") })
        }
    }, [template, data])

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
            setData({ content: event.target.value, isValid: true })
        } catch (error) {
            setData({ content: event.target.value, isValid: false, error: "Dados de testes em formato inválido." })
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Jewelry</title>
                <meta name="description" content="A box of jews!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={ styles.flexRowToCol }>
                <div className={styles.cardBox} style={{ flex: 1 }}>
                    <label className={inputs.inputGroup}>
                        <span>Template</span>
                        <textarea onChange={onChangeTemplate} value={template.content} className={(!template.isValid) ? inputs.inputInvalid : ''}></textarea>
                    </label>
                    { (!template.isValid) && <p className={styles.errorMessage}>{template.error}</p> }
                    <p style={{ marginTop: '1rem' }}>Os templates são baseados em <a href="https://handlebarsjs.com/guide/expressions.html">handlebars</a>. Usando <code>{'{{mustaches}}'}</code> para exibir conteúdo dinâmico.</p>
                </div>
                <div className={styles.cardBox}>
                    <label className={inputs.inputGroup}>
                        <span>Dados de Teste</span>
                        <textarea onChange={onChangeData} value={data.content} className={(!data.isValid) ? inputs.inputInvalid : ''}></textarea>
                    </label>
                    { (!data.isValid) && <p className={styles.errorMessage}>{data.error}</p> }
                    <p style={{ marginTop: '1rem' }}>Os dados dinamicos são baseados em <a href="https://www.json.org/json-en.html">JSON</a>. Você pode validar seu JSON de forma mais completa usando um <a href="https://jsonformatter.curiousconcept.com/">validador</a>.</p>
                </div>
            </div>
            
            <div className={styles.cardBox} style={{ flex: 1 }}>
                <strong>Pré-visualização</strong>
                {result.error ? <p className={styles.errorMessage}>{result.error}</p> : <p className={styles.infoMessage}>{result.message}</p>}
            </div>
        </div>
    )
}
