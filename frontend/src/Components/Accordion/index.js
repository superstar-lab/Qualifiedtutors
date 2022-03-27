import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import { useEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

const Container = styled.ul`
    padding: 0;
    margin: 0;
    list-style-type: none;
    font-size: 18px;

    & div {
        padding: 22px 16px;
        border-bottom: 1px solid rgba(0,0,0,.33);
        cursor: pointer;
        display: block;
    }

    & > li div {
        &:hover {
            background: ${Colours.b025};
            font-weight: bold;
        }
    }

    & li li > div {
        background: ${Colours.b025};
    }

    & li.current > div {
        background: ${Colours.b025};
        font-weight: bold;
        position: relative;

        &:after {
            position: absolute;
            content: "";
            right: 6px;
            top: 20px;
            height: 24px;
            width: 12px;
            background: url('/img/left_arrow.svg');
            background-size: contain;
            transform: rotate(180deg);
        }
    }

    & > li > div {
        position: relative;
        user-select: none;

        &:after {
            position: absolute;
            right: 16px;
            top: 50%;
            width: 16px;
            height: 8px;
            display: block;
            content: "";
            background: url('/img/chevron.webp') no-repeat center center;
            background-size: contain;
            transform: translateY(-50%);
        }
    }

    & > li[data-to] > div {
        &:after {
            display: none;
        }
    }

    & > li[data-to].active > div {
        background: ${Colours.b500} !important;
        color: white !important;

        &:before {
            position: absolute;
            content: "";
            right: 6px;
            top: 20px;
            height: 24px;
            width: 12px;
            background: url('/img/left_arrow_white.svg');
            background-size: contain;
            transform: rotate(180deg);
        }
    }

    & > li.active > div {
        &:after {
            background: url('/img/chevron_white.webp') no-repeat center center;
            background-size: contain;
        }
    }

    & > li.expanded > div {
        &:after { 
            transform: translateY(-50%) rotate(180deg);
        }
    }

    & ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    & li ul li div {
        padding-left: 32px;
        user-select: none;
    }

    & ul {
        height: 0;
        overflow: hidden;
    }

    & li.active > div:first-of-type {
        background: ${Colours.b500};
        color: white;
        font-weight: bold;
    }

    & li.expanded ul {
        height: auto;
    }
`
/**
 * Accordion
 * 
 * Renders a menu wherein top level elements can hide child menu items
 * 
 * @param children  Collection   Children of the element are used as entries in the menu and may optionally have their own embedded list of menu items. 
 *                               Menu items must take the form of an element wrapped in a list item (<li><div>Menu item</div></li>).
 *                               Menu items that include the data-to attribute will redirect on click.
 * @example 
 *  <Accordion>
 *      <li data-to="/destination"><div>Standalone top-level menu item</div></li>
 *      <li><div>Menu item with children</div>
 *          <ul>
 *              <li data-to="/another-destination"><div>Child menu item</div></li>
 *          </ul>
 *      </li>
 *  </Accordion>
 */
function Accordion(props) {

    const containerRef = useRef()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if (!containerRef.current) { return }

        const clickChild = event => { 
            event.stopPropagation()

            const child = event.target.closest('li')

            if(child.dataset.to) {
                history.push(child.dataset.to)
                for(const item of containerRef.current.querySelectorAll('.active')) {
                    if (!item.classList.contains('expanded')) {
                        item.classList.remove('active')
                    }
                }
            }
        }

        const clickParent = event => {
            const li = event.target.closest('li')

            for(const item of containerRef.current.querySelectorAll('.active')) {
                item.classList.remove('active')
            }

            for(const item of containerRef.current.querySelectorAll('.expanded')) {
                item.classList.remove('expanded')
            }

            if (li.dataset.to) {
                history.push(li.dataset.to)
                for(const item of containerRef.current.querySelectorAll('.active')) {
                    if (!item.classList.contains('expanded')) {
                        item.classList.remove('active')
                    }
                }
            } else {
                li.classList.toggle('expanded')
                for(const item of containerRef.current.querySelectorAll('.active')) {
                    if (!item.classList.contains('expanded')) {
                        item.classList.remove('active')
                    }
                }
            }

            
            
            if (
                (!li.dataset.to && li.classList.contains('expanded')) ||
                li.dataset.to
            ) {
                if (li.dataset.to) {
                    const lis = containerRef.current.querySelectorAll('li')
                    for(const currentLi of lis) {
                        if (currentLi.dataset.to !== undefined && currentLi.classList.contains('active')) {
                            currentLi.classList.remove('active')
                        }
                    }
                }
                li.classList.add('active')                
            }

            if (!li.dataset.to && !li.classList.contains('expanded')) {
                li.classList.remove('active')                
            }
        }

        for (const li of containerRef.current.children) {
            if (li.tagName != "LI") { continue; }

            li.addEventListener('click', clickParent)
            
            const ul = li.querySelector('ul')
            if (ul) {
                for (const child of ul.children) {
                    child.addEventListener('click', clickChild)
                }
            }
        }

        return () => {
            for (const li of containerRef.current.children) {
                if (li.tagName != "LI") { continue; }

                li.removeEventListener('click', clickParent)
                const ul = li.querySelector('ul')
                if (ul) {
                    for (const child of ul.children) {
                        child.removeEventListener('click', clickChild)
                    }
                }
            }
        }
    }, [containerRef.current])

    useEffect(() => {
        if (!containerRef.current) { return; } 

        for(const li of containerRef.current.children) {
            if (li.tagName != "LI") { continue; }

            const ul = li.querySelector('ul')
            if (ul) {
                for(const child of ul.children) {
                    if (location.pathname.startsWith(child.dataset.to)) {
                        /*
                        for(const node of containerRef.current.querySelectorAll('li.active')) {
                            node.classList.remove('active')
                        }
                        */
                        for (const node of containerRef.current.querySelectorAll('li.current')) {
                            node.classList.remove('current')
                        }
                        li.classList.add('active')
                        child.classList.add('current')
                    }
                }
            }
        }

        for(const li of containerRef.current.children) {
            if (li.dataset.to == location.pathname) {
                const active = containerRef.current.querySelector('li.active')
                const current = containerRef.current.querySelector('li.current')

                if (active) { active.classList.remove('active') }
                if (current) { current.classList.remove('current') }

                li.classList.add('active')
            }
        }

        /*
        const active = containerRef.current.querySelector('li.active')
        if (active) {
            active.classList.add('expanded')
        }
        */
    }, [location, containerRef.current])

    return <Container ref={containerRef}>
        {props.children}
    </Container>
}

export default Accordion
