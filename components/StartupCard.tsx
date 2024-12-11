import { cn, formatDate } from '@/lib/utils'
import { EyeIcon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Author, Startup } from '@/sanity/types'
import { Skeleton } from './ui/skeleton'

export type StartupTypeCard = Omit<Startup, "author"> & {author? : Author};
const StartupCard = ({post} : {post : StartupTypeCard}) => {

    
    return (
    <li className='startup-card group'>
      <div className='flex-between'>
         <p className='startup_vard_date'>
             {formatDate(post._createdAt)}
         </p>

         <div className='flex'>
            <EyeIcon className='size-6 text-primary' />
            <span className='px-2 text-16-medium'>{post.views===null ? 0 : post.views}</span>
         </div>
      </div>

      <div className='flex-between mt-5 gap-5'>
          <div className='flex-1'>
             <Link href={`/user/${post.author?._id}`}>
                <p className='text-16-medium line-clamp-1'>{post.author?.name}</p>
             </Link>

             <Link href={`/startup/${post?._id}`}>
                <h3 className='text-26-semibold line-clamp-1'>{post?.title}</h3>
             </Link>
          </div>

          <Link  href={`/user/${post.author?._id}`}>
            <Image src={post.author?.image} alt="user_image" className='rounded-full' width={48} height={48}/>
          </Link>
      </div>

      <Link href={`/startup/${post?._id}`}>
         <p className='startup-card_desc'> {post?.description}</p>
         <img src={post?.image} alt="startup_image" className='startup-card_img'/>
      </Link>

      <div className='flex-between gap-3 mt-5'>
        <Link href={`/query=${post?.category?.toLowerCase()}`}>
           <p className='text-16-medium'>{post?.category}</p>
        </Link>

        <Button className='startup-card_btn' asChild>
          <Link href={`/startup/${post?._id}`}>
             Details
          </Link>
        </Button>

      </div>
    </li>
  )
}

export const StartupCardSkeleton=()=>{
   return <>
     {
      [0,1,2,3,4].map((index:number)=>{
         <li key={cn('skeleton',index)}>
            <Skeleton className='startup-card_skeleton' />
         </li>
      })
     }
   </>
}

export default StartupCard