import card from "../css/Card.module.css"

// name
// age
// photo

function Card({profile}) {
    return (
        <div className={card.container}>
            <div className={card.description}>
                <h2 className={card.text}>{profile.name}</h2>
                <h2 className={card.text}>{profile.age}</h2>
            </div>
            <img className={card.img} src={profile.url} alt="profile_img"/>
            <div className={card.info_container}>
                <p className={card.text + " " + card.info}>{profile.major}</p>
                <p className={card.text + " " + card.info}>{profile.studyStyle}</p>
            </div>
        </div>
    )
}


export default Card