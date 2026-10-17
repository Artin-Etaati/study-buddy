import home from "@/css/LoggedIn/Home.module.css"
import UserPreview from "./UserPreview";
import { supabase } from '@/services/supabase'
import { useEffect, useState } from "react";
import { UserAuth } from '@/AuthContext'

const Home = () => {
  const {userId} = UserAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [university, setUniversity] = useState("")

  useEffect(() => {

    async function getInfo() {
      const {data, error} = await supabase.from('profiles').select("first_name, last_name, university").eq('id', userId)
      if(error) {
        console.log("can't get info")
        return;
      }
      setName(data[0].first_name + " " + data[0].last_name)    
      setUniversity(data[0].university)
    }
    getInfo()

  }, [])


  return (
    <div className={home.container}>
      <h1 className={home.title}>Welcome {name}</h1>
      <h2>Attending {university}</h2>
      <div className={home.matchContainer}>
        <UserPreview />
      </div>
    </div>
  )
  
};

export default Home