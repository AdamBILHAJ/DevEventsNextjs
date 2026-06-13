'use client';
import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Layers, 
  Globe, 
  Users, 
  Tag, 
  FileText, 
  Plus, 
  Sparkles,
  X
} from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically pull the UserButton with SSR disabled
const DynamicUserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  { ssr: false }
);
export default function AdminDashboard() {
    // --- Live Data States ---
const [events, setEvents] = useState<any[]>([]);
const [isLoadingEvents, setIsLoadingEvents] = useState(true);

// --- Fetch Collection on Mount ---
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (response.ok && data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Failed to parse datastream:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  fetchEvents();
}, []); // Empty array ensures this runs exactly once per page load
  // --- Form State Fields ---
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("online");
  const [audience, setAudience] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- Dynamic Array States ---
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const [agenda, setAgenda] = useState<string[]>([]);
  const [currentAgendaItem, setCurrentAgendaItem] = useState("");

  // --- Loading Status State ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Array Appending Handlers ---
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddAgenda = () => {
    if (currentAgendaItem.trim() && !agenda.includes(currentAgendaItem.trim())) {
      setAgenda([...agenda, currentAgendaItem.trim()]);
      setCurrentAgendaItem("");
    }
  };

  const handleRemoveAgenda = (indexToRemove: number) => {
    setAgenda(agenda.filter((_, idx) => idx !== indexToRemove));
  };

  // --- Network Payload Submission ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      alert("A cover image file banner is required.");
      return;
    }
    if (tags.length === 0) {
      alert("At least one tag is required by the schema.");
      return;
    }
    if (agenda.length === 0) {
      alert("At least one agenda milestone is required by the schema.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("mode", mode);
      formData.append("audience", audience);
      formData.append("venue", venue);
      formData.append("location", location);
      formData.append("organizer", organizer);
      formData.append("overview", overview);
      formData.append("description", description);
      formData.append("image", imageFile);

      // Serialize string arrays securely into JSON structures
      formData.append("tags", JSON.stringify(tags));
      formData.append("agenda", JSON.stringify(agenda));

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData, // Browser automatically formats boundaries for multipart streams
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to commit document schema.");
      }

      // Successful insertion: Trigger clean browser refresh to wipe values and update dashboard logs
      window.location.reload();

    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-wider uppercase text-neutral-200">Control Center</span>
            <span className="block text-[10px] font-mono tracking-widest text-indigo-400 uppercase leading-none mt-0.5">Admin Registry</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DynamicUserButton />
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">System Registry</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Compile, validate, and commit event schemas safely into the centralized cluster platform layer.
          </p>
        </div>

        {/* Master Workspace Split Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Compilation Input Form */}
          <section className="xl:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create Document Structure</h2>
              <p className="text-xs text-neutral-400 mt-0.5">All configuration parameters must conform to Mongoose model checks.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Event Title</label>
                  <input 
                    type="text" 
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced Kernel Exploitation Seminar" 
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Execution Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]" 
                        required 
                      />
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Execution Time</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]" 
                        required 
                      />
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Mode</label>
                    <div className="relative">
                      <select 
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none" 
                        required
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Target Audience</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g., IT Students, Red Teamers" 
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                        required 
                      />
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Venue Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g., Amphi Radès" 
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                        required 
                      />
                      <Layers className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Location Coordinates</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Tunis, TN or Discord" 
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                        required 
                      />
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Organizer Entity</label>
                    <input 
                      type="text" 
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      placeholder="e.g., Security Club" 
                      className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Cover Image (Max 5MB)</label>
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 file:transition-all cursor-pointer bg-neutral-900 border border-neutral-800 rounded-lg py-1 px-2" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Overview Context (Max 500)</label>
                  <textarea 
                    maxLength={500}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="Provide compressed semantic context..." 
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 h-16 resize-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Rich Text Description (Max 1000)</label>
                  <textarea 
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter explicit string parameters or HTML tags..." 
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 h-24 resize-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    required
                  ></textarea>
                </div>

                {/* Array Insertion Field Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-neutral-500" /> Tags Array <span className="text-indigo-400 text-[10px] lowercase">({tags.length} added)</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                        placeholder="Press Enter or click +" 
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500" 
                      />
                      <button type="button" onClick={handleAddTag} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Render active array elements */}
                    <div className="flex flex-wrap gap-1 mt-2 max-h-20 overflow-y-auto">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-300 text-[11px] border border-neutral-700 font-mono">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(idx)} className="text-neutral-500 hover:text-red-400 cursor-pointer">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FileText className="h-3 w-3 text-neutral-500" /> Agenda Milestones <span className="text-indigo-400 text-[10px] lowercase">({agenda.length} added)</span>
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={currentAgendaItem}
                        onChange={(e) => setCurrentAgendaItem(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAgenda(); } }}
                        placeholder="Press Enter or click +" 
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500" 
                      />
                      <button type="button" onClick={handleAddAgenda} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Render active agenda layout elements */}
                    <div className="flex flex-col gap-1 mt-2 max-h-20 overflow-y-auto">
                      {agenda.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center justify-between px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-300 text-[11px] border border-neutral-700">
                          <span className="truncate max-w-[140px]">{item}</span>
                          <button type="button" onClick={() => handleRemoveAgenda(idx)} className="text-neutral-500 hover:text-red-400 cursor-pointer ml-1">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-sm font-bold font-sans tracking-wide transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? "Executing Transaction..." : "Execute Document Commit"}
              </button>
            </form>
          </section>

          {/* Right Block: live compiled entries */}
<section className="xl:col-span-7 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
  <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
    <div>
      <h2 className="text-lg font-bold text-white tracking-tight">Active Cluster Datastream</h2>
      <p className="text-xs text-neutral-400 mt-0.5">Live documents inside the event collection grid.</p>
    </div>
    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-300 border border-neutral-700">
      {events.length} Records Cached
    </span>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-neutral-800 bg-neutral-900/40 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          <th className="px-6 py-3">Event Schema Specification</th>
          <th className="px-6 py-3">Scheduled Stamp</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-800/60">
        {isLoadingEvents ? (
          <tr>
            <td colSpan={2} className="px-6 py-8 text-center text-sm text-neutral-500 font-mono">
              Querying document cluster...
            </td>
          </tr>
        ) : events.length === 0 ? (
          <tr>
            <td colSpan={2} className="px-6 py-8 text-center text-sm text-neutral-500 font-mono">
              No documents active in collection index.
            </td>
          </tr>
        ) : (
          events.map((event) => (
            <tr key={event._id} className="hover:bg-neutral-900/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-200 group-hover:text-indigo-400 transition-colors">
                    {event.title}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-indigo-950/60 border border-indigo-900 text-indigo-400">
                      {event.mode}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      Organizer: {event.organizer}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                  <span className="font-mono text-xs">{event.date}</span>
                  <span className="text-neutral-600 font-mono text-xs">|</span>
                  <Clock className="h-3.5 w-3.5 text-neutral-500" />
                  <span className="font-mono text-xs">{event.time}</span>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</section>

        </div>
      </main>
    </div>
  );
}