import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Event from "@/database/event.model";
import sanitize from 'mongo-sanitize';
import DOMPurify from 'isomorphic-dompurify'; // Imported for XSS Protection

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

        // 1. Neutralize NoSQL Injection threats
        const sanitizedEvent = sanitize(rawEvent);

        // 2. Neutralize XSS threats (Sanitize text fields)
        // Explicitly sanitize rich text or string variables before database persistence
        const textFieldsToSanitize = ['description', 'overview', 'organizer', 'location', 'mode', 'audience'];
        textFieldsToSanitize.forEach((field) => {
            if (typeof sanitizedEvent[field] === 'string') {
                sanitizedEvent[field] = DOMPurify.sanitize(sanitizedEvent[field]);
            }
        });

        // Handle Image upload checks safely
        const rawImage = formData.get('image');
        if (!rawImage) {
            return NextResponse.json({ message: 'image required' }, { status: 400 });
        }

        const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
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
            // If it's a raw string URL passed manually, sanitize it to prevent javascript: pseudo-protocol XSS
            sanitizedEvent.image = DOMPurify.sanitize(rawImage.toString());
        }

        // 3. Handle array parsing securely
        const processArrayField = (fieldName: string) => {
            if (!formData.has(fieldName)) return undefined;
            
            const rawElements = formData.getAll(fieldName);
            
            // Check if the first element is a stringified JSON array wrapper
            if (rawElements.length === 1 && typeof rawElements[0] === 'string' && rawElements[0].trim().startsWith('[')) {
                try {
                    const parsedArray = JSON.parse(rawElements[0]);
                    if (Array.isArray(parsedArray)) {
                        return parsedArray.map(item => DOMPurify.sanitize(sanitize(item).toString()));
                    }
                } catch { /* Fallback to standard mapping if parsing fails */ }
            }
            
            return rawElements.map(item => DOMPurify.sanitize(sanitize(item).toString()));  
        };

        if (formData.has('agenda')) sanitizedEvent.agenda = processArrayField('agenda');
        if (formData.has('tags')) sanitizedEvent.tags = processArrayField('tags');

        // 4. Create the document safely using the fully cleaned data object
        const createdEvent = await Event.create(sanitizedEvent);

        return NextResponse.json(
            { message: 'event created successfully', event: createdEvent },
            { status: 201 }
        );

    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json(
            { 
                message: 'event creation failed',
                error: 'internal_server_error' 
            },
            { status: 500 }
        );
    }
}
export async function GET(){
    try{
        await connectDB()
        const events = await Event.find().sort({createdAt: -1})
        return NextResponse.json({
            message : 'event fetched successfully',
            events
        },
    {status: 200})
    }
    catch(e){
        return NextResponse.json({ 
                message: 'event fetching failed',
                error: 'internal_server_error' 
            },
            { status: 500 })
    }
}