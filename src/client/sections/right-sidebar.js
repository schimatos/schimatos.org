import React, {useContext} from 'react';
import ShaclUpload from '../forms/shacl-upload'
import {LayoutContext} from '../context'
import Sidebar from '../components/sidebar'

export default () => {
    const [{creationSidebar},dispatch] = useContext(LayoutContext)

    return  (<Sidebar
            direction={'right'}
            width={'very wide'}
            visible={creationSidebar}
            close={() => dispatch({type : 'TOGGLE', panel : 'creationSidebar'})}
            panels={[[true, <ShaclUpload />]]}/>)
}