import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '../../../../components/View';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';

const md = markdownit();

export const experimental_ppr = true;

const page = async ({params} : {params : Promise<{id : string}>}) => {
  
    const id = (await  params).id;

    const [post,{ select : editorPosts}] = await Promise.all([
      await client.fetch(STARTUP_BY_ID_QUERY, {id}),
      await client.fetch(PLAYLIST_BY_SLUG_QUERY,{
      slug : 'editors-choice',
    })]);   // Parallel Fetching since both are independent of each other

    if (!post) return notFound();
    
    const parsedcontent = md.render(post?.pitch || '');
    
    

    return (
    <>

    <section className='pink_container !min-h-[230px]'>
      <p className='tag'>{formatDate(post?._createdAt)}</p>
      <h1 className='heading'>{post.title}</h1>
      <p className='sub-heading !max-w-5xl'>{post.description}</p>
    </section>

    <section>
        <img src={post.image} alt='thumbnail' className='w-[80%] m-auto mt-4 h-auto rounded-xl'/>
    
       <div className='p-4 space-y-5 mt-10 max-w-4xl mx-auto'>
           <div className='flex-between gap-5'>
               <Link className='flex gap-2 items-center mb-3' href={`/user/${post.author?._id}`}>
                 <Image src={post.author.image}  height={64} width={64} className='!h-[4rem] rounded-full drop-shadow-lg' alt='avatar'/>
                 <div>
                     <p className='text-20-medium'>{post.author.name}</p>
                     <p className='text-16-medium !text-black-300'>@{post.author.username}</p>
                 </div>
               </Link>

              <p className='category-tag'>{post.category}</p> 
           </div>

            <h3 className='text-30-bold'>Pitch Details</h3>
             {parsedcontent ? (
                <article className='prose max-w-4xl font-work-sans break-all' dangerouslySetInnerHTML={{__html : parsedcontent}}/>
             ) : (
                <p className='no-result'>No details provided</p>
             )}
       </div>

       <hr className='divider w-[95%]'/>

       {editorPosts?.length> 0 && (
          <div className='max-w-4xl mx-auto'>
             <p className='text-30-semibold px-4'>
                 Editor Picks
             </p>

             <ul className='mt-7 card_grid-sm p-4'>
                {editorPosts.map((post : StartupTypeCard, index : number)=>{
                  return <StartupCard key ={index} post ={post}/>
                })}
             </ul>
          </div>
       )}

       <Suspense fallback={  <Skeleton className='view_skeleton'/>}>
         <View id={id}/>
       </Suspense>

    </section>




  

    </>
  )
}

export default page