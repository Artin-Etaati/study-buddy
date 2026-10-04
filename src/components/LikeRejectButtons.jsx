
import Btn from "../css/Buttons.module.css"

function LikeRejectButtons({profile}) {

    function handleLike(e) {
        e.preventDefault()
        alert(`Liked ${profile.name}`)
    }

    function handleReject(e) {
        e.preventDefault()
        alert(`rejected ${profile.name}`)
    }

    return (
        <div className={Btn.container}>
            <button onClick={handleReject} className={Btn.reject}>
                <img className={Btn.icons} src="../src/assets/icons/reject.svg"></img>
            </button>
            <button onClick={handleLike} className={Btn.like}>
                <img className={Btn.icons} src="../src/assets/icons/like.svg"></img>
            </button>
        </div>
    )
}

export default LikeRejectButtons