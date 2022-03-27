import styled from 'styled-components'
import {Helmet} from "react-helmet"
import {
    FixedWidth,
    Dropdown,
    Input,
    Checkbox,
    Card,
    Circle,
    RingLoader,
    Button,
    Toast,
    API
} from '../../Components'
import TutorSummary from '../User/Profile/Components/TutorSummary'
import InputRange from 'react-input-range'
import Colours from '../../Config/Colours.js'
import useDebounce from '../../Hooks/UseDebounce'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import 'react-input-range/lib/css/index.css'
import AvailabilitySelector from './Components/AvailabilitySelector'
import zIndex from '../../Config/zIndex'
import useWindowSize from '../../Hooks/UseWindowSize'
import SubjectContext from '../../SubjectContext'

const Container = styled.div`

    margin-bottom: 48px;

    & .fixedWidth {
        padding: 0 64px;
    }

    & .searchInput {
        z-index: ${zIndex.top};
        color: ${Colours.n250};

        &::placeholder {
            color: ${Colours.n250};
        }
    }

    & .inputPostcode {
        font-size: 16px;
        color: ${Colours.n200};

        &::placeholder {
            font-size: 16px;
            color: ${Colours.n200};
        }
    }

    & .levelInput {
        z-index: ${zIndex.top - 1};
        height: 31px;
        flex: 1;

        & > div:first-of-type {
            height: calc(100% + 5.6px);
        }
    }

    & .dropdownAvailability {
        z-index: ${zIndex.top - 2};
    }

    & .searchDropdown > input {
        color: ${Colours.n250};
        font-size: 18px;

        &::placeholder {
            color: ${Colours.n250};
            font-size: 18px;
        }
    }

    & .filters {
        padding: 36px 32px;
        
        margin-bottom: 38px;
        margin-top: 38px;

        h2 {
            font-weight: bold;
            font-size: 26px;
            line-height: 40px;
            color: ${Colours.n200};
            margin: 0;
            padding-bottom: 23px;

            & img {
                margin-right: 16px;
            }
        }

        & .input-range__track--background {
            background: ${Colours.n300};
            height: 8px;
        }

        & .input-range__track--active {
            background: ${Colours.b500};
            height: 8px;
        }

        & .input-range__slider {
            background: white;
            border: .5px solid ${Colours.b500};
            box-shadow: 0px 0px 1px rgb(48 49 51 / 5%), 0px 4px 8px rgb(48 49 51 / 10%);
            height: 20px;
            width: 20px;
            margin-top: -15px;
        }

        & .input-range__label, & .input-range__label--value {
            display: none;
        }

        & b {
            font-size: 18px;
            margin-bottom: 14px;
            color: ${Colours.n200};
        }

        & .opts {
            gap: 8px;
            margin-bottom: 40px;
            

            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    & .results {
        position: relative;
        flex: 1;
        margin-left: 36px;
        gap: 32px;
        margin-top: 38px;
    }

    & .searchDropdown {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 36px;
        flex: 1;
    }

    & .sortBy {
        
        max-width: 200px;
        margin-right: 8px;

        & > div:first-of-type {
            font-size: 14px;
            padding-top: 2px;
            
        }
    }

    & .matches {
        margin-bottom: -35px;
        margin-top: -36px;
        align-items: center;
        justify-content: space-between;

        & > p {
            color: ${Colours.n500};
            font-size: 14px;
            margin: 0;
        }

        & .sortBy {
            font-size: 14px;
            color: ${Colours.n250};
        }

        & .chevronLeft:after {
            top: 19px;
        }
    }

    & .blue {
        color: ${Colours.b500};
    }

    & .filterrow {

    }

    @media screen and (max-width: 1150px) {
        & .fixedWidth {
            padding: 0 16px;
        }

        .dropdownAvailability, .dropdownLevel {
            max-width: unset !important;
        }
    }

    @media screen and (min-width: 960px) and (max-width: 1280px) {
        & .tutorsummary {
            & .mainrow {
                flex-direction: column;
                 
                & .maincol {
                     align-items: flex-start;
                     margin-bottom: 16px;

                     & .profileCircle {
                         margin-left: 16px;
                     }
                 }
            }
        }
    }

    @media screen and (min-width: 960px) {
        & .filterrow {
            position: sticky;
            top: 39px;
            z-index: ${zIndex.top};
        }

        & .filters {
            position: sticky;
            top: 175px;
            min-width: 300px;
        }
    }

    @media screen and (min-width: 960px) and (max-width: 1150px) {
        & .filters {
            top: 245px;
        }
    }

    @media screen and (max-width: 960px) {
        & .mainContent {
            flex-direction: column;
        }

        & .results {
            margin-left: unset;
        }
    }

    @media screen and (max-width: 800px) {
        & .tutorsummary {
            & .mainrow {
                flex-direction: column;
                 
                & .maincol {
                     align-items: center;
                 }
            }
        }
    }

    @media screen and (max-width: 640px) {
        & .levelInput, & .availability-input, & .postcode-input {
            max-width: unset !important;
        }

        & .availability-selector {
            right: 0;
        }
    }

    @media screen and (max-width: 420px) {
        & .availability-selector {
            right: -33px;
            width: 304px !important;
        }
    }

    @media screen and (max-width: 333px) {
        & .levelInput {
            margin-bottom: 16px;
        }
    }

    @media screen and (max-width: 575px) {
        & .tutorsummary {
            & .mainrow {            
                & .maincol {
                     align-items: flex-start;
                     margin-bottom: 16px;
                }

                & .contentrow {
                    flex-direction: column;

                    & .content {
                        margin-left: 0;
                    }

                    & .priceCol .right {
                        flex-direction: row;
                        flex-wrap: wrap;
                        margin-top: 16px;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 460px) {
        & .tutorsummary {
            & .mainrow {            
                & .maincol {
                     & .profileCircle > svg {
                         opacity: .33;
                     }
                 }
            }
        }
    }

    @media screen and (max-height: 950px) {
        & .filters {
            padding: 18px 32px;

            & > h2 {
                padding-bottom: 16px;
            }

            & .range-values {
                padding-bottom: 16px;
                margin-bottom: 16px;
            }
        }
    }

    @media screen and (max-height: 850px) {
        & .filters .opts {
            margin-bottom: 18px !important;
        }
    }

    @media screen and (max-height: 750px) {
        & .filters {
            padding: 16px 32px;

            & > h2 {
                padding-bottom: 14px;
            }

            & .range-values {
                padding-bottom: 14px;
                margin-bottom: 14px;
            }

            & .opts {
                margin-bottom: 14px !important;
            }
        }
    }
`

const SearchCard = styled.div`
    margin: 40px 0 0 0;
    border-radius: 4px;
    border: 1px solid ${Colours.t300};
    background: ${Colours.n850};
    display: flex;
    width: 100%;
    padding: 13px 16px;
    min-height: 50px;
    gap: 16px;

    @media screen and (max-width: 1150px) {
        flex-wrap: wrap;

        .searchInput {
            flex: 100% !important;
        }
    }
`

const SearchInput = styled.input`
   border: 1px solid ${Colours.n300};
   border-left: 0;
   border-radius: 0 6px 6px 0;
   height: 46px;
   flex: 1;
`

const SearchIcon = styled.div`
    background-color: ${Colours.b500};
    background-image: url('/img/search.svg');
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 6px 0 0 6px;
    height: 50px;
    width: 48px;
`

const Row = styled.div`
    display: flex;
    width: 100%;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const FilterLabel = styled.div`
    white-space: nowrap;
    display: flex;
    align-items: center;

`

const RangeValues = styled.div`
   display: flex;
   justify-content: space-between;
   margin-top: 12px;
   border-bottom: 1px solid ${Colours.n800};
   padding-bottom: 44px;
   margin-bottom: 44px;
`

const Empty = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 85px;

   & img {
        width: 140px;
        opacity: .66;
   }

   & h1 {
        opacity: .33;
   }
`

const FilterReset = styled.span`
   font-size: 16px;
   color: ${Colours.b300};
   cursor: pointer;
   font-weight: normal;

   &:hover {
       color: ${Colours.b500};
   }
`

/**
 * Find a Tutor page
 * 
 * Queries backend for tutors based on a collection of user specified filters.
 * 
 * Restores filters from query string on mount.
 */
function FinaATutor(props) {
    
    const [priceRange, setPriceRange] = useState({min: 5, max: 70})
    const [tutors, setTutors] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const [subjectLevels, setSubjectLevels] = useState([])
    const [loadingSubjects, setLoadingSubjects] = useState(true)
    const [loadingLevels, setLoadingLevels] = useState(true)
    const [loading, setLoading] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [initialCall, setInitialCall] = useState(false)

    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("")
    const [postcode, setPostcode] = useState("")
    const [online, setOnline] = useState(false)
    const [inPerson, setInPerson] = useState(false)
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)
    const [privateTutors, setPrivateTutors] = useState(true)
    const [agencies, setAgencies] = useState(false)
    const [qualifiedTeacher, setQualifiedTeacher] = useState(false)
    const [verified, setVerified] = useState(false)
    const [examiner, setExaminer] = useState(false)
    const [dbsChecked, setDbsChecked] = useState(false)

    const [nextPageLoading, setNextPageLoading] = useState(false)
    const [matches, setMatches] = useState(null)
    const [sortBy, setSortBy] = useState("Rating (High to Low)")
    const [latlng, setLatlng] = useState(null)

    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false]
    })
    const [availabilitySet, setAvailabilitySet] = useState(false)

    const debouncedPostcode = useDebounce(postcode, 500)
    const debouncedPriceRange = useDebounce(priceRange, 500)
    const debouncedMale = useDebounce(male, 500)
    const debouncedFemale = useDebounce(female, 500)
    const debouncedPrivateTutors = useDebounce(privateTutors, 500)
    const debouncedAgencies = useDebounce(agencies, 500)

    const history = useHistory()
    const windowSize = useWindowSize()

    const postcodeNodeRef = useRef()
    
    const buildPostParams = () => {
        const params = {
        }

        if (selectedSubject && Number.isInteger(parseInt(selectedSubject))) {
            params.subject = parseInt(selectedSubject)
        }

        if (debouncedPriceRange.min > 5) {
            params.min_price = debouncedPriceRange.min * 100
        }

        if (debouncedPriceRange.max < 70) {
            params.max_price = debouncedPriceRange.max * 100
        }

        if (selectedLevel) {
            params.level = selectedLevel
        }

        if (verified) {
            params.verified = true
        }

        /*
        if (debouncedPostcode) {
            params.postcode = debouncedPostcode 
            params.distance = 75
        }
        */

        if (debouncedMale || debouncedFemale) {
            params.gender = debouncedMale ? 'male' : 'female'
        }

        if (debouncedPrivateTutors || debouncedAgencies) {
            params.type = debouncedPrivateTutors ? 'private' : 'agency'
        }

        if (online) {
            params.online = true
        }

        if (inPerson) {
            params.in_person = true
        }

        if (qualifiedTeacher) {
            params.qualified_teacher = true
        }

        if (examiner) {
            params.examiner = true
        }

        if (dbsChecked) {
            params.dbs = true
        }

        if (privateTutors || agencies) {
            params.type = privateTutors ? 'private' : 'agency'
        }

        if (sortBy) {
            if (sortBy == "Rating (High to Low)") {
                params.order_by = "rating"
            } else if (sortBy == "Distance") {
                params.order_by = "distance"
            } else if (sortBy == 'Price (Low to High)') {
                params.order_by = 'price_low';
            } else if (sortBy == 'Price (High to Low)') {
                params.order_by = 'price_high';
            } else {
                params.order_by = "rating"
            }
        } else {
            params.order_by = "rating"
        }

        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            params.availability = availability
        }

        if (latlng) {
            params.latlng = latlng
        }

        return params
    }

    const buildQueryString = () => {
        const query = {}
        //if (postcode) { query.postcode = postcode }
        if (selectedSubject && Number.isInteger(parseInt(selectedSubject))) { query.subject = selectedSubject }
        if (selectedLevel) { query.level = selectedLevel }
        if (online) { query.online = online }
        if (inPerson) { query.in_person = inPerson }
        if (male) { query.gender = "male" }
        if (female) { query.gender = "female" }
        if (qualifiedTeacher) { query.qualified_teacher = true }
        if (verified) { query.verified = true }
        if (examiner) { query.examiner = true }
        if (dbsChecked) { query.dbsChecked = true }
        //if (sortBy) { query.sort_by = sortBy }

        if (privateTutors || agencies) {
            query.type = privateTutors ? 'private' : 'agency'
        }

        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) { 
            query.availability = JSON.stringify(availability)
        }

        if (latlng) {
            query.latlng = latlng
        }

        return (new URLSearchParams(query)).toString()
    }

    const updateQueryString = () => {

        history.push({search: buildQueryString()})
    }

    const queryTutors = async (overrideParams = null) => {

        setLoading(true)
        setNextPageUrl(null)
        
        const params = buildPostParams()

        try {
            const response = await API.post('tutor/search', overrideParams ? overrideParams : params)
            
            setTutors(response.data.data)
            setMatches(response.data.total)
            if (response.data.next_page_url) {
                setNextPageUrl(response.data.next_page_url)
            }
            setLoading(false)
            setInitialCall(true)
        } catch (error) {
            Toast.error("Unexpected error fetching tutors.")
            setLoading(false)
        }
    }

    const loadNextPage = async event => {
        try {
            setNextPageLoading(true)
            const params = buildPostParams()
            const response = await API.post(nextPageUrl, params)

            if (response && response.data && response.data.data) {
                setTutors([...tutors, ...response.data.data])
                if (response.data.next_page_url) {
                    setNextPageUrl(response.data.next_page_url)
                } else {
                    setNextPageUrl(null)
                }
            }
            
            setNextPageLoading(false)
        } catch (error) {
            Toast.error("Unexpted error fetching more tutors, please try again.")
            setNextPageLoading(false)
        }
    }

    const resetFilters = () => {
        setPrivateTutors(true)
        setAgencies(false)
        setMale(false)
        setFemale(false)
        setQualifiedTeacher(false)
        setVerified(false)
        setExaminer(false)
        setDbsChecked(false)
        setPriceRange({min: 5, max: 70})
    }

    useEffect(() => {
        if (initialCall) {
            queryTutors()
            updateQueryString()
        }
    }, [
        selectedSubject,
        //debouncedPostcode,
        debouncedPriceRange, 
        selectedLevel,
        online,
        inPerson,
        debouncedMale,
        debouncedFemale,
        qualifiedTeacher,
        verified,
        examiner,
        dbsChecked,
        sortBy,
        availability,
        debouncedAgencies,
        debouncedPrivateTutors,
        latlng
    ])

    useEffect(() => {
        if (male) {
            setFemale(false)
        }
    }, [male])

    useEffect(() => {
        if (female) {
            setMale(false)
        }
    }, [female])

    useEffect(() => {
        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            setAvailabilitySet(true)
        } else {
            setAvailabilitySet(false)
        }
    }, [availability])


    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (Array.from(params.keys()).length > 0) {
            const overrideParams = {}

            if (params.has('postcode')) {
                setPostcode(params.get('postcode'))
                overrideParams.postcode = params.get('postcode')
            } else if (params.has('county')) {
                setPostcode(params.get('county'))
                overrideParams.postcode = params.get('county')
            } else if (params.has('city')) {
                setPostcode(params.get('city'))
                overrideParams.postcode = params.get('city')
            }

            if (params.has('subject')) {
                setSelectedSubject(params.get('subject'))
                overrideParams.subject = params.get('subject')
            }

            if (params.has('level')) {
                setSelectedLevel(params.get('level'))
                overrideParams.level = params.get('level')
            }

            if (params.has('online')) {
                setOnline(true)
                overrideParams.online = true
            }

            if (params.has('in_person')) {
                setInPerson(true)
                overrideParams.in_person = true
            }

            if (params.has('latlng')) {
                const ll = params.get('latlng')
                setLatlng(ll)
                setPostcode(ll)
                overrideParams.latlng = ll
            }

            if (params.has('type')) {
                const tutorType = params.get('type')
                setPrivateTutors(tutorType == 'private')
                setAgencies(tutorType == 'agency')
                overrideParams.type = tutorType
            } else {
                overrideParams.type = 'private'
            }

            //if (params.has('sort_by')) {
            //    overrideParams.order_by = params.get('sort_by')
            //} else {
                overrideParams.order_by = 'rating'
            //}

            queryTutors(overrideParams)
        } else {
            queryTutors()
        }
    }, [])

    const updateAutocompletePosition = event => {
        const rect = postcodeNodeRef.current.getBoundingClientRect()
        const top = rect.top + postcodeNodeRef.current.offsetHeight
        const container = document.querySelector('.pac-container')
        if (container) { container.style.top = top + 'px' }
    }

    useEffect(() => {
        updateAutocompletePosition()
    }, [postcode])

    useEffect(() => {
        if (postcodeNodeRef.current) {
            const options = {
                componentRestrictions: { country: "uk" },
                fields: ["address_components", "geometry", "name"],
                strictBounds: false
              };
              const autocomplete = new window.google.maps.places.Autocomplete(postcodeNodeRef.current, options);
              autocomplete.addListener('place_changed', function() {

                const place = autocomplete.getPlace()
            
                if (place.geometry) {
                    setPostcode(place.name)
                    setLatlng(place.geometry.location.lat() + ',' + place.geometry.location.lng())
                }
              });

              window.addEventListener('scroll', updateAutocompletePosition)              
        }

        return () => {
            window.removeEventListener('scroll', updateAutocompletePosition)
        }
    }, [postcodeNodeRef])

    useEffect(() => {
        if (postcode == '') { setLatlng(null) }
    }, [postcode])

    return <>
        <Helmet>
            <title>Find a tutor - Qualified Tutors</title>
        </Helmet>
        
        <SubjectContext.Consumer>
            {subjectContext => 
                <Container>
                    <FixedWidth>
                        <Row className='filterrow'>
                            <SearchCard>
                                <div style={{display: 'flex', flex: '1'}} className="searchInput">
                                    <SearchIcon />
                                    <Dropdown 
                                        active={!!selectedSubject && Number.isInteger(selectedSubject)}
                                        clearable
                                        editable 
                                        clearCallback={() => setSelectedLevel("")}
                                        className="searchDropdown"
                                        containerClass="searchDropdown"
                                        placeholder="Search a subject"
                                        selected={parseInt(selectedSubject) ? subjectContext.subjects.find(s => s.id == selectedSubject).subject : selectedSubject} 
                                        onChange={(value, node) => node ? 
                                            ((id) => {
                                                const subject = subjectContext.subjects.find(s => s.id == id)
                                                setSubjectLevels(JSON.parse(subject.levels))
                                                setSelectedSubject(id)
                                            })(parseInt(node.key))
                                        : setSelectedSubject(value)}
                                    > 
                                        {subjectContext.subjects.map(subject => <div key={subject.id}>{subject.subject}</div>)}
                                    </Dropdown>
                                </div>
                                
                                <Dropdown 
                                    active={!!selectedLevel}
                                    style={{flex: '1', maxWidth: '220px'}} 
                                    placeholder="Level"
                                    selected={selectedLevel}
                                    onChange={value => setSelectedLevel(value)}
                                    containerClass="levelInput"
                                    clearable
                                >
                                    {(subjectLevels && subjectLevels.length > 0 ? subjectLevels : subjectContext.levels).map((level, index) => <div key={index}>{level}</div>)}
                                </Dropdown>
                                
                                <Dropdown 
                                    active={availabilitySet}
                                    className="dropdownAvailability" 
                                    style={{flex: '1', maxWidth: '220px'}} 
                                    placeholder="Availability" 
                                    listClass="availability-selector"
                                    component={<AvailabilitySelector availability={availability} setAvailability={setAvailability} />} 
                                    listStyle={{width: windowSize.width > 420 ? '400px' : '300px', overflow: 'hidden'}}
                                    containerClass="availability-input"
                                    selected={
                                        availability.morning.find(v => v) ||
                                        availability.afternoon.find(v => v) ||
                                        availability.evening.find(v => v) ? "Availability" : ""
                                    }
                                    clearable
                                    clearCallback={e => setAvailability({
                                        morning: [false, false, false, false, false, false, false],
                                        afternoon: [false, false, false, false, false, false, false],
                                        evening: [false, false, false, false, false, false, false]
                                    })}
                                />

                                <Input 
                                    className="inputPostcode" 
                                    value={postcode} 
                                    onChange={e => setPostcode(e.target.value)} 
                                    style={{maxWidth: '240px', marginBottom: '0'}} 
                                    placeholder="Postcode/Town/City" 
                                    active={postcode && postcode.length > 0}
                                    containerClass="postcode-input"
                                    forwardRef={postcodeNodeRef}
                                />

                                <Column>
                                    <Checkbox label="Online" style={{position: 'relative', top: '-3px'}} value={online} setter={setOnline} />
                                    <Checkbox label="In person" style={{position: 'relative', top: '2px'}} value={inPerson} setter={setInPerson} />
                                </Column>
                            </SearchCard>
                        </Row>

                        <Row className="mainContent">
                            <Column>
                                <Card className="filters">
                                    <h2 style={{display: 'flex', flex: 1, alignItems: 'center'}}><img alt="filter" src="/img/filter.webp" style={{width: '16px', height: '12px'}}  /> <span style={{display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>Filters <FilterReset onClick={resetFilters}>Reset filters</FilterReset></span></h2>
                                    
                                    <b>Price range (per hour)</b>
                                    <InputRange 
                                        minValue={5}
                                        maxValue={70}
                                        value={priceRange}
                                        onChange={value => setPriceRange(value)}
                                    />
                                    <RangeValues className='range-values'>
                                        <div>£{priceRange.min}</div>
                                        <div>£{priceRange.max}{priceRange.max == 70 ? '+' : ''}</div>
                                    </RangeValues>

                                    <b>Type</b>
                                    <Column className="opts">
                                        <Checkbox label="Private tutors" value={privateTutors} setter={value => {setPrivateTutors(value); setAgencies(false);}} />
                                        <Checkbox label="Agencies" value={agencies} setter={value => {setAgencies(value); setPrivateTutors(false);}} />
                                    </Column>

                                    <b>Gender</b>
                                    <Column className="opts">
                                        <Checkbox label="Male" value={male} setter={value => {setMale(value); setFemale(false);}} />
                                        <Checkbox label="Female" value={female} setter={value => {setFemale(value); setMale(false);}} />
                                    </Column>

                                    <b>Other</b>
                                    <Column className="opts">
                                        <Checkbox label="Qualified teacher" value={qualifiedTeacher} setter={setQualifiedTeacher} />
                                        <Checkbox label="Verified" value={verified} setter={setVerified} />
                                        <Checkbox label="Examiner" value={examiner} setter={setExaminer} />
                                        <Checkbox label="DBS checked" value={dbsChecked} setter={setDbsChecked} />
                                    </Column>
                                </Card>
                            </Column>

                            <Column className="results">
                                {loading ? <Empty><RingLoader colour={Colours.b500} /></Empty> : null}

                                {tutors && !loading ? <>

                                    <Row className="matches" style={{zIndex: zIndex.level3}}>
                                        {matches != null ? <p><span className='blue'>{matches}</span> {selectedSubject || selectedLevel ? <span className='blue'>{selectedSubject instanceof Object && subjects && subjects.length > 0 ? subjects.find(s => s.id == selectedSubject).subject : null} {selectedLevel ? '(' + selectedLevel + ')' : null}</span> : null} <span className='blue'>tutors</span> match your search requirements</p> : null}
                                        <Dropdown 
                                            containerClass="sortBy" 
                                            prefix="Sort by:" 
                                            chromeless 
                                            chevronLeft 
                                            selected={sortBy}
                                            onChange={value => setSortBy(value)}
                                            listHeight="175px"
                                        >
                                            <div key="rating">Rating (High to Low)</div>
                                            <div key="distance">Distance</div>
                                            <div key="price_high">Price (High to Low)</div>
                                            <div key="price_low">Price (Low to High)</div>
                                        </Dropdown>    
                                    </Row>

                                    {tutors.map(tutor => <TutorSummary 
                                        key={tutor.id}
                                        onClick={e => history.push('/profile/' + tutor.message_uuid, {
                                            tutors: tutors.map(t => t.message_uuid),
                                            breadcrumb: {
                                                to: '/find-a-tutor?' + buildQueryString(),
                                                breadcrumb: "Back to search results"
                                            }
                                        })}
                                        user={tutor} 
                                        hover 
                                        rightSubjects
                                    />)}
                                </> : null}

                                {!loading && tutors && tutors.length == 0 ? <Empty style={{textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: '#616161'}}>No tutors match your search requirements</Empty> : null}

                                {tutors && !loading && nextPageUrl ? <Button onClick={loadNextPage}>{nextPageLoading ? <RingLoader small /> : 'See more tutors'}</Button> : null}
                            </Column>
                        </Row>
                    </FixedWidth>
                </Container>
            }
            
        </SubjectContext.Consumer>
    </>
}

export default FinaATutor
