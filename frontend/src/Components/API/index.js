import axios from 'axios'
import { API_URL } from '../../Config/Network'
import Toast from '../Toast'
import { createBrowserHistory } from 'history'

/**
 * Preconfigured Axios instance to be used for communication with the API
 * 
 * @see https://axios-http.com/docs/intro
 */
const API = axios.create({
    baseURL: API_URL
})

/**
 * History singleton for the application. This specific instance must also be provided to the router.
 */
const History = createBrowserHistory()

API.interceptors.response.use(response => response, error => {
    // A 401 Unauthenticataed response from the API on most routes should redirect to the sign in page
    if (
        (error && error.response && error.response.status == 401) &&
        (error && error.response && error.response.data && error.response.data.message == "Unauthenticated.") &&
        !(error && error.response && error.response.request && error.response.request.responseURL.endsWith("/me")) &&
        !(error && error.response && error.response.request && error.response.request.responseURL.endsWith("/unread_count"))
    ) {
        Toast.error("Your session has expired. Please sign in again.")
        History.push('/sign-in')
    } else {
        throw error
    }
})

API.defaults.withCredentials = true

export { API, History }