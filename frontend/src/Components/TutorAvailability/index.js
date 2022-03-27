import styled from 'styled-components'
import * as Table from '../Table'
import Checkbox from '../Checkbox'
import Button from '../Button'
import { useState, useEffect } from 'react'
import useWindowSize from '../../Hooks/UseWindowSize'

const StyledTable = styled(Table.Table)`
   
    & td > div > div {
        margin: 16px auto;
    }

    & thead > *:nth-of-type(1) {
        width: 96px;

        ${props => props.compact ? `
            width: 64px;
            max-width: 64px !important;
        ` : ''}
    }

    ${props => props.compact ? `
        & * {
            font-size: 14px !important;
        }

        & th {
            padding: 8px;
        }

        & td {
            padding 0 6px;
        }

        & th, & td {
            text-align: center;
            
        }
    ` : ''}

    ${props => props.readonly ? `
        & td > div, & td > div > div {
            cursor: unset !important;
        }
    ` : ''}
`

const Row = styled.div`
    display: flex;
    margin-top: 16px;
    justify-content: space-between;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 730px) {
        & .label-th {

        }

        & .availability-table {
            & th {
                padding: 16px 4px;
            }
            
            & td {
                padding: 0 4px;
                
                & .box {
                    margin: 0 auto;
                }
            }
        }

        tbody tr > td:first-of-type {
            max-width: 72px !important;
            width: 0;
            padding: 0 0;
            font-size: 12px;
        }

        tbody tr > td {
            padding: 0 2px;
            max-width: 0 !important;
        }

        thead th {
            padding: 16px 0;
            max-width: 0 !important;
        }

        thead th:first-of-type {
            width: 0;
        }
    }
`

/**
 * Table to display/edit a tutors availability
 * 
 * @param availability      Array[Object]   {morning: [bool x 7], afternoon: [bool x 7], evening: [bool x 7]}
 * @param setAvailability   Function        Setter for the availability array
 * @param readonly          Boolean         If set the contents can not be edited
 * @param compact           Boolean         If present reduces paddings
 * @example 
 *  const [availability, setAvailability] = useState({
 *      morning: [false, false, false, false, false, false, false],
 *      afternoon: [false, false, false, false, false, false, false],
 *      evening: [false, false, false, false, false, false, false],
 *  })
 *  
 *  ...
 * 
 *  <TutorAvailability availability={availability} setAvailability={setAvailability} />
 */
function TutorAvailability({ availability, setAvailability, compact, readonly }) {
   
    const windowSize = useWindowSize()

    const updateAvailability = (timeslot, index, value) => {

        const a = {...availability}
        a[timeslot][index] = value

        setAvailability(a)
    }

    const selectAll = () => {
        setAvailability({
            morning: [true, true, true, true, true, true, true],
            afternoon: [true, true, true, true, true, true, true],
            evening: [true, true, true, true, true, true, true]
        })
    }

    const unselectAll = () => {
        setAvailability({
            morning: [false, false, false, false, false, false, false],
            afternoon: [false, false, false, false, false, false, false],
            evening: [false, false, false, false, false, false, false]
        })
    }

    return <Col>
    <StyledTable noClip compact={compact} readonly={readonly} grey={!!compact} borderCollapse={!!compact} zebra={!!compact} className="availability-table">
        <Table.Head>
            <Table.Row>
                <Table.Heading className="label-th"></Table.Heading>
                <Table.Heading centered>Mo{!compact && windowSize.width > 480 ? 'n' : null}</Table.Heading>
                <Table.Heading centered>Tu{!compact && windowSize.width > 480 ? 'e' : null}</Table.Heading>
                <Table.Heading centered>We{!compact && windowSize.width > 480 ? 'd' : null}</Table.Heading>
                <Table.Heading centered>Th{!compact && windowSize.width > 480 ? 'u' : null}</Table.Heading>
                <Table.Heading centered>Fr{!compact && windowSize.width > 480 ? 'i' : null}</Table.Heading>
                <Table.Heading centered>Sa{!compact && windowSize.width > 480 ? 't' : null}</Table.Heading>
                <Table.Heading centered>Su{!compact && windowSize.width > 480 ? 'n' : null}</Table.Heading>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                <Table.Row>
                    <Table.Col style={windowSize.width < 390 ? {fontSize: '12px'} : {}}>{!compact && windowSize.width > 480 ? <><b>Morning</b><br /></> : null}Pre 12PM</Table.Col>
                    <Table.Col centered><Checkbox value={availability.morning[0]} setter={v => updateAvailability('morning', 0, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[1]} setter={v => updateAvailability('morning', 1, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[2]} setter={v => updateAvailability('morning', 2, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[3]} setter={v => updateAvailability('morning', 3, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[4]} setter={v => updateAvailability('morning', 4, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[5]} setter={v => updateAvailability('morning', 5, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.morning[6]} setter={v => updateAvailability('morning', 6, v)}  /></Table.Col>
                </Table.Row>

                <Table.Row>
                    <Table.Col style={windowSize.width < 390 ? {fontSize: '12px'} : {}}>{!compact && windowSize.width > 480 ? <><b>Afternoon</b><br /></> : null}12-5 PM</Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[0]} setter={v => updateAvailability('afternoon', 0, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[1]} setter={v => updateAvailability('afternoon', 1, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[2]} setter={v => updateAvailability('afternoon', 2, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[3]} setter={v => updateAvailability('afternoon', 3, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[4]} setter={v => updateAvailability('afternoon', 4, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[5]} setter={v => updateAvailability('afternoon', 5, v)} /></Table.Col>
                    <Table.Col><Checkbox value={availability.afternoon[6]} setter={v => updateAvailability('afternoon', 6, v)} /></Table.Col>
                </Table.Row>
                
                <Table.Row>
                    <Table.Col style={windowSize.width < 390 ? {fontSize: '12px'} : {}}>{!compact && windowSize.width > 480 ? <><b>Evening</b><br /></> : null}After 5PM</Table.Col>
                    <Table.Col><Checkbox value={availability.evening[0]} setter={v => updateAvailability('evening', 0, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[1]} setter={v => updateAvailability('evening', 1, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[2]} setter={v => updateAvailability('evening', 2, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[3]} setter={v => updateAvailability('evening', 3, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[4]} setter={v => updateAvailability('evening', 4, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[5]} setter={v => updateAvailability('evening', 5, v)}  /></Table.Col>
                    <Table.Col><Checkbox value={availability.evening[6]} setter={v => updateAvailability('evening', 6, v)}  /></Table.Col>
                </Table.Row>
            </Table.Body>
    </StyledTable>

    {!readonly ? 
        <Row>
            <Button outline onClick={unselectAll}>Unselect All</Button>
            <Button outline onClick={selectAll}>Select All</Button>
        </Row>
    : null}

    </Col>
}

export default TutorAvailability
