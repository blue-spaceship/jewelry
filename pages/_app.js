import Layout from '/layouts/base'
import '../styles/globals.scss'

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}