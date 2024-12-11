import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import StartupCard, { StartupTypeCard } from './StartupCard'

const UserStartups = async ({email}:{email : string}) => {
  
   const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY,{
    email
   })

   console.log(startups);
   

    return (
   <>
     {startups.length> 0 ? startups.map((startup : StartupTypeCard)=>{
       return  <StartupCard key={startup._id} post={startup}/>
     }) : <p className='no-result'>No Posts</p>}
   </>
  )
}

export default UserStartups