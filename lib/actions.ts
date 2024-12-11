'use server'

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import slugify from 'slugify'
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";


export const createPitch = async (state : any, form : FormData, pitch : string)=>
{
    const session = await auth();
    if(!session) return parseServerActionResponse({error : 'Not Signed in', status : 'ERROR'})

    const user = await client.withConfig({useCdn : false}).fetch(AUTHOR_BY_EMAIL_QUERY,{
        email : session.user?.email,
      });


    
    
    const {title,description,category,link} = Object.fromEntries(Array.from(form).filter(([key])=> key !== 'pitch'));
    
    const slug = slugify(title as string,{lower : true,strict: true});

    try{
        const startup ={
            title,
            description,
            category,
            image : link,
            slug : {
                _type : slug,
                current : slug,
            },
            author :{
                _type : 'reference',
                _ref : user?._id,
                
            },
            pitch
        }

        const result = await writeClient.create({_type : 'startup', ...startup})
        return parseServerActionResponse({...result, error : '', status : 'SUCCESS'})
    
    } catch(err)
     {
        console.log(err);
     }
}