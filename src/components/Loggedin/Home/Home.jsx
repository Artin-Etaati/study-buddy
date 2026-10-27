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
      const {data, error} = await supabase.rpc("get_info");
      if(error) {
        setError("Error fetching info")
        return;
      }
      setName(data[0].first_name + " " + data[0].last_name)
      setUniversity(data[0].university)
      setLoading(false)

    }
    getInfo()

  }, [])

  if(loading) return (<h2>Loading...</h2>)
  if(error) return (<h2>Error Occured {error}</h2>)
  return (
    <div className={home.container}>
      <h1 className={home.title}>Welcome {name}</h1>
      <h3 className={home.subtitle}>Checkout some people attending {university}</h3>
      <div className={home.matchContainer}>
        <UserPreview />
      </div>
    </div>
  )
  
};

export default Home