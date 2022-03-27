import styled from 'styled-components'
import {Helmet} from 'react-helmet'
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
} from '../../../../../Components'

import Colours from '../../../../../Config/Colours.js'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import 'react-input-range/lib/css/index.css'
import zIndex from '../../../../../Config/zIndex'
import TutorSummary from '../../../Profile/Components/TutorSummary'

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

        & > div:first-of-type {
            
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
        min-width: 300px;
        margin-bottom: 38px;

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
    }

    & .searchDropdown {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 36px;
        flex: 1;
    }

    & .sortBy {
        position: absolute;
        right: 8px;
        top: -40px;
        width: 100%;
        max-width: 200px;

        & > div:first-of-type {
            font-size: 14px;
        }
    }

    & .matches {
        margin-bottom: -31px;

        & > p {
            color: ${Colours.n500};
            font-size: 14px;
            margin: 0;
            margin-top: -24px;
        }

        & .sortBy {
            font-size: 14px;
            color: ${Colours.n250};
        }

        & .chevronLeft:after {
            top: 19px;
        }
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
`

const SearchCard = styled.div`
    margin: 40px 0;
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

//const tutorQueryAbortController = new AbortController()

function FavouriteTutors(props) {
   
    const [tutors, setTutors] = useState(null)
    const [loading, setLoading] = useState(false)
    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [nextPageLoading, setNextPageLoading] = useState(false)


    const history = useHistory()

    const queryTutors = async () => {

        setLoading(true)
        setNextPageUrl(null)
        
        try {
            const response = await API.get('user/favourite_tutors'/*, { signal: tutorQueryAbortController.signal }*/)
            
            setTutors(response.data.data)
            if (response.data.next_page_url) {
                setNextPageUrl(response.data.next_page_url)
            }
            setLoading(false)
        } catch (error) {
            Toast.error("Unexpected error fetching tutors.")
            setLoading(false)
        }
    }

    const loadNextPage = async event => {
        try {
            setNextPageLoading(true)
            const response = await API.get(nextPageUrl)

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

    const filterTutors = (id, status) => {
        if (!status) {
            setTutors(tutors.filter(t => t.id != id))
        }
    }

    useEffect(() => {
        queryTutors()
    }, [])

    return <>
    <Helmet>
        <title>Favourite tutors - Qualified Tutors</title>
    </Helmet>
    
    <Container>
        <FixedWidth>
            <Row className="mainContent">
                <Column className="results">
                    {tutors === null && loading ? <Empty><RingLoader colour={Colours.b500} /></Empty> : null}

                    {tutors ? <>
                        {tutors.map(tutor => <TutorSummary 
                            onClick={e => history.push('/profile/' + tutor.message_uuid, {
                                tutors: tutors.map(t => t.message_uuid)
                            })}
                            user={tutor} 
                            hover 
                            rightSubjects
                            onFavouriteToggle={(id, status) => filterTutors(id, status)}
                        />)}
                    </> : null}

                    {tutors && nextPageUrl ? <Button onClick={loadNextPage}>{nextPageLoading ? <RingLoader small /> : 'See more tutors'}</Button> : null}
                </Column>
            </Row>
        </FixedWidth>
    </Container>
    </>
}

export default FavouriteTutors
