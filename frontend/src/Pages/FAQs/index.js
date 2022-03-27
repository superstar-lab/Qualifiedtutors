import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Colours from '../../Config/Colours.js'
import {
    FixedWidth,
    WavyRect,
    Circle,
    Underline,
    Card,
    Input,
    Button,
    RingLoader,
    Toast,
    API,
    Link
} from '../../Components'
import Collapsible from '../../Components/Collapsible/index.js'
import { useEffect, useState } from 'react'
import { EmailRegex } from '../../Config/Validation.js'
import toast from '../../Components/Toast/index.js'
import { useLocation, useParams } from 'react-router-dom'

const Container = styled.div`
    margin-bottom: 48px;

    & .card {
        padding: 8px 0;
    }

    & .questionrow {
        & > div {
            flex-basis: calc(50% - 48px);
        }
    }

    @media screen and (max-width: 1530px) {
        & .fixedWidth {
            padding-left: 32px;
            padding-right: 32px;
        }
    }

    @media screen and (max-width: 980px) {
        & .eyecatchRow {
            position: relative;
            z-index: 10;

            & .eyecatchIcon {
                position: absolute;
                height: 80%;
                width: 240px;
                right: -98px;
                z-index: -1;
            }
        }
    }

    @media screen and (max-width: 720px) {
        & .questionrow {
            flex-direction: column;
            gap: 16px !important;
        }
    }

    @media screen and (max-width: 700px) {
        & .eyecatchIcon {
            opacity: .33;
        }
    }

    @media screen and (max-width: 540px) {
        & .eyecatchRow h1 {
            text-align: center;
        }
    }

    @media screen and (max-width: 480px) {
        & .eyecatchRow h1 {
            font-size: 72px;
            line-height: 86.4px;
        }

        & .fixedWidth {
            padding-left: 16px;
            padding-right: 16px;
        }

        .eyecatchIcon {
            top: -40px;
            
            & > div {
                width: 275px !important;
            }
        }
    }

    @media screen and (max-width: 430px) {
        & .eyecatchRow h1 {
            font-size: 60px;
            line-height: 72px;
        }
    }

    @media screen and (max-width: 375px) {
        & .eyecatchRow h1 {
            font-size: 48px;
            line-height: 57.6px;
        }
    }

    @media screen and (max-width: 320px) {
        & .eyecatchRow h1 {
            font-size: 34px;
            line-height: 40.8px;
        }
    }
`

const LeadIn = styled.div`
    margin: 48px 0;

    h1 {
        font-weight: bold;
        font-size: 48px;
        line-height: 60px;
        color: ${Colours.n100};
    }
`

const EyeCatch = styled.div`
    flex: 1;

    h1 {
        font-weight: bold;
        font-size: 80px;
        line-height: 96px;
    }
`

const EyeCatchIcon = styled.div`
    flex: 1;
    position: relative;

    & .circleSVG {
        position: absolute;
        right: 100px;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const Row = styled.div`
    display: flex;
`

const FaqLeadIn = styled.div`
    margin-top: 142px;

    h2 {
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
    }
`

const Faqs = styled.section`
    margin-bottom: 64px;
`

const Address = styled.div`
    flex: 1;
    padding-right: 64px;
    border-right: 1px solid #EEEEEE;

    & p {
        color: #616161;
        font-size: 18px;
        line-height: 32px;
    }
`

const Form = styled.div`
    flex: 1;
    padding-left: 64px;
    margin-bottom: 48px;
`

const categoryToString = cat => {
    return cat && cat.replaceAll ? cat.replaceAll(/ /gi, "-").toLowerCase() : ''
}

const stringToCategory = cat => {
    cat = cat && cat.replaceAll ? cat.replaceAll(/-/gi, " ") : ''
    cat = cat.charAt(0).toUpperCase() + cat.slice(1)
    return cat
}

/**
 * FAQs page
 * 
 * Queries backend for FAQs and presents them to users
 */
function FAQs(props) {

    const [faqs, setFaqs] = useState({})
    const [category, setCategory] = useState("")
    const [categoryFaqs, setCategoryFaqs] = useState([])
    const [loading, setLoading] = useState(true) 


    const location = useLocation()

    const getFaqs = async () => {
        
        setLoading(true)

        try {
            const response = await API.get('faqs')
            setFaqs(response.data)
            
        } catch (error) {
            toast.error("Unexpected error fetching FAQs")
        }

        setLoading(false)
    }

    const getCategory = async category => {

        setLoading(true)
        try {
            const response = await API.get('faqs/' + category)
            setCategoryFaqs(response.data)
        } catch(error) {
            toast.error("Unexpected error fetching FAQs")
        }

        setLoading(false)
    }

    useEffect(() => {
        if (location.pathname == "/faqs") {
            setCategoryFaqs([])
            setCategory("")
            getFaqs()
        }
    }, [location])

    useEffect(() => {
        if (location.pathname != '/faqs') {
            const path = location.pathname.replace('/faqs/', '')
            setCategory(path)
        }
    }, [location])

    useEffect(() => {
        if (category != "") {
            getCategory(category)
        }
    }, [category])

    return <>
        <Helmet>
            <title>FAQs - Qualified Tutors</title>
        </Helmet>

        <Container>
            <LeadIn>
                <FixedWidth>
                    <h1>FAQs.</h1>
                </FixedWidth>
            </LeadIn>

            <WavyRect>
                <FixedWidth width="1280px">
                    <Row className='eyecatchRow'>
                        <EyeCatch>
                            <h1>Questions<br />&amp; Answers.</h1>
                            <p>If you can't find and answer here, please don't hestiate to contact us</p>
                        </EyeCatch>

                        <EyeCatchIcon className='eyecatchIcon'>
                            <Circle colour={Colours.b300} width="322px"><img alt="questionmark" src="/img/question.webp" /></Circle>
                        </EyeCatchIcon>
                    </Row>
                </FixedWidth>
            </WavyRect>
            
            <FaqLeadIn>
                <FixedWidth width="1280px">
                    
                </FixedWidth>
            </FaqLeadIn>

            <Faqs>
                <FixedWidth width="1340px">
                    <Row className="questionrow" style={{gap: '96px', flexWrap: 'wrap'}}>
                        {loading ? <RingLoader style={{flexBasis: '100%', justifyContent: 'center', display: 'flex'}} colour={Colours.b500} /> : 
                            
                            categoryFaqs.length > 0 ? <Column style={{flexBasis: '100%', gap: '24px'}}>
                                <Link primary to="/faqs">Back</Link>
                                <h2>{stringToCategory(category)}</h2>
                                {categoryFaqs.map(faq => <>
                                    <Collapsible title={faq.title}>
                                        {faq.body.split('\n').map(line => <p>{line}</p>)}
                                    </Collapsible>
                                </>)}
                            </Column> : 
                            
                            faqs ? Object.keys(faqs).map((category, index) => <Column style={index == Object.keys(faqs).length && !(index % 2) ? {gap: '24px', flexBasis: '50% - 57px'} : {gap: '24px'}}>
                                <h2>{category}</h2>
                                {faqs[category].articles.map(faq => <>
                                    <Collapsible title={faq.title}>
                                        {faq.body.split('\n').map(line => <p>{line}</p>)}
                                    </Collapsible>
                                </>)}
                                {faqs[category].total > 6 ? <div>
                                    <Link black to={"/faqs/" + categoryToString(category)}>See all {faqs[category].total} articles</Link>
                                </div> : null}
                            </Column>) : null
                        }
                    </Row>
                </FixedWidth>
            </Faqs>
        </Container>
    </>
}

export default FAQs