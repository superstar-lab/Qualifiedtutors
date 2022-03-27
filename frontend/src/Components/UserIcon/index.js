import styled from "styled-components"
import Colours from "../../Config/Colours"

const backgroundColours = {
    'a': Colours.b500,
    'b': Colours.g500,
    'c': Colours.t300,
    'd': Colours.n500,
    'e': Colours.r500,
    'f': Colours.b500,
    'g': Colours.g500,
    'h': Colours.t300,
    'i': Colours.n500,
    'j': Colours.r500,
    'k': Colours.b500,
    'l': Colours.g500,
    'm': Colours.t300,
    'n': Colours.n500,
    'o': Colours.r500,
    'p': Colours.b500,
    'q': Colours.g500,
    'r': Colours.t300,
    's': Colours.n500,
    't': Colours.r500,
    'u': Colours.b500,
    'v': Colours.g500,
    'w': Colours.t300,
    'x': Colours.n500,
    'y': Colours.r500,
    'z': Colours.b500,
}

const Container = styled.div`
    background: ${props => props.bg};
    color: white;
    border-radius: 50%;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    user-select: none;

    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    & > img {
        width: ${props => props.size}px;
        height: ${props => props.size}px;
        object-fit: cover;
        border-radius: 50%;
    }
`

/**
 * Renders a users profile picture in a circle, or their initials of they have no profile pic
 *
 * @param user      Object  The user whose profile pic you want to render
 * @param initials  String  If the user has no profile pic and has no name set fallback to this
 * @param size      Integer If present the circle will be rendered at this size (default 44)
 */
function UserIcon({user, initials, size, ...props}) {

    return <Container size={size ? size : 44} className="user-icon" bg={user ? backgroundColours[user.name ? user.name.charAt(0).toLowerCase() : 'a'] : Colours.b500}>
        {user ? ( user.profile_image ? <img alt="profile image" src={user.profile_image} /> :
            user.tutor_type == 'agency' ? (user.company_name ? user.company_name.slice(0, 2).toUpperCase() : initials) : (user.name && user.surname ? (user.name.charAt(0) + user.surname.charAt(0)).toUpperCase() : initials )
        ) : initials.slice(0, 2).toUpperCase()}
    </Container>
}

export default UserIcon