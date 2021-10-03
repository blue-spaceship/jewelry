import styles from '/styles/Layout.module.scss'
import Axios from 'axios'
import Link from 'next/link'

const Bots = ({ bots }) => {
    return (
        <section className={styles.container}>
            <div className="list">
                <div className="add-item">
                    <Link href="/bots/new"><a>Adicionar novo webhook</a></Link>
                </div>
                { bots.map( bot => (
                    <div key={bot._id} className="list-item">
                        <Link href={`/bots/${bot._id}`}><a>{bot.name}</a></Link>
                        <p>{ bot.description }</p>
                        <footer>webhook { bot.isActive ? "ativo" : "inativo" }</footer>
                    </div>
                ) ) }
            </div>

            <style jsx >{`
                .list{
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .add-item{
                    display: flex;
                    padding: 1rem;
                }

                .list-item {
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                    border: 1px solid rgba( var( --text-main ), 0.05 )
                }

                .list-item footer{
                    color: rgba( var( --text-main ), 0.3 )
                }
            `}</style>
        </section>
    )
}

Bots.getInitialProps = async ({ req }) => {    
    var host = req ? `http://${req.headers.host}` : window.location.origin
    const bots = await Axios.get(`${host}/api/bots`).then( result => result.data ).catch( err => [] )
    return { bots }
}

export default Bots