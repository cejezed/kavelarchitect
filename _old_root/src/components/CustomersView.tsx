import React, { useEffect, useState } from 'react';
import { CustomerProfile } from '../types';
import { api } from '../services/api';
import { Mail, MapPin, BadgeEuro, Ruler, Loader2 } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchCustomers();
  }, []);

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Klanten Database</h2>
        <p className="text-slate-500">Live overzicht uit Google Sheets ({customers.length} profielen).</p>
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
    </div>
  );
};