
import Head from 'next/head'
import Menu from './baseMenu'

import styles from '/styles/Layout.module.scss'

function Layout({children}){
    return <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        </Head>
        <div className={ styles.layout }>
            <Menu />
            <section className={styles.pageContent}>
                { children }
            </section>
        </div>
    </>
}

export default Layout