import {useContext} from 'react'
import {LayoutContext} from '../../../context'

import CustomMenu from '../../fields/custom-menu'

import settings from './tabs/settings'
import help from './tabs/help'
import log from './tabs/log-in'
import { useJourney } from 'react-journey'

export default () => {
    //console.log('at index in main menu')
    const [{warnings, info, selectionsSidebar, creationSidebar}, dispatch] = useContext(LayoutContext)
    const { run, stop } = useJourney();
    // useEffect(() => {
    //     run();
    //     return stop;
    //   }, []);

    const left = [
    {
      icon : 'bars',
      popup : 'Selections Bar',
      activated : selectionsSidebar,
      onClick : () => dispatch({type : 'TOGGLE', panel : 'selectionsSidebar'})
    }, {
      text: 'Take the tour!',
      onClick: run
    }]

    const right = [help(), settings(), log(), {
      image : '../schimatos/favicon.ico',
      popup : 'ANU Homepage',
      link : 'https://www.anu.edu.au/'
    }]    

    return CustomMenu({
        className : 'ui menu', fixed : 'top', warnings, popups : info, hiding : true,
        icons : {left, right}
    })
}