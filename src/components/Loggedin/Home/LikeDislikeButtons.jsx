import Btn from "@/css/LoggedIn/Buttons.module.css"

function LikeDislikeButtons({profile, onLike, onDislike}) {

    return (
        <div className={Btn.container}>
            <button onClick={onDislike} className={Btn.reject}>
                <img className={Btn.icons} src="../src/assets/icons/reject.svg"></img>
            </button>
            <button onClick={onLike} className={Btn.like}>
                <img className={Btn.icons} src="../src/assets/icons/like.svg"></img>
            </button>
        </div>
    )
}

export default LikeDislikeButtons