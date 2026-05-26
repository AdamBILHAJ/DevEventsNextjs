import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Event from "@/database/event.model";



/**
 * Handles incoming POST requests to create a new event.
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Establish connection to MongoDB Atlas
        await connectDB();

        // 2. Extract and parse Multipart Form Data
        const formData = await req.formData();
        let event: Record<string, any>;

        try {
            // 3. Convert FormData to flat JS object
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json(
                { message: 'Invalid data format' },
                { status: 400 }
            );
        }

        // Get raw image data without assuming its type upfront
        const rawImage = formData.get('image');
        if (!rawImage) {
            return NextResponse.json({ message: 'image required' }, { status: 400 });
        }

        // 4. Handle file uploads vs plain URL string inputs
        if (rawImage instanceof File && rawImage.size > 0) {
            // Process binary stream upload to Cloudinary
            const arrayBuffer = await rawImage.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'events' }, // Corrected spelling
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }
                ).end(buffer);
            });

            // Set the absolute secure URL string returned by Cloudinary cloud servers
            event.image = (uploadResult as { secure_url: string }).secure_url;
        } else {
            // It is an image URL string passed via testing tool/frontend, pass it directly
            event.image = rawImage.toString();
        }

        // 5. Array parsing fallback (HTTPie array form values conversion check)
        // This ensures if agenda and tags were grouped, they aren't lost by fromEntries
        if (formData.has('agenda')) event.agenda = formData.getAll('agenda');
        if (formData.has('tags')) event.tags = formData.getAll('tags');

        // 6. Insert parsed document record to MongoDB database cluster collection
        const createdEvent = await Event.create(event);

        // 7. Explicit success response returning payload matching structure definitions
        return NextResponse.json(
            { 
                message: 'event created successfully', 
                event: createdEvent 
            },
            { status: 201 }
        );

    } catch (e) {
        // 8. Error management catching system validation and connection drop failures
        console.error("API Error:", e);

        return NextResponse.json(
            { 
                message: 'event creation failed',
                error: e instanceof Error ? e.message : 'unknown' 
            },
            { status: 500 }
        );
    }
}