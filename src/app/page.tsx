import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database/event.model"
// no need to import react , it is done by default
// 1. Force a reliable fallback if Vercel fails to read the environment variables
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL !== 'undefined'
  ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '') // Strips trailing slash if present
  : 'https://dev-events-bay-psi.vercel.app';
// in nextjs 16 server pages could be completely async
const page = async () => {
  // 2. Log it out to the Vercel Runtime console during live rendering to confirm what it evaluates to
  console.log("Current Context Target URL:", `${BASE_URL}/api/events`);
  const response = await fetch(`${BASE_URL}/api/events`)
  const {events} = await response.json()
  return (
    <>
    <section><h1 className="text-center">The Hub for every Dev <br />Event you can't miss</h1>
    <p className="text-center mt-5">Hackathons, Meetups and Conferences all in one place.</p>
    <ExploreBtn/>
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        {events && events.length > 0 && events.map((event:IEvent)=>(
          <li key={event.title}><EventCard {...event}/></li>   
        ))}
      </ul>
    </div>
    </section>

    </>
    
  )
}

export default page
