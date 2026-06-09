import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import sanitize from 'mongo-sanitize';
type Context = {
  params: Promise<{ slug: string }>; // Typed as a Promise in Next.js 16
};

export async function GET(request: NextRequest, context: Context){
    try{
    const {slug} = await context.params
    const trimmedSlug = String(slug).trim();
    // Matches only alphanumeric characters and hyphens, between 1 and 100 characters long
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(trimmedSlug)|| trimmedSlug.length > 150) {
    return NextResponse.json(
    { message: 'event not found' },
    { status: 404 }
    );}
    // Strips out keys like $gt, $ne, $where from the input completely
    const cleanSlug = sanitize(trimmedSlug);
    connectDB()
    const event = await Event.findOne({slug : cleanSlug}) // findOne: Mongoose method return an array of documents that's why IEvent won't match
    if (!event) {
      return NextResponse.json(
        { message: `Event not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({
                message : 'event fetched successfully',
                event
            },
        {status: 200})
    }
    catch(e){
        return NextResponse.json({ 
                        message: 'event fetching failed',
                        error: e instanceof Error ? e.message : 'unknown' 
                    },
                    { status: 500 })
    }
}