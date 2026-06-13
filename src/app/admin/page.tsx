// app/admin/page.tsx
'use client';

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
  Sparkles 
} from "lucide-react";
import { UserButton, ClerkLoaded } from "@clerk/nextjs";

export default function AdminDashboard() {
  // Handle state logic here (e.g., fields, dynamic arrays for tags/agenda, events array)
  // Handle side-effects & submission here (form parsing -> FormData -> POST /api/events)

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
            <ClerkLoaded>
          <UserButton/>
          </ClerkLoaded>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Title Identity Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">System Registry</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Compile, validate, and commit event schemas safely into the centralized cluster platform layer.
          </p>
        </div>

        {/* Master Workspace Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Compilation Input Form (5 Columns Wide) */}
          <section className="xl:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create Document Structure</h2>
              <p className="text-xs text-neutral-400 mt-0.5">All configuration parameters must conform to Mongoose model checks.</p>
            </div>

            <form className="space-y-5">
              {/* Core Field Group */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Event Title</label>
                  <input 
                    type="text" 
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
                      <select className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none" required>
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
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Venue Location Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g., Amphi Radès" 
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                        required 
                      />
                      <Layers className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Physical/Virtual Coordinates</label>
                    <div className="relative">
                      <input 
                        type="text" 
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
                      placeholder="e.g., Security Club" 
                      className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Binary Media (Cover File)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 file:transition-all cursor-pointer bg-neutral-900 border border-neutral-800 rounded-lg py-1 px-2" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Overview Context (Max 500)</label>
                  <textarea 
                    maxLength={500}
                    placeholder="Provide compressed semantic context..." 
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 h-16 resize-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">Rich Text Description (Max 1000)</label>
                  <textarea 
                    maxLength={1000}
                    placeholder="Enter explicit string parameters or HTML tags..." 
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 h-24 resize-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    required
                  ></textarea>
                </div>

                {/* Array Input Fields Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-neutral-500" /> Tags Array
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="e.g., CTF" 
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500" 
                      />
                      <button type="button" className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Render tag array maps here */}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FileText className="h-3 w-3 text-neutral-500" /> Agenda Milestones
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="e.g., 09:00 - Phase Init" 
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500" 
                      />
                      <button type="button" className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Render agenda array maps here */}
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold font-sans tracking-wide transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-[0.99]">
                Execute Document Commit
              </button>
            </form>
          </section>

          {/* Right Block: live compiled entries (7 Columns Wide) */}
          <section className="xl:col-span-7 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Active Cluster Datastream</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Live documents inside the event collection grid.</p>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-300 border border-neutral-700">
                0 Records Cached
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
                  {/* Map database queries here. structural baseline template layout mockup row below: */}
                  <tr className="hover:bg-neutral-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-neutral-200 group-hover:text-indigo-400 transition-colors">
                          Operating Systems Scheduling Workshop
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-indigo-950/60 border border-indigo-900 text-indigo-400">
                            hybrid
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            Organizer: SysClub
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="font-mono text-xs">2026-04-05</span>
                        <span className="text-neutral-600 font-mono text-xs">|</span>
                        <Clock className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="font-mono text-xs">20:40</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Conditional programmatic conditional fallback text interface template hook: */}
              {/* <div className="text-center py-16 text-neutral-600 text-sm font-medium">No live structural documents tracked in MongoDB cluster execution lines.</div> */}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}