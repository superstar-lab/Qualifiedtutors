import styled from 'styled-components'
import Link from '../../Components/Link'
import Colours from '../../Config/Colours.js'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: ${Colours.t500};
    padding: 64px 64px 16px 64px;
    box-shadow: 0px -4px 8px rgba(48, 49, 51, 0.1);

    & > div:first-of-type {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    & > div:last-of-type {
        display: none;
    }

    @media screen and (max-width: 1150px) {
        padding: 48px 16px 16px 16px;
    }

    @media screen and (max-width: 980px) {
        justify-content: unset;

        & > div:first-of-type {
            img {
                margin-bottom: 16px;
            }

            p {
                display: none;
            }
        }

        & > div:last-of-type {
            display: block;
        }
    }
`

const Lists = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 48px;
    gap: 24px;

    & ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        font-size: 18px;
        line-height: 190%;

        & li {
            font-weight: 500;    

            &:hover a {
                color: black;
                font-weight: bold;
            }

            &.active a {
                color: black;
                font-weight: bold;
            }
        }
        
        & li:first-of-type {
            font-weight: bold;
        }

        &:nth-of-type(2n) {
            margin: 0 48px;
        }
    }

    @media screen and (max-width: 980px) {
        width: 100%;
        justify-content: space-between;
        margin-bottom: 24px;

        & ul:nth-of-type(2n) {
            margin: 0;
        }
    }
`

/**
 * Footer
 * 
 * Renders the site footer with links to various pages
 */

function Footer() {
    
    const history = useHistory()
    const location = useLocation()

    const scrollUp = event => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    return (
        <Container>
            <div>
                <img alt="Qualified tutors logo" style={{cursor: 'pointer'}} onClick={e => history.push('/')} src="/img/logo.svg" />
                <p>{(new Date()).getFullYear()} © QUALIFIED TUTORS</p>
            </div>        

            <Lists>
                <ul style={{width: '230px'}}>
                    <li>GET TO KNOW US</li>
                    <li className={location.pathname == '/about-us' ? 'active' : ''}><Link onClick={scrollUp} to="/about-us">About us</Link></li>
                    <li className={location.pathname == '/terms-and-conditions' ? 'active' : ''}><Link onClick={scrollUp} to="/terms-and-conditions">Terms and conditions</Link></li>
                    <li className={location.pathname == '/privacy-policy' ? 'active' : ''}><Link onClick={scrollUp} to="/privacy-policy">Privacy policy</Link></li>
                </ul>

                <ul>
                    <li>SOCIAL MEDIA</li>
                    <li><Link to="">Facebook</Link></li>
                </ul>

                <ul style={{width: '160px'}}>
                    <li>OTHER</li>
                    <li className={location.pathname == '/faqs' ? 'active' : ''}><Link onClick={scrollUp} to="/faqs">FAQs</Link></li>
                    <li className={location.pathname == '/contact-us' ? 'active' : ''}><Link onClick={scrollUp} to="/contact-us">Contact us</Link></li>
                </ul>
            </Lists>

            <div>
                <p>{(new Date()).getFullYear()} © QUALIFIED TUTORS</p>
            </div>
        </Container>
    )
}

export default Footer
