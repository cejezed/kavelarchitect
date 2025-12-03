import React, { useEffect, useState } from 'react';
import { CustomerProfile } from '../types';
import { api } from '../services/api';
import { Mail, MapPin, BadgeEuro, Ruler, Loader2, Plus, X } from 'lucide-react';

const PROVINCIES = [
  'Noord-Holland', 'Zuid-Holland', 'Utrecht', 'Gelderland', 'Noord-Brabant',
  'Limburg', 'Zeeland', 'Overijssel', 'Flevoland', 'Drenthe', 'Friesland', 'Groningen'
];

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CustomerProfile>>({
    naam: '',
    email: '',
    telefoonnummer: '',
    provincies: [],
    status: 'actief',
    min_prijs: undefined,
    max_prijs: undefined,
    min_oppervlakte: undefined,
    dienstverlening: 'zoek',
    heeft_kavel: false,
    opmerkingen: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.naam || !formData.email || !formData.provincies || formData.provincies.length === 0) {
      alert('Vul minimaal naam, email en één provincie in.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await api.registerCustomer(formData);
      if (result.success) {
        alert(result.message);
        setShowAddModal(false);
        // Reset form
        setFormData({
          naam: '',
          email: '',
          telefoonnummer: '',
          provincies: [],
          status: 'actief',
          min_prijs: undefined,
          max_prijs: undefined,
          min_oppervlakte: undefined,
          dienstverlening: 'zoek',
          heeft_kavel: false,
          opmerkingen: ''
        });
        // Refresh list
        await fetchCustomers();
      } else {
        alert('Fout: ' + result.message);
      }
    } catch (error) {
      alert('Er ging iets mis bij het opslaan.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProvince = (prov: string) => {
    setFormData(prev => ({
      ...prev,
      provincies: prev.provincies?.includes(prov)
        ? prev.provincies.filter(p => p !== prov)
        : [...(prev.provincies || []), prov]
    }));
  };

  const formatCurrency = (val?: number) => val ? `€${(val/1000).toFixed(0)}k` : '-';

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 size={40} className="animate-spin text-blue-500" />
          </div>
      );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Klanten Database</h2>
          <p className="text-slate-500">Live overzicht uit Google Sheets ({customers.length} profielen).</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          Nieuwe Klant
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Klant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Locatie Voorkeur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Budget & Eisen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {customers.map((customer) => (
                <tr key={customer.klant_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{customer.naam}</div>
                        <div className="text-sm text-slate-500 flex items-center mt-0.5">
                            <Mail size={12} className="mr-1" /> {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {customer.provincies.map(prov => (
                            <span key={prov} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {prov}
                            </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 space-y-1">
                        <div className="flex items-center" title="Budget Range">
                            <BadgeEuro size={14} className="mr-2 text-slate-400" />
                            {formatCurrency(customer.min_prijs)} - {formatCurrency(customer.max_prijs)}
                        </div>
                        <div className="flex items-center" title="Minimale oppervlakte">
                            <Ruler size={14} className="mr-2 text-slate-400" />
                            &ge; {customer.min_oppervlakte || 0} m²
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'actief' ? 'bg-green-100 text-green-800' :
                        customer.status === 'pauze' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-900">Nieuwe Kavelzoeker Toevoegen</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Contact Gegevens</h4>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Naam *</label>
                  <input
                    type="text"
                    required
                    value={formData.naam}
                    onChange={(e) => setFormData({...formData, naam: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fam. Jansen"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jansen@email.nl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefoonnummer</label>
                    <input
                      type="tel"
                      value={formData.telefoonnummer}
                      onChange={(e) => setFormData({...formData, telefoonnummer: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+31 6 12345678"
                    />
                  </div>
                </div>
              </div>

              {/* Location Preferences */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Locatie Voorkeuren *</h4>
                <div className="grid grid-cols-3 gap-2">
                  {PROVINCIES.map(prov => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => toggleProvince(prov)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        formData.provincies?.includes(prov)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget & Requirements */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Budget & Eisen</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min. Prijs (€)</label>
                    <input
                      type="number"
                      value={formData.min_prijs || ''}
                      onChange={(e) => setFormData({...formData, min_prijs: e.target.value ? parseInt(e.target.value) : undefined})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max. Prijs (€)</label>
                    <input
                      type="number"
                      value={formData.max_prijs || ''}
                      onChange={(e) => setFormData({...formData, max_prijs: e.target.value ? parseInt(e.target.value) : undefined})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min. Oppervlakte (m²)</label>
                  <input
                    type="number"
                    value={formData.min_oppervlakte || ''}
                    onChange={(e) => setFormData({...formData, min_oppervlakte: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="800"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Overige Informatie</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dienstverlening</label>
                    <select
                      value={formData.dienstverlening}
                      onChange={(e) => setFormData({...formData, dienstverlening: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="zoek">Alleen Zoekservice</option>
                      <option value="totaal">Totaalpakket</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'actief' | 'pauze' | 'inactief'})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="actief">Actief</option>
                      <option value="pauze">Pauze</option>
                      <option value="inactief">Inactief</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="heeft_kavel"
                    checked={formData.heeft_kavel}
                    onChange={(e) => setFormData({...formData, heeft_kavel: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="heeft_kavel" className="ml-2 text-sm text-slate-700">
                    Klant heeft al een kavel
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Opmerkingen</label>
                  <textarea
                    value={formData.opmerkingen}
                    onChange={(e) => setFormData({...formData, opmerkingen: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijzondere wensen of opmerkingen..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    'Klant Toevoegen'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
