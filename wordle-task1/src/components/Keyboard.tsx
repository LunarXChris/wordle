import './Keyboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons'

const Keyboard = () => {

    return (
        <div className="keyboard">
            <div className="keyboard_row">
                <button type="button" className="key_cap" data-key="Q">Q</button>
                <button type="button" className="key_cap" data-key="W">W</button>
                <button type="button" className="key_cap" data-key="E">E</button>
                <button type="button" className="key_cap" data-key="R">R</button>
                <button type="button" className="key_cap" data-key="T">T</button>
                <button type="button" className="key_cap" data-key="Y">Y</button>
                <button type="button" className="key_cap" data-key="U">U</button>
                <button type="button" className="key_cap" data-key="I">I</button>
                <button type="button" className="key_cap" data-key="O">O</button>
                <button type="button" className="key_cap" data-key="P">P</button>
            </div>
            <div className="keyboard_row">
                <button type="button" className="key_cap" data-key="A">A</button>
                <button type="button" className="key_cap" data-key="S">S</button>
                <button type="button" className="key_cap" data-key="D">D</button>
                <button type="button" className="key_cap" data-key="F">F</button>
                <button type="button" className="key_cap" data-key="G">G</button>
                <button type="button" className="key_cap" data-key="H">H</button>
                <button type="button" className="key_cap" data-key="J">J</button>
                <button type="button" className="key_cap" data-key="K">K</button>
                <button type="button" className="key_cap" data-key="L">L</button>
            </div>
            <div className="keyboard_row">
                <button type="button" className="key_cap" data-key="enter">Enter</button>
                <button type="button" className="key_cap" data-key="Z">Z</button>
                <button type="button" className="key_cap" data-key="X">X</button>
                <button type="button" className="key_cap" data-key="C">C</button>
                <button type="button" className="key_cap" data-key="V">V</button>
                <button type="button" className="key_cap" data-key="B">B</button>
                <button type="button" className="key_cap" data-key="N">N</button>
                <button type="button" className="key_cap" data-key="M">M</button>
                <button type="button" className="key_cap" data-key="bs">
                    <FontAwesomeIcon icon={faDeleteLeft} pointer-events="none" data-key="bs"/>
                </button>
            </div>
        </div>
    )
}

export default Keyboard