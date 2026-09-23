import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, User, Briefcase, CheckSquare } from 'lucide-react';
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
        
        // 🚨 NEW: allSettled ensures that if one database fails, the others still load perfectly!
        const [custRes, leadRes, taskRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/customers`, config),
          axios.get(`${API_BASE_URL}/api/leads`, config),
          axios.get(`${API_BASE_URL}/api/tasks`, config)
        ]);

        // Helper function to safely extract data even if the format is weird
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
        setErrorMsg('Failed to search database.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAllData, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, user]);

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setSearchTerm('');
  };

  const hasResults = results.customers.length > 0 || results.leads.length > 0 || results.tasks.length > 0;

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search customers, leads, tasks..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true); // 🚨 NEW: Forces the dropdown to open instantly upon typing
        }}
        onFocus={() => searchTerm.trim() && setIsOpen(true)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      />

      {isOpen && searchTerm.trim() && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-blue-500 text-center font-medium animate-pulse">Searching database...</div>
          ) : errorMsg ? (
            <div className="p-4 text-sm text-red-500 text-center font-medium">{errorMsg}</div>
          ) : !hasResults ? (
            <div className="p-4 text-sm text-gray-500 text-center">No results found for "{searchTerm}"</div>
          ) : (
            <div className="py-2">
              {results.customers.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Customers</div>
                  {results.customers.map(c => (
                    <button key={c._id} onClick={() => handleSelect('/customers')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 transition">
                      <User size={16} className="text-blue-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.leads.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Leads</div>
                  {results.leads.map(l => (
                    <button key={l._id} onClick={() => handleSelect('/leads')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 transition">
                      <Briefcase size={16} className="text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{l.name}</div>
                        <div className="text-xs text-gray-500">{l.company || 'No Company'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.tasks.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Tasks</div>
                  {results.tasks.map(t => (
                    <button key={t._id} onClick={() => handleSelect('/tasks')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 transition">
                      <CheckSquare size={16} className="text-green-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{t.title}</div>
                        <div className="text-xs text-gray-500">{t.status}</div>
                      </div>
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