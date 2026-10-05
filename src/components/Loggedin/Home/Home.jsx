import Card from "./Card.jsx"
import home from "./Home.module.css"
import LikeRejectBtns from "./LikeRejectButtons.jsx"
const Home = () => {
  
  const profile = {name: "Gordon Ramsay", age: 20, major: "computer science", studyStyle: "in-person", url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Gordon_Ramsay_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled'}
  
  return (
    <div className={home.container}>
      <h1 className={home.title}>Welcome [name]</h1>
      <div className={home.matchContainer}>
        <Card profile={profile}></Card>
        <LikeRejectBtns profile={profile}/>
      </div>
    </div>
  )
  
};

export default Home