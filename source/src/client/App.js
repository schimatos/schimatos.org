import React, { useEffect } from 'react'
import LeftSidebar from './sections/left-sidebar'
import ActiveraulForm from './forms/activeraul-form/activeraul-form'
import {useWindowDimensions} from './utils'
import {AuthProvider, ActiveraulProvider, TargetsProvider, LayoutProvider, TriplestoreProvider, ShaclProvider, HistoryProvider} from './context'
import _ from 'underscore'
import Activeraul from './forms/menus/activeraul'
import Main from './forms/menus/main'
import { useJourney } from 'react-journey';

export default () => {

    return (
        <div className='App' style={{padding : '0px', height : '100%'}}>

        <AuthProvider>
        <LayoutProvider>
        <HistoryProvider>
        <TriplestoreProvider>


            <Main/>

            <ActiveraulProvider>
            <TargetsProvider>

                <ShaclProvider>

                    <LeftSidebar name='test' outside={<ActiveraulForm/>} windowDimensions={useWindowDimensions()}/>

                </ShaclProvider>

                <Activeraul/>

            </TargetsProvider>
            </ActiveraulProvider>


        {/* </Joyride> */}
        </TriplestoreProvider>
        </HistoryProvider>
        </LayoutProvider>
        </AuthProvider>
    </div>
    )
}
