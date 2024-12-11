import { auth } from '@/auth';
import { StartupCardSkeleton } from '@/components/StartupCard';
import UserStartups from '@/components/UserStartups';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_EMAIL_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

const page = async ({params} : {params : Promise<{email : string}>}) => {
    const email =(await params).email.replace("%40", "@");
    const session =await auth();
    const user = await client.fetch(AUTHOR_BY_EMAIL_QUERY,{
        email: session?.user.email
    });

    if(!user)  return notFound();

    return (
        <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.user.email === email ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            {/* <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense> */}

           <Suspense fallback={<StartupCardSkeleton/>}>
              <UserStartups email={email}/>
           </Suspense>
          </ul>
        </div>
      </section>
  )
}

export default page