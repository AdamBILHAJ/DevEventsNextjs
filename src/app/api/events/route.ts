import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Event from "@/database/event.model";
import sanitize from 'mongo-sanitize';
import sanitizeHtml from 'sanitize-html'; // 👈 Swapped here

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        let rawEvent: Record<string, any>;

        try {
            rawEvent = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        const sanitizedEvent = sanitize(rawEvent);

        // Neutralize XSS threats using server-native sanitize-html
        const textFieldsToSanitize = ['description', 'overview', 'organizer', 'location', 'mode', 'audience'];
        textFieldsToSanitize.forEach((field) => {
            if (typeof sanitizedEvent[field] === 'string') {
                sanitizedEvent[field] = sanitizeHtml(sanitizedEvent[field], {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]), // customize if you allow rich text tags
                });
            }
        });

        const rawImage = formData.get('image');
        if (!rawImage) {
            return NextResponse.json({ message: 'image required' }, { status: 400 });
        }

        const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
        const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

        if (rawImage instanceof File && rawImage.size > 0) {
            if (rawImage.size > MAX_IMAGE_BYTES) {
                return NextResponse.json({ message: 'image too large' }, { status: 413 });
            }
            if (!ALLOWED_IMAGE_TYPES.has(rawImage.type)) {
                return NextResponse.json({ message: 'unsupported image type' }, { status: 400 });
            }
            const arrayBuffer = await rawImage.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'events' },
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }
                ).end(buffer);
            });

            sanitizedEvent.image = (uploadResult as { secure_url: string }).secure_url;
        } else {
            // Clean plain string URLs cleanly
            sanitizedEvent.image = sanitizeHtml(rawImage.toString());
        }

        const processArrayField = (fieldName: string) => {
            if (!formData.has(fieldName)) return undefined;
            const rawElements = formData.getAll(fieldName);
            
            if (rawElements.length === 1 && typeof rawElements[0] === 'string' && rawElements[0].trim().startsWith('[')) {
                try {
                    const parsedArray = JSON.parse(rawElements[0]);
                    if (Array.isArray(parsedArray)) {
                        return parsedArray.map(item => sanitizeHtml(sanitize(item).toString()));
                    }
                } catch { /* Fallback */ }
            }
            
            return rawElements.map(item => sanitizeHtml(sanitize(item).toString()));  
        };

        if (formData.has('agenda')) sanitizedEvent.agenda = processArrayField('agenda');
        if (formData.has('tags')) sanitizedEvent.tags = processArrayField('tags');

        const createdEvent = await Event.create(sanitizedEvent);

        return NextResponse.json(
            { message: 'event created successfully', event: createdEvent },
            { status: 201 }
        );

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json(
            { message: 'event creation failed', error: 'internal_server_error' },
            { status: 500 }
        );
    }
}

export async function GET(){
    try {
        await connectDB();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({ message : 'event fetched successfully', events }, {status: 200});
    } catch(e) {
        console.error("Database Fetch Error:", e);
        return NextResponse.json({ message: 'event fetching failed', error: 'internal_server_error' }, { status: 500 });
    }
}
