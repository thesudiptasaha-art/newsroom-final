'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RundownApp() {
  const [contents, setContents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    const { data } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setContents(data);
  }

  async function updateStatus(id, nextStatus) {
    const { error } = await supabase
      .from('contents')
      .update({ status: nextStatus })
      .eq('id', id);

    if (!error) {
      setContents(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
      if (selectedItem?.id === id) {
        setSelectedItem(prev => ({ ...prev, status: nextStatus }));
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              NewsroomOps
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Daily Rundown</span>
          </div>
          <button 
            onClick={fetchContents}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700"
          >
            Refresh Data
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Content ID</th>
                  <th className="py-3 px-4">Slug Name</th>
                  <th className="py-3 px-4">Writer</th>
                  <th className="py-3 px-4">Editor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-400">{item.content_uid}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="font-medium hover:text-blue-400 transition-colors text-left"
                      >
                        {item.slug_name}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.writer_name || '—'}</td>
                    <td className="py-3 px-4 text-slate-300">{item.editor_name || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800 font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status === 'Ready for Shoot' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'Shooting')}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded font-medium shadow"
                        >
                          Start Shoot
                        </button>
                      )}
                      {item.status === 'Shooting' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'Assign Editor')}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded font-medium shadow"
                        >
                          Shoot Complete
                        </button>
                      )}
                      {item.status === 'Assign Editor' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'Editing')}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1 rounded font-medium shadow"
                        >
                          Start Editing
                        </button>
                      )}
                      {item.status === 'Editing' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'Video Review')}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1 rounded font-medium shadow"
                        >
                          Submit Video
                        </button>
                      )}
                      {item.status === 'Video Review' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'Published')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 rounded font-medium shadow"
                        >
                          Approve Video
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedItem && (
        <aside className="w-96 border-l border-slate-800 bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-blue-400">{selectedItem.content_uid}</span>
                <h2 className="text-lg font-bold">{selectedItem.slug_name}</h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold">Title</label>
                <p className="text-sm mt-1">{selectedItem.title}</p>
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold">Current Status</label>
                <div className="mt-1">
                  <span className="text-xs px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold">Raw Footage Folder</label>
                <input 
                  type="text" 
                  readOnly 
                  value={selectedItem.raw_footage_url || 'No link added'} 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-sm py-2 rounded font-medium"
            >
              Close Drawer
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
