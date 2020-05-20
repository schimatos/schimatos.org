import {useContext} from 'react'
import {LayoutContext} from '../../../context'

import CustomMenu from '../../fields/custom-menu'

import settings from './tabs/settings'
import help from './tabs/help'
import log from './tabs/log-in'

export default () => {
    console.log('at index in main menu')
    const [{warnings, info, selectionsSidebar, creationSidebar}, dispatch] = useContext(LayoutContext)
       

    const left = [
    {
      icon : 'bars',
      popup : 'Selections Bar',
      activated : selectionsSidebar,
      onClick : () => dispatch({type : 'TOGGLE', panel : 'selectionsSidebar'})
    }]

    const right = [help(), settings(), log(), {
      image : './public/favicon.ico',
      popup : 'ANU Homepage',
      link : 'https://www.anu.edu.au/'
    }]    

    return CustomMenu({
        className : 'ui menu', fixed : 'top', warnings, popups : info, hiding : true,
        icons : {left, right}
    })
}