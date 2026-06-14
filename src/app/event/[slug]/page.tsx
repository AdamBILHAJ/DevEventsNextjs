import EventDetails from "@/components/EventDetails";
import NavBar from "@/components/NavBar";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const slug = params.then((p) => p.slug);

    return (
        <div>
            <NavBar/>
        <main>
                <EventDetails params={slug} />
        </main>
        </div>
    )
}
export default EventDetailsPage