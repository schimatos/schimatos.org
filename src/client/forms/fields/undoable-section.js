import React, {useReducer, useState, useEffect} from 'react'
import {Grid, Button, Divider, Icon, Segment, Menu, Sticky} from 'semantic-ui-react'

import {keepCloning} from '../../utils'

export default ({title, initialState, reducer, content}) => {

    const histReducer = ([hist, no], a) => {
        switch (a.type) {
            case 'GO_FORWARD':
                return [hist, no - 1]
            case 'GO_BACK':
                return [hist, no + 1]
            default:
                const newHistory = (no > 1) ? (
                    hist.filter((x, i) => i + no - 1  < hist.length) 
                ) : hist
                // Error with occasional 2 copies of state occuring
                const newState = reducer(newHistory[newHistory.length-1], a)
                return newState ? [[...newHistory, keepCloning(newState)], 1] : [[...newHistory], 1]
        }
    }
    
    const [[history, histno], dispatch] = useReducer(histReducer, [[keepCloning(initialState)], 1])
    const state = history[history.length - histno]
    const quickDispatch = type => dispatch({type})
    const valDispatch = type => value => dispatch({type, value})

    function getWindowDimensions() {
        const { innerWidth, innerHeight } = window;
        return {
            innerWidth,
            innerHeight
        };
      }

      function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
      
        useEffect(() => {
          function handleResize() {
            setWindowDimensions(getWindowDimensions());
          }
      
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);
      
        return windowDimensions;
      }
    const {innerHeight} = useWindowDimensions()
    return (
        <>
        
        <Sticky>
            
        <Menu fluid floated fixed={'top'} style={{backgroundColor : '#69696969', margin : '0px', padding : '0px'}} compact>
            <Menu.Menu position={'left'}>
                <Menu.Item disabled={history.length  < histno + 1} onClick={() => quickDispatch('GO_BACK')} icon='undo'/>
            </Menu.Menu>
            <Menu.Menu style={{ textAlign:'center', verticalAlign:'middle', horizonalAlign : 'center'}}>
                <Menu.Item fitted style={{width:'150px', margin:'0px', textAlign:'center', verticalAlign:'middle', horizonalAlign : 'center'}}><div style={{paddingLeft : '105px', width:'150px', margin:'auto', textAlign:'center', verticalAlign:'middle', horizonalAlign : 'center'}}>

                    {title}
                    </div></Menu.Item>
            </Menu.Menu>
            

            <Menu.Menu position={'right'}>
                <Menu.Item disabled={histno === 1} onClick={() => quickDispatch('GO_FORWARD')} icon='redo'/>
            </Menu.Menu>
        </Menu>

        </Sticky>
        <Segment basic style={{backgroundColor : '#757575', marginTop : '42px', overflow : 'auto', height : `${innerHeight - 3*42}px`}}>
        <Segment basic style={{backgroundColor : '#757575', marginLeft : '0px', marginRight : '0px', marginTop : '0px', padding : '0px'}}><div style={{padding : '0px', marginLeft : '0px', marginRight : '0px'}}>{content(state, dispatch, valDispatch)}</div></Segment>
        </Segment>
        </>
    )
}