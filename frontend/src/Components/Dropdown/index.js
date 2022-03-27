import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import { useState, useEffect } from 'react'
import zIndex from '../../Config/zIndex.js'
import ClearButton from '../ClearButton/index.js'

const Container = styled.div`
    position: relative;
    z-index: ${props => zIndex.dropdown - (props.open ? 0 : 1)};
`

const ClickCatcher = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: ${zIndex.dropdown - 1};

    display: ${props => props.visible ? 'block' : 'none'};
`

const Header = styled.div`
    border: 1px solid ${props => props.active ? Colours.b300 : (props.valid ? Colours.g500 : Colours.n300)};
    border-radius: 4px;
    height: 32px;
    padding: 6px 40px 6px 16px;
    line-height: 34px;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: white;
    z-index: ${zIndex.dropdown};
    transition: border-color .25s;

    color: ${Colours.n200};
    font-size: 16px;

    &:hover {
        border: 1px solid ${Colours.b500};
    }

    &.chromeless {
        border: unset;
        background: unset;
        overflow: unset;

        &:hover {
            border: unset;
        }
    }

    ${props => !props.noChevron ? `
        &:after {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 8px;
            display: block;
            content: "";
            background: url('/img/chevron.webp') no-repeat center center;
            background-size: contain;
        }

        &.chevronLeft:after {
            left: -8px;
            right: unset;
        }
    ` : ''}
`

const List = styled.div`
    position: absolute;
    box-sizing: border-box;
    top: 39px;
    height: 0;
    width: 100%;
    overflow: hidden;
    overflow-y: ${props => props.listHeight ? 'hidden' : 'scroll'};
    transition: height .1s;
    background: white;
    border-left: 1px solid ${Colours.n300};
    border-right: 1px solid ${Colours.n300};
    border-bottom: ${props => !props.visible ? '0' : `1px solid ${Colours.n300}`};
    border-radius: 4px;
    z-index: ${zIndex.top};

    ${props => props.visible ? `
        height: ${props.listHeight ? props.listHeight : '256px'};
    ` : ''};

    ${props => props.hasLabel ? `
        top: 72px;
    ` : ''}
`

const Item = styled.div`
    padding: 12px 0 12px 16px;   
    cursor: pointer;
    border-bottom: 1px solid ${Colours.n300};

    color: ${Colours.n200};
        font-size: 16px;

    &:hover {
        background: rgba(0,0,0,.033);
    }
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;

    & > span {
        font-weight: normal;
        color: ${Colours.n500};
        opacity: .6;
    }
`

const Input = styled.input`
    position: relative;
    cursor: pointer;
    border: 0;
    font-size: 16px;
    left: -16px;
    top: -3px;
    padding-left: 16px;
    width: calc(100% + 28px);
    height: calc(100% + 5.6px);
    color: ${Colours.n200};

    &::placeholder {
        color: ${Colours.n200};
    }

    &:focus {
        outline: none;
    }
`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: 8px;
`

const Clear = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    width: 21px;
    height: 20px;
    background: url('/img/close_blue.webp');
    cursor: pointer;
    opacity: .5;

    &:hover {
        opacity: 1;
    }

    ${props => props.chevron ? `
        right: 36px;
    ` : ''}
`

/**
 * Dropdown list component
 * 
 * Renders a dropdown list using the children of the component as the elements of the list.
 * 
 * @param label          String                       If present renders a label above the dropdown
 * @param optionalLabel  Boolean                      If present renders "(optional)" in a light gray font after the regular label
 * @param editable       Boolean                      If present the header element is rendered as an input and users can manually enter new values not present in the list
 * @param active         Boolean                      If present outlines the element in blue
 * @param chromeless     Boolean                      If present omits the outline and background from the header element
 * @param prefix         Renderable                   If present renders this additional element before the selected item in the header element
 * @param chevronLeft    Boolean                      If present renders the chevron on the left instead of the right
 * @param placeholder    Renderable                   If present it will be rendered in the header while there is no selected item
 * @param component      Renderable                   If present this will be rendered in the dropdown instead of a list of items
 * @param error          String                       If present it will be rendered below the header as an error message
 * @param containerClass String                       If present supplied to the container element
 * @param listClass      String                       If present supplied to the list element
 * @param listStyle      Object                       If present supplied to the list element
 * @param onChange       Function(value, node, index) Called when user selects a value from the dropdown list
 * @param valid          Boolean                      If present outlines the header in green
 * @param noChevron      Boolean                      If present supresses the chevron
 * @param clearable      Boolean                      If present a X button will be present to clear the selected value
 * @param clearCallback  Function()                   Optional callback fired when users clear the selected value
 * @returns 
 */
function Dropdown(props) {
    
    const [listVisible, setListVisible] = useState(false)
    const [children, setChildren] = useState([])
    const [filteredChildren, setFilteredChildren] = useState(null)

    useEffect(() => {
        setChildren(props.children && props.children.map ? props.children : [props.children])
    }, [props.children])

    const dismiss = event => {
        if (!listVisible) { return }

        setListVisible(false)

        // On the next tick of the event loop (after the clickcatcher has been removed)
        // simulate a click on whatever the user is hovering over.
        // setImmediate can also be used for this, but fewer browsers support it
        setTimeout(() => {
            document.elementFromPoint(event.clientX, event.clientY).click()
        }, 0)
    }

    const onChange = (value, node, index) => {
        props.onChange && props.onChange(value, node, index)
        if (props.editable) {
            filterResults(value)
        } else {
            listVisible && setListVisible(false)
        }
    }

    const filterResults = (value) => {

        if (props.nosearch) { return }

        setFilteredChildren(children.reduce((results, child) => {
            if (child.props.children.toLowerCase().includes(value !== undefined ? value.toLowerCase() : props.selected.toLowerCase())) {
                results.push(child)
            }

            return results
        }, []))
    }

    const clearValue = event => {
        event.stopPropagation()

        props.onChange && props.onChange("")
        props.clearCallback && props.clearCallback()
    }

    return (<>
        <Container {...props} open={listVisible} className={'dropdown ' + (props.containerClass ? props.containerClass : '')}>
            {props.label ? <Label>{props.label} {props.optionalLabel ? <span>(optional)</span> : null}</Label> : null}
            <Header active={props.active} valid={props.valid} noChevron={props.noChevron} className={(props.className ? props.className : '') + (props.chromeless ? ' chromeless' : '') + (props.chevronLeft ? ' chevronLeft' : '')}  onClick={e => setListVisible(!listVisible)}>
                {props.prefix ? props.prefix + ' ' : ''} 
                {props.selected && !props.editable ? props.selected : (
                    props.editable ? <Input 
                        value={props.selected} 
                        onChange={event => { event.stopPropagation(); onChange(event.target.value) }} 
                        placeholder={props.placeholder} 
                        onFocus={e => { setListVisible(true); }} 
                        onClick={e => e.stopPropagation()}
                        onBlur={e => { 
                            setListVisible(false)
                        }} 
                    /> : props.placeholder  
                )}
                {props.clearable && props.selected ? <ClearButton onClick={clearValue} style={{position: 'absolute', right: props.noChevron ? '6px' : '32px', top: '50%', transform: 'translateY(-50%)'}} /> : null}
            </Header>
            {props.error ? <Error>{props.error}</Error> : null}

            <List className={`dropdown-list ${props.listClass ? props.listClass : ''}`} visible={listVisible} hasLabel={!!props.label} style={props.listStyle ? props.listStyle : {}} listHeight={props.listHeight ? props.listHeight : null}>
                {props.component ? {...props.component, props: {...props.component.props, onAccept: () => setListVisible(false)}} : 
                    (filteredChildren !== null ? filteredChildren : children).map((c, i) => <Item key={i} onMouseDown={e => {
                        setListVisible(false)
                        onChange(c.props.children, c, i)
                        setFilteredChildren(null)
                    }}>{c}</Item>)
                }
            </List>
        </Container>
        
        <ClickCatcher visible={listVisible} onClick={dismiss} />
    </>)
}

export default Dropdown
