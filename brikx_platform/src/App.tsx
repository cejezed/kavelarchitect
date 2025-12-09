
import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { Listing, DashboardStats } from './types';
import { StatsRow } from './components/StatsRow';
import { ListingCard } from './components/ListingCard';
import { ListingDrawer } from './components/ListingDrawer';
import { CustomersView } from './components/CustomersView';
import { PublishedView } from './components/PublishedView';
import { LoginScreen } from './components/LoginScreen';
import { LayoutGrid, Loader2, RefreshCw, Wifi, WifiOff, Users, Globe, DownloadCloud, CheckCircle2, AlertTriangle, XCircle, LayoutTemplate, LogOut, Plus } from 'lucide-react';

type View = 'dashboard' | 'customers' | 'published';

function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Check session storage for login persistence
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('brikx_auth');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('brikx_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('brikx_auth');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    if (!stats) setIsLoading(true);

    try {
      const [listingsData, statsData] = await Promise.all([
        api.getPendingListings(),
        api.getStats()
      ]);
      setListings(listingsData);
      setStats(statsData);
      setIsLive(api.isConnected());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [currentView, isAuthenticated]);

  const handleListingProcessed = () => {
    fetchData();
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await api.triggerSync();
      await fetchData();
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return 'Nooit';
    const date = new Date(isoString);
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  const renderSyncStatus = () => {
    if (!stats) return null;
    const { status, message } = stats.syncStatus;

    let icon = <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
    let colorClass = "text-slate-500 border-slate-200 bg-slate-50";

    if (status === 'ok') {
      icon = <CheckCircle2 size={14} className="text-emerald-600" />;
      colorClass = "text-emerald-700 border-emerald-200 bg-emerald-50";
    } else if (status === 'error') {
      icon = <XCircle size={14} className="text-red-600" />;
      colorClass = "text-red-700 border-red-200 bg-red-50";
    } else if (status === 'warning') {
      icon = <AlertTriangle size={14} className="text-amber-600" />;
      colorClass = "text-amber-700 border-amber-200 bg-amber-50";
    }

    return (
      <div className={`flex items-center px-2 py-1.5 rounded-lg border text-xs font-medium ${colorClass}`} title={message}>
        <span className="mr-2">Gmail:</span>
        {icon}
      </div>
    );
  };

  // 1. Show Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 2. Show Dashboard
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-serif italic">B</span>
            Brikx
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Kavel & Match</p>
        </div>

        <nav className="px-3 mt-6 space-y-1 flex-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutGrid size={18} className="mr-3" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('customers')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group ${currentView === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Users size={18} className="mr-3" />
            <span className="font-medium">Klanten</span>
          </button>

          <button
            onClick={() => setCurrentView('published')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors group ${currentView === 'published' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Globe size={18} className="mr-3" />
            <span className="font-medium">Gepubliceerd</span>
          </button>
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center px-3 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium"
          >
            <LayoutTemplate size={16} className="mr-3 text-emerald-400" />
            Naar KavelArchitect.nl
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-red-900/30 transition-colors text-sm font-medium"
          >
            <LogOut size={16} className="mr-3" />
            Uitloggen
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-sm font-medium">Architect</p>
              <p className="text-xs text-slate-500">Zwijsen</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">

        {/* Top Header Mobile only */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <h1 className="font-bold text-slate-900">Brikx Dashboard</h1>
          <button onClick={fetchData} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-10">

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
            <div>
              {currentView === 'dashboard' ? (
                <>
                  <h2 className="text-2xl font-bold text-slate-900">Overzicht</h2>
                  <p className="text-slate-500 mt-1">Beheer binnengekomen Funda kavels en matches.</p>
                </>
              ) : currentView === 'customers' ? (
                <div></div>
              ) : (
                <div></div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {renderSyncStatus()}

              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${isLive
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                title={isLive ? "Verbonden met Python Backend" : "Verbinding mislukt, toont demo data"}
              >
                {isLive ? <Wifi size={14} className="mr-2" /> : <WifiOff size={14} className="mr-2" />}
                {isLive ? 'Live' : 'Demo'}
              </div>

              {stats && (
                <div className="text-xs text-slate-400 font-medium px-2">
                  Laatst gecheckt: <span className="text-slate-600">{formatTime(stats.lastUpdated)}</span>
                </div>
              )}

              <button
                onClick={async () => {
                  const url = window.prompt("Plak de Funda URL hier:");
                  if (url) {
                    setIsSyncing(true);
                    try {
                      const res = await api.addManualListing(url);
                      if (res.success) {
                        alert("Kavel succesvol toegevoegd!");
                        await fetchData();
                      } else {
                        alert("Fout: " + res.message);
                      }
                    } catch (e) {
                      alert("Er ging iets mis.");
                      console.error(e);
                    } finally {
                      setIsSyncing(false);
                    }
                  }
                }}
                disabled={isSyncing}
                className="flex items-center text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus size={16} className="mr-2" />
                Nieuwe Kavel
              </button>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <DownloadCloud size={16} className="mr-2" />
                )}
                Check Funda
              </button>
            </div>
          </div>

          {/* VIEW ROUTER */}
          {currentView === 'customers' ? (
            <CustomersView />
          ) : currentView === 'published' ? (
            <PublishedView />
          ) : (
            <>
              {isLoading && !stats ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 size={40} className="animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  {stats && <StatsRow stats={stats} />}

                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Pending Listings ({listings.length})</h3>
                    {listings.length > 0 && (
                      <button
                        onClick={async () => {
                          const sites = ['kavelarchitect', 'zwijsen'];
                          const confirmed = window.confirm(`Weet je zeker dat je alle ${listings.length} kavels wilt publiceren op ${sites.join(' & ')}?`);
                          if (!confirmed) return;

                          setIsSyncing(true);
                          try {
                            const res = await api.publishAllPending(sites);
                            if (res.success) {
                              alert(`Succes! ${res.count} kavels gepubliceerd.`);
                              await fetchData();
                            } else {
                              alert("Fout: " + res.message);
                            }
                          } catch (e) {
                            alert("Er ging iets mis.");
                            console.error(e);
                          } finally {
                            setIsSyncing(false);
                          }
                        }}
                        disabled={isSyncing}
                        className="flex items-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-2 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSyncing ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 size={16} className="mr-2" />
                        )}
                        Publiceer Alles
                      </button>
                    )}
                  </div>

                  {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500 font-medium">Geen nieuwe kavels gevonden.</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Klik op 'Check Funda' om handmatig te zoeken.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                      {listings.map(listing => (
                        <ListingCard
                          key={listing.kavel_id}
                          listing={listing}
                          onClick={setSelectedListing}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </main>

      <ListingDrawer
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onProcessed={handleListingProcessed}
      />
    </div>
  );
}

export default App;
