import React, { useState } from 'react'
import { UserAuth } from '../AuthContext'
import { useNavigate, Navigate} from 'react-router-dom';
import classes from './Dashboard.module.css'
import Card from "../components/Card.jsx"
import home from "../css/Home.module.css"
const Home = () => {
  
  const profile = {name: "Gordon Ramsay", age: 20, major: "computer science", studyStyle: "in-person", url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Gordon_Ramsay_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled'}
  
  return (
    <div className={home.container}>
      <h1 className={home.title}>Welcome [name]</h1>
      <div className={home.matchContainer}>
        <Card profile={profile}></Card>
      </div>
    </div>
  )
  
};

export default Home