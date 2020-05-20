import React, {useState, useEffect} from 'react'
import {Sidebar, Segment, Transition, Button, Header, Container, Table} from 'semantic-ui-react'
import rightSidebar from '../sections/right-sidebar'

export default ({direction, width, close, panels, visible, header, pushedContent, outside, panel}) => {

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


    

        const {innerWidth, innerHeight} = useWindowDimensions()

        //console.log('windowWidth', innerWidth)

        //console.log('window dimensions', useWindowDimensions())
    
    


    const SidebarComponent = () => {
        function getWindowDimensions2() {
            const { innerWidth, innerHeight } = window;
            return {
                innerWidth,
                innerHeight
            };
          }
    
          function useWindowDimensions2() {
            const [windowDimensions2, setWindowDimensions2] = useState(getWindowDimensions2());
          
            useEffect(() => {
              function handleResize() {
                setWindowDimensions2(getWindowDimensions2());
              }
          
              window.addEventListener('resize', handleResize);
              return () => window.removeEventListener('resize', handleResize);
            }, []);
          
            return windowDimensions2;
          }

        const i2 = useWindowDimensions2().innerWidth
        //console.log(i2)
        
        return (<Sidebar style={{height : '100%', padding : '0px', borderLeft : '0px', borderTop : '0px', borderBottom : '0px', borderRight : '0px'}}
        as={Segment.Group}
        horizontal
        animation={'uncover'}
        children={panel}
        direction={direction}
        visible={visible}
        width={width}/>)}

        // https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

    return (<>
        <Sidebar.Pushable as={Segment} basic style={{padding : '0px', margin : '0px', height : '100%', fixed : 'left'}}>

            <SidebarComponent/>
            <Sidebar.Pusher style={{height : '100%', backgroundColor : '#778899'}}>
                <Segment basic style={{ borderLeft : 'solid grey 0.5px',padding : '0px', backgroundColor : '#778899', width : visible ? `${innerWidth-(474.01)}px` : '100%', align : 'left', height :`${innerHeight-2*42}px`}}>
                {/* {visible && <><CButton/></>} */}

                    <Segment basic style={{height : `${innerHeight-84}px`, overflow : 'auto'}}>

                        {outside}               
                    

                    </Segment>

                

                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable></>
    )


    // //const Head = () => <Header>H</Header>
    // return  (<Sidebar
    //         as={Segment.Group}
    //         horizontal
    //         style={{backgroundColor : 'rgb(0,0,0)', borderColor : 'transparent'}}
    //         animation={'scale down'}
    //         children={<><Children/></>}
    //         direction={direction}
    //         visible={visible}
    //         width={width}/>)
}


// import React from 'react'
// import {Sidebar, Segment, Transition, Button, Header, Container, Grid} from 'semantic-ui-react'

// export default ({direction, width, close, panels, visible, header}) => {

//     //onst newHeader = <Grid><Grid.Column>{header}</Grid.Column><Grid.Column><CButton/></Grid.Column></Grid>

//     const c = (header, children) => (


                

//             <>    <Header as='h3' align='center'>{header}</Header>{children}</>
                    
//                     // <Segment basic><CButton/></Segment>


                   
//     )

//     const CustomTransition = ({visible, children, key, header}) => (
//     <Transition
//     key={key}
//     visible={visible}
//     animation={'fade'}
//     duration={100}
//     //<Segment basic color={'green'}></Segment>}/>
//     children={c(header, children)}/>
//     )
//     const CSegment = () => (
//         <Segment>        
//             {panels.map(([visible, children, header], key) => CustomTransition({visible, children, key, header}))}  
//         </Segment>  
//     )
//     const CButton = () => (
//         <Button
//             icon={`angle ${direction}`}
//             attached={'right'}
//             //floated={'right'}
//             size={'mini'}
//             floated={'right'}
//             fluid
//             //compact
//             onClick={close}/>        
//     )
//     const Children = () => direction === 'left' ? <><CSegment/><CButton/></> : <><CButton/><CSegment/></>
//     //const Head = () => <Header>H</Header>
//     return  (<Sidebar
//             as={Segment.Group}
//             //horizontal
//             horizonal
//             animation={'push'}
//             children={<><Children close={CButton}/></>}
//             direction={direction}
//             visible={visible}
//             width={width}/>)
// }