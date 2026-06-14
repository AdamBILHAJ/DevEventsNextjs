import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import Event from "@/database/event.model";
import sanitize from 'mongo-sanitize';
import sanitizeHtml from 'sanitize-html'; // 👈 Swapped here

//currently removed due to security reasons
// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();
// 
//         const formData = await req.formData();
//         
//         // 1. Build a clean payload map explicitly to preserve Mongoose validation hooks
//         const body: Record<string, any> = {
//             title: formData.get('title'),
//             description: formData.get('description'),
//             overview: formData.get('overview'),
//             venue: formData.get('venue'),
//             location: formData.get('location'),
//             date: formData.get('date'),
//             time: formData.get('time'),
//             mode: formData.get('mode'),
//             audience: formData.get('audience'),
//             organizer: formData.get('organizer'),
//         };
// 
//         // Deep sanitize parameters against query injection
//         const sanitizedEvent = sanitize(body);
// 
//         // 2. Added 'title' and 'venue' to the explicit XSS neutralization array
//         const textFieldsToSanitize = ['title', 'venue', 'description', 'overview', 'organizer', 'location', 'mode', 'audience'];
//         textFieldsToSanitize.forEach((field) => {
//             if (typeof sanitizedEvent[field] === 'string') {
//                 sanitizedEvent[field] = sanitizeHtml(sanitizedEvent[field].trim()// removed allowed tags because we don't use rich text editors
//                 );
//             }
//         });
// 
//         // 3. Process image parameters safely
//         const rawImage = formData.get('image');
//         if (!rawImage) {
//             return NextResponse.json({ message: 'Image is required' }, { status: 400 });
//         }
// 
//         const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
//         const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
// 
//         if (rawImage instanceof File && rawImage.size > 0) {
//             if (rawImage.size > MAX_IMAGE_BYTES) {
//                 return NextResponse.json({ message: 'Image is too large (Max 5MB)' }, { status: 413 });
//             }
//             if (!ALLOWED_IMAGE_TYPES.has(rawImage.type)) {
//                 return NextResponse.json({ message: 'Unsupported image type' }, { status: 400 });
//             }
//             // SDK start
//             const arrayBuffer = await rawImage.arrayBuffer();
//             const buffer = Buffer.from(arrayBuffer);
// 
//             try {
//                 const uploadResult = await new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream(
//                         { resource_type: 'image', folder: 'events' },
//                         (error, results) => {
//                             if (error) reject(error);
//                             else resolve(results);
//                         }
//                     );
//                     uploadStream.end(buffer);
//                 });
//                 // SDK finish
//                 // secure url from cloudinary doesn't need to be sanitized
//                 sanitizedEvent.image = (uploadResult as { secure_url: string }).secure_url;
//             } catch (uploadError) {
//                 console.error("Cloudinary Upload Failure:", uploadError);
//                 return NextResponse.json({ message: 'Image upload failed' }, { status: 502 });
//             }
//         } else {
//             // plain string urls should be sanitized (ex : javascript:alert(1))
//             sanitizedEvent.image = sanitizeHtml(rawImage.toString().trim());
//         }
// 
//         // 4. Isolated Array processing helper safely separate from object entry mutation risks
//         const processArrayField = (fieldName: string) => {
//             if (!formData.has(fieldName)) return [];
//             const rawElements = formData.getAll(fieldName);
//             // in case the we get a one element array in which that element is a broken array (string)
//             if (rawElements.length === 1 && typeof rawElements[0] === 'string' && rawElements[0].trim().startsWith('[')) {
//                 try {
//                     const parsedArray = JSON.parse(rawElements[0]);
//                     if (Array.isArray(parsedArray)) {
//                         return parsedArray.map(item => sanitizeHtml(sanitize(item).toString().trim()));
//                     }
//                 } catch { /* Fallback */ }
//             }
//             
//             return rawElements
//                 .filter(item => item.toString().trim() !== '')
//                 .map(item => sanitizeHtml(sanitize(item).toString().trim()));  
//         };
// 
//         sanitizedEvent.agenda = processArrayField('agenda');
//         sanitizedEvent.tags = processArrayField('tags');
// 
//         // 5. Attempt creation. If schema rules fail, catch blocks throw localized strings
//         const createdEvent = await Event.create(sanitizedEvent);
// 
//         return NextResponse.json(
//             { message: 'Event created successfully', event: createdEvent },
//             { status: 201 }
//         );
// 
//     } catch (e: any) {
//         console.error("API Error:", e);
//         
//         // Return clear validation message strings if Mongoose throws an error
//         if (e.name === 'ValidationError') {
//             const messages = Object.values(e.errors).map((err: any) => err.message);
//             return NextResponse.json({ message: messages.join(', ') }, { status: 400 });
//         }
// 
//         return NextResponse.json(
//             { message: 'Event creation failed', error: 'internal_server_error' },
//             { status: 500 }
//         );
//     }
// }
export async function GET(){
    try {
        await connectDB();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({ message : 'event fetched successfully', events }, {status: 200});
    } catch(e) {
        return NextResponse.json({ message: 'event fetching failed', error: 'internal_server_error' }, { status: 500 });
    }
}