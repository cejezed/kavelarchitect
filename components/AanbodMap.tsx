import dynamic from 'next/dynamic';
import type { Listing } from '@/lib/api';

const AanbodMapClient = dynamic(() => import('./AanbodMapClient').then((m) => m.AanbodMapClient), {
    ssr: false,
    loading: () => (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
            Kaart laden...
        </div>
    )
});

type Props = {
    listings: Listing[];
};

export function AanbodMap({ listings }: Props) {
    return <AanbodMapClient listings={listings} />;
}
