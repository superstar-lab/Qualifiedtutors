import styled from "styled-components"
import zIndex from '../../Config/zIndex'

const Container = styled.div`
    max-width: 80vw;
    max-height: 90vh;
    overflow: hidden;
    transition: transform .25s;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(0);
    z-index: ${zIndex.modal};

    ${props => props.visible ? `
        transform: translateX(-50%) translateY(-50%) scale(1);
    ` : ''}

    & .closebtn {
        position: absolute;
        top: 32px;
        right: 32px;
        cursor: pointer;
        z-index: ${zIndex.top};
        width: 20px !important;
        height: 20px !important;
        opacity: .66;

        &:hover {
            opacity: 1;
        }
    }
`

const Lightbox = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: black;
    top: 0;
    left: 0;

    opacity: 0;
    transition: opacity .25s;
    pointer-events: none;

    z-index: ${zIndex.modal - 1};

    ${props => props.visible ? `
        opacity: .66;
        pointer-events: auto;
    ` : ''}
`

/**
 * Modal
 * 
 * Used to display contents in front of the page contents.
 * Renders its contents on top of a container that dims the page contents and dismisses the modal onclick.
 * Includes a button in the top right to dismiss the modal.
 * 
 * @param visible   Boolean     Current visibility of the modal
 * @param children  Renderable  Contents to render inside the modal
 * @param dismiss   Function    Function called to dismiss the modal
 * @param style     Object      
 * @example
 *  const [modalVisible, setModalVisible] = useState(false)
 * 
 *  ...
 * 
 *  <Modal visible={modalVisible} dismiss={() => setModalVisible(false)}>
 *      <h1>Modal contents</h1>
 *  </Modal>
 * 
 *  <button onClick={e => setModalVisible(true)}>Show modal</button>
 */
function Modal({visible, children, dismiss, style}) {

    return <>
        <Lightbox visible={visible} onClick={dismiss} />

        <Container visible={visible} className="modal" style={style}>
            <img alt="close modal" className="closebtn" src="/img/cross_blue_20.webp" onClick={dismiss} />
            {children}
        </Container>
    </> 
}

export default Modal