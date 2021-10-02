import React, { Component, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import { signOut } from 'next-auth/client'
// import ACM from '/middleware/acm'

import styles from '/styles/Menu.module.scss'

const MenuMap = [
    { id: "home", path: "/", visible: true, label: "Home" },
    { id: "bots", path: "/bots", visible: true, label: "Bots" }
]

class Menu extends Component{
    constructor(props) {
      super(props);
      this.state = { isClosed: true }
      this.menuToogle = this.menuToogle.bind(this)
    }

    menuToogle(e){
        this.setState( { isClosed : !this.state.isClosed } )
    }

    render(){
        return (
            <aside className={ styles.container }>
                <menu>
                    { MenuMap.map( (item) => { return item.visible ? <MenuLink key={item.id} item={item} /> : <></> } ) }
                </menu>
            </aside>
        )
    }
}

function MenuLink({ item }){
    const { asPath } = useRouter()
    const active = asPath === item.path

    return (
        <Link href={ item.path }><a>{item.label}</a></Link>
    )
}

export default function menuBar () {
    return <Menu />
}