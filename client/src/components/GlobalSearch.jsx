import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, User, Briefcase, CheckSquare, X, Command, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ customers: [], leads: [], tasks: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shortcut key: Ctrl+K or Cmd+K to focus search input
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!searchTerm.trim() || !user?.token) {
        setResults({ customers: [], leads: [], tasks: [] });
        return;
      }
      
      setLoading(true);
      setErrorMsg('');
      
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [custRes, leadRes, taskRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/customers`, config),
          axios.get(`${API_BASE_URL}/api/leads`, config),
          axios.get(`${API_BASE_URL}/api/tasks`, config)
        ]);

        const getArray = (res) => {
          if (res.status !== 'fulfilled') return [];
          const data = res.value.data;
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.customers)) return data.customers;
          if (data && Array.isArray(data.leads)) return data.leads;
          if (data && Array.isArray(data.tasks)) return data.tasks;
          return [];
        };

        const customersData = getArray(custRes);
        const leadsData = getArray(leadRes);
        const tasksData = getArray(taskRes);

        const term = searchTerm.toLowerCase();

        setResults({
          customers: customersData.filter(c => c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term)),
          leads: leadsData.filter(l => l.name?.toLowerCase().includes(term) || l.company?.toLowerCase().includes(term)),
          tasks: tasksData.filter(t => t.title?.toLowerCase().includes(term))
        });
        
      } catch (error) {
        console.error("Search error", error);
        setErrorMsg('Failed to query records.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAllData, 250);
    return () => clearTimeout(debounce);
  }, [searchTerm, user]);

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setSearchTerm('');
  };

  const totalResults = results.customers.length + results.leads.length + results.tasks.length;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search records, leads, tasks..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => searchTerm.trim() && setIsOpen(true)}
          className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/90 rounded-xl pl-10 pr-20 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-xs"
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center space-x-1.5 pointer-events-none">
          {searchTerm ? (
            <button 
              type="button"
              onClick={() => setSearchTerm('')}
              className="pointer-events-auto p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-xs">
              <Command size={10} className="mr-0.5" /> K
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Results Dropdown */}
      {isOpen && searchTerm.trim() && (
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 max-h-[440px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {loading ? (
            <div className="p-6 text-sm text-blue-600 text-center font-medium flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Searching records...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-6 text-sm text-rose-500 text-center font-medium">{errorMsg}</div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No results found</p>
              <p className="text-xs text-slate-400 mt-1">No matches found for "{searchTerm}". Try a different keyword.</p>
            </div>
          ) : (
            <div className="py-2.5 divide-y divide-slate-100">
              {results.customers.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Customers</span>
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px]">{results.customers.length}</span>
                  </div>
                  {results.customers.map(c => (
                    <button 
                      key={c._id} 
                      onClick={() => handleSelect('/customers')} 
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50/80 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <User size={15} />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{c.name}</div>
                          <div className="text-xs text-slate-400 truncate">{c.email}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-500" />
                    </button>
                  ))}
                </div>
              )}

              {results.leads.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Leads</span>
                    <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full text-[10px]">{results.leads.length}</span>
                  </div>
                  {results.leads.map(l => (
                    <button 
                      key={l._id} 
                      onClick={() => handleSelect('/leads')} 
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50/80 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <Briefcase size={15} />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{l.name}</div>
                          <div className="text-xs text-slate-400 truncate">{l.company || 'Direct Contact'}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-500" />
                    </button>
                  ))}
                </div>
              )}

              {results.tasks.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Tasks</span>
                    <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full text-[10px]">{results.tasks.length}</span>
                  </div>
                  {results.tasks.map(t => (
                    <button 
                      key={t._id} 
                      onClick={() => handleSelect('/tasks')} 
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50/80 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <CheckSquare size={15} />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">{t.title}</div>
                          <div className="text-xs text-slate-400 truncate">{t.status}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;