import React from 'react'
import LeftSidebar from './sections/left-sidebar'
import ActiveraulForm from './forms/activeraul-form/activeraul-form'
import {useWindowDimensions} from './utils'
import {AuthProvider, ActiveraulProvider, TargetsProvider, LayoutProvider, TriplestoreProvider, ShaclProvider, HistoryProvider} from './context'
import _ from 'underscore'
import Activeraul from './forms/menus/activeraul'
import Main from './forms/menus/main'

export default () => (
    <div className='App' style={{padding : '0px', height : '100%'}}>
        <AuthProvider>
        <LayoutProvider>
        <HistoryProvider>
        <TriplestoreProvider>

            <Main/>

            <ActiveraulProvider>
            <TargetsProvider>

                <ShaclProvider>

                    <LeftSidebar outside={<ActiveraulForm/>} windowDimensions={useWindowDimensions()}/>

                </ShaclProvider>

                <Activeraul/>

            </TargetsProvider>
            </ActiveraulProvider>
        </TriplestoreProvider>
        </HistoryProvider>
        </LayoutProvider>
        </AuthProvider>
    </div>
)