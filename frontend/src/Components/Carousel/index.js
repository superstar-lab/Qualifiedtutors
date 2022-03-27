import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import { useState } from 'react'
import zIndex from '../../Config/zIndex.js'

const Container = styled.div`
    width: 100%;
    display: flex;

    & > img {
        cursor: pointer;
        
        &:first-of-type {
            margin-right: 16px;
        }

        &:last-of-type {
            
        }
    }
`

const Slides = styled.div` 
   width: calc(100% - 95.66px);
   flex-shrink: 0;
   position: relative;
   overflow: hidden;
   padding: 0 16px;
`

const Slide = styled.div`
    width: 100%;
    position: absolute;
    left: calc(100% * ${props => props.index - props.offset});
    top: 0;
    transition: left .25s;
`

const Dots = styled.div`
    position: absolute;
    bottom:  -8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    z-index: ${zIndex.top};
`

const Dot = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${Colours.n800};
    cursor: pointer;
    transition: background .25s;

    ${props => props.active ? `
        background: ${Colours.b500};
    ` : ''}
`

/**
 * Carousel
 * 
 * Shows one of several children and allows users to slide between them.
 * 
 * @param children      Collection  The slides to be shown.  
 * @param noDots        Boolean     If present the navigation dots will be omitted
 * @param initialOffset Integer     If present sets the first slide to show
 * 
 * @example
 *  <Carousel>
 *      <div>
 *          <h1>Slide 1</h1>
 *          <p>Slide contents</p>
 *      </div>
 * 
 *      <div>
 *          <h1>Slide 2</h1>
 *          <p>Slide contents</p>
 *      </div>
 *  </Carousel>
 */
function Carousel(props) {
   
    const [offset, setOffset] = useState(props.initialOffset !== undefined ? props.initialOffset : 0)

    return <Container {...props}>
        <img 
            alt="previous slide"
            src="/img/left_arrow.svg" 
            onClick={e => setOffset(offset - 1 >= 0 ? offset - 1 : props.children.length - 1)} 
        />

        <Slides>
            {/* Placed in the DOM to account for slides not being placed in document flow */}
            <Slide index={-1} style={{opacity: 0, position: 'relative'}}>{props.children[0]}</Slide>
            {props.children.map((child, index) => <Slide key={index} index={index} offset={offset}>{child}</Slide>)}
        </Slides>

        {!props.noDots ? 
            <Dots>
                {props.children.map((child, index) => <Dot key={index} active={offset == index} onClick={e => setOffset(index)} />)}
            </Dots>
        : null}
        

        <img 
            alt="next slide"
            src="/img/left_arrow.svg" 
            style={{transform: 'rotate(180deg)'}} 
            onClick={e => setOffset(offset + 1 < props.children.length ? offset + 1 : 0)} 
        />
    </Container>
}

export default Carousel
