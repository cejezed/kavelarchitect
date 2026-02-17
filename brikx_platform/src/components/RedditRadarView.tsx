import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { RedditPost, RedditPostStatus, RedditScanStats, RedditSettings } from '../types';
import {
  RefreshCw,
  Loader2,
  Rss,
  Settings as SettingsIcon,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
  Eye,
  Ban,
  MessageSquareQuote
} from 'lucide-react';

const DEFAULT_STARTER_SET = [
  'klussers',
  'thenetherlands',
  'Netherlands',
  'Amsterdam',
  'Utrecht',
  'Rotterdam',
  'DenHaag',
  'Eindhoven'
];

const QUESTION_SIGNALS = [
  'hoe',
  'waarom',
  'mag ik',
  'kosten',
  'ervaring'
];

const statusLabel = (status: RedditPostStatus) => {
  switch (status) {
    case 'new':
      return 'Nieuw';
    case 'seen':
      return 'Bekeken';
    case 'answered':
      return 'Beantwoord';
    case 'ignored':
      return 'Negeren';
  }
};

const statusBadge = (status: RedditPostStatus) => {
  if (status === 'new') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'seen') return 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === 'answered') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const scoreBadge = (score: number) => {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700';
  if (score >= 60) return 'bg-blue-100 text-blue-700';
  if (score >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

export const RedditRadarView: React.FC = () => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [settings, setSettings] = useState<RedditSettings | null>(null);
  const [stats, setStats] = useState<RedditScanStats | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RedditPostStatus | 'all'>('all');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  const [newSubreddit, setNewSubreddit] = useState('');
  const [includeKeywordsInput, setIncludeKeywordsInput] = useState('');
  const [excludeKeywordsInput, setExcludeKeywordsInput] = useState('');

  const fetchRadarData = async () => {
    setIsLoading(true);
    try {
      const [postsData, settingsData, statsData] = await Promise.all([
        api.getRedditPosts(),
        api.getRedditSettings(),
        api.getRedditStats()
      ]);
      setPosts(postsData);
      setSettings(settingsData);
      setStats(statsData);
      setIncludeKeywordsInput(settingsData.includeKeywords.join(', '));
      setExcludeKeywordsInput(settingsData.excludeKeywords.join(', '));
    } catch (error) {
      console.error('Failed to fetch Reddit Radar data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarData();
  }, []);

  const inboxCount = useMemo(() => posts.filter(p => p.status === 'new').length, [posts]);

  const duplicateTitleSet = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach(post => {
      const key = post.title.trim().toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return new Set(Array.from(counts.entries()).filter(([, count]) => count > 1).map(([title]) => title));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (statusFilter !== 'all' && post.status !== statusFilter) return false;
      if (showDuplicatesOnly && !duplicateTitleSet.has(post.title.trim().toLowerCase())) return false;
      return true;
    });
  }, [posts, statusFilter, showDuplicatesOnly, duplicateTitleSet]);

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      await api.triggerRedditScan();
      await fetchRadarData();
    } finally {
      setIsScanning(false);
    }
  };

  const updateStatus = async (postId: string, status: RedditPostStatus) => {
    await api.updateRedditPostStatus(postId, status);
    setPosts(prev => prev.map(post => (post.id === postId ? { ...post, status } : post)));
  };

  const handleAddSubreddit = () => {
    if (!settings || !newSubreddit.trim()) return;
    const name = newSubreddit.trim().replace(/^r\//i, '');
    if (settings.subreddits.find(s => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSubreddit('');
      return;
    }
    const updated = {
      ...settings,
      subreddits: [...settings.subreddits, { name, enabled: true }]
    };
    setSettings(updated);
    setNewSubreddit('');
  };

  const handleToggleSubreddit = (name: string) => {
    if (!settings) return;
    const updated = {
      ...settings,
      subreddits: settings.subreddits.map(sub =>
        sub.name === name ? { ...sub, enabled: !sub.enabled } : sub
      )
    };
    setSettings(updated);
  };

  const handleStarterSet = () => {
    if (!settings) return;
    const updated = {
      ...settings,
      subreddits: DEFAULT_STARTER_SET.map(name => ({ name, enabled: true })),
      starterSetEnabled: true
    };
    setSettings(updated);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const payload: RedditSettings = {
        ...settings,
        includeKeywords: includeKeywordsInput.split(',').map(k => k.trim()).filter(Boolean),
        excludeKeywords: excludeKeywordsInput.split(',').map(k => k.trim()).filter(Boolean)
      };
      const updated = await api.updateRedditSettings(payload);
      setSettings(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (text: string, fallbackMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      alert(fallbackMessage);
    }
  };

  const handleEnsureSummary = async (postId: string) => {
    const updated = await api.ensureRedditSummary(postId);
    if (updated) {
      setPosts(prev => prev.map(post => (post.id === postId ? { ...post, ...updated } : post)));
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reddit Question Radar</h2>
          <p className="text-slate-500">
            Vindt Nederlandse vragen over (ver)bouw, vergunningen en kosten. V1 draait via RSS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScanNow}
            disabled={isScanning}
            className="flex items-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg shadow-sm disabled:opacity-70"
          >
            {isScanning ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Scan nu
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Rss size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Inbox digest</p>
              <p className="text-xs text-slate-500">
                {stats?.lastRun ? `Laatste scan: ${new Date(stats.lastRun).toLocaleString('nl-NL')}` : 'Nog geen scan'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Nieuwe posts: {stats?.newPosts ?? 0}
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Scans: {stats?.totalScanned ?? 0}
            </span>
            <span className={`px-2 py-1 rounded-full font-medium ${stats?.rateLimited ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {stats?.rateLimited ? 'Rate limited' : 'Polite mode ok'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${activeTab === 'inbox' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Inbox ({inboxCount})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            Instellingen
          </button>
        </div>

        {activeTab === 'inbox' ? (
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Filter:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full font-semibold ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Alle
              </button>
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-3 py-1 rounded-full font-semibold ${statusFilter === 'new' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Nieuw
              </button>
              <button
                onClick={() => setStatusFilter('seen')}
                className={`px-3 py-1 rounded-full font-semibold ${statusFilter === 'seen' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Bekeken
              </button>
              <button
                onClick={() => setStatusFilter('answered')}
                className={`px-3 py-1 rounded-full font-semibold ${statusFilter === 'answered' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Beantwoord
              </button>
              <button
                onClick={() => setStatusFilter('ignored')}
                className={`px-3 py-1 rounded-full font-semibold ${statusFilter === 'ignored' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Negeren
              </button>
              <label className="flex items-center gap-2 ml-auto text-slate-600">
                <input
                  type="checkbox"
                  checked={showDuplicatesOnly}
                  onChange={(e) => setShowDuplicatesOnly(e.target.checked)}
                />
                Alleen duplicaten
              </label>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Geen relevante Reddit-posts gevonden.
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">r/{post.subreddit}</span>
                        <span>{new Date(post.createdAt).toLocaleString('nl-NL')}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusBadge(post.status)}`}>
                          {statusLabel(post.status)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreBadge(post.score)}`}>
                          Score {post.score}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{post.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {post.summary || 'Nog geen samenvatting. Klik op "Analyseer" om er een te genereren.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={async () => {
                          if (!post.hasSummary) {
                            await handleEnsureSummary(post.id);
                          }
                          window.open(post.url, '_blank');
                        }}
                        className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Open op Reddit
                      </button>
                      <button
                        onClick={() => handleCopy(post.url, 'Kopieer de link handmatig.')}
                        className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy link
                      </button>
                      <button
                        onClick={async () => {
                          if (!post.hasSummary) {
                            await handleEnsureSummary(post.id);
                          }
                          handleCopy(post.suggestedReply.join('\n'), 'Kopieer het antwoord handmatig.');
                        }}
                        className="inline-flex items-center px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        <MessageSquareQuote size={14} className="mr-2" />
                        Copy antwoord
                      </button>
                      {!post.hasSummary && (
                        <button
                          onClick={() => handleEnsureSummary(post.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                        >
                          Analyseer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waar gaat dit echt over?</p>
                      <p className="text-sm text-slate-700 mt-1">{post.topic || '-'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wat mist er nog?</p>
                      <ul className="text-sm text-slate-700 mt-1 space-y-1">
                        {post.followupQuestions.length === 0 ? (
                          <li>• -</li>
                        ) : post.followupQuestions.map((q, idx) => (
                          <li key={`${post.id}-q-${idx}`}>• {q}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Antwoord-suggestie</p>
                      <ul className="text-sm text-slate-700 mt-1 space-y-1">
                        {post.suggestedReply.length === 0 ? (
                          <li>• -</li>
                        ) : post.suggestedReply.map((q, idx) => (
                          <li key={`${post.id}-a-${idx}`}>• {q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(post.id, 'seen')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full"
                    >
                      <Eye size={12} className="mr-2" />
                      Bekeken
                    </button>
                    <button
                      onClick={() => updateStatus(post.id, 'answered')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-full"
                    >
                      <CheckCircle2 size={12} className="mr-2" />
                      Beantwoord
                    </button>
                    <button
                      onClick={() => updateStatus(post.id, 'ignored')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-full"
                    >
                      <Ban size={12} className="mr-2" />
                      Negeren
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {!settings ? null : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <SettingsIcon size={16} className="text-blue-600" />
                        <h3 className="font-semibold text-slate-900">Subreddits</h3>
                      </div>
                      <button
                        onClick={handleStarterSet}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Starter set NL
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {settings.subreddits.map(sub => (
                        <button
                          key={sub.name}
                          onClick={() => handleToggleSubreddit(sub.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            sub.enabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          r/{sub.name}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newSubreddit}
                        onChange={(e) => setNewSubreddit(e.target.value)}
                        placeholder="Nieuwe subreddit (zonder r/)"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={handleAddSubreddit}
                        className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg"
                      >
                        Voeg toe
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600" />
                      <h3 className="font-semibold text-slate-900">Frequentie</h3>
                    </div>
                    <label className="text-xs text-slate-500">Scan interval (min)</label>
                    <input
                      type="number"
                      value={settings.scanIntervalMins}
                      onChange={(e) => setSettings({ ...settings, scanIntervalMins: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="text-xs text-slate-500">Max posts per run</label>
                    <input
                      type="number"
                      value={settings.maxPostsPerRun}
                      onChange={(e) => setSettings({ ...settings, maxPostsPerRun: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="text-xs text-slate-500">Max items per feed</label>
                    <input
                      type="number"
                      value={settings.maxItemsPerFeed || 25}
                      onChange={(e) => setSettings({ ...settings, maxItemsPerFeed: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.politeMode}
                        onChange={(e) => setSettings({ ...settings, politeMode: e.target.checked })}
                      />
                      Polite mode (jitter + backoff)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500">Jitter (sec)</label>
                        <input
                          type="number"
                          value={settings.jitterSeconds || 0}
                          onChange={(e) => setSettings({ ...settings, jitterSeconds: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Backoff (sec)</label>
                        <input
                          type="number"
                          value={settings.backoffSeconds || 0}
                          onChange={(e) => setSettings({ ...settings, backoffSeconds: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">Keywords & filters</h3>
                    <label className="text-xs text-slate-500">Include keywords</label>
                    <textarea
                      value={includeKeywordsInput}
                      onChange={(e) => setIncludeKeywordsInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="text-xs text-slate-500">Exclude keywords</label>
                    <textarea
                      value={excludeKeywordsInput}
                      onChange={(e) => setExcludeKeywordsInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="text-xs text-slate-500">Vraag-signalen</label>
                    <div className="flex flex-wrap gap-2">
                      {QUESTION_SIGNALS.map(signal => (
                        <label key={signal} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={settings.questionSignals.includes(signal)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...settings.questionSignals, signal]
                                : settings.questionSignals.filter(s => s !== signal);
                              setSettings({ ...settings, questionSignals: updated });
                            }}
                          />
                          {signal}
                        </label>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.languageFilterNl}
                        onChange={(e) => setSettings({ ...settings, languageFilterNl: e.target.checked })}
                      />
                      Alleen Nederlands (taalfilter)
                    </label>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">AI-instellingen</h3>
                    <label className="text-xs text-slate-500">Modelkeuze</label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (budget)</option>
                      <option value="gpt-4o">gpt-4o (kwaliteit)</option>
                      <option value="claude-3.5">claude-3.5 (alternatief)</option>
                    </select>
                    <label className="text-xs text-slate-500">Max output tokens</label>
                    <input
                      type="number"
                      value={settings.maxOutputTokens}
                      onChange={(e) => setSettings({ ...settings, maxOutputTokens: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="text-xs text-slate-500">Template</label>
                    <textarea
                      value={settings.summaryTemplate}
                      onChange={(e) => setSettings({ ...settings, summaryTemplate: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.strictJson}
                        onChange={(e) => setSettings({ ...settings, strictJson: e.target.checked })}
                      />
                      Strict JSON output
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">Notificaties</h3>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.emailDigest}
                        onChange={(e) => setSettings({ ...settings, emailDigest: e.target.checked })}
                      />
                      Email digest (optioneel)
                    </label>
                    <label className="text-xs text-slate-500">Alleen melden bij score &ge;</label>
                    <input
                      type="number"
                      value={settings.notificationScoreThreshold}
                      onChange={(e) => setSettings({ ...settings, notificationScoreThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">Kans-score</h3>
                    <p className="text-sm text-slate-600">
                      Score weegt nieuwheid, weinig reacties en directe vraagstelling. Hoge score = sneller reageren.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
                  >
                    {isSaving ? 'Opslaan...' : 'Instellingen opslaan'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
