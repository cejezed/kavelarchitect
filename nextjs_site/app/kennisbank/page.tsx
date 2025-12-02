import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getArticles } from '../../lib/api';
import Image from 'next/image';

export const metadata = {
    title: 'Kennisbank | KavelArchitect',
    description: 'Tips en gidsen over zelfbouwen, bestemmingsplannen en kavelprijzen.',
};

export default async function KennisbankPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 p-4">
                <div className="max-w-7xl mx-auto flex items-center">
                    <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy-900">
                        <ArrowLeft size={18} className="mr-2" /> Terug naar Home
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Academy</span>
                    <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">Kennisbank</h1>
                    <p className="text-slate-600 text-lg">Expertise van architecten, vertaald naar heldere gidsen.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {articles.map(article => {
                        const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;

                        return (
                            <Link href={`/kennisbank/${article.slug}`} key={article.id} className="group">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
                                    {imageUrl && (
                                        <div className="relative h-48 w-full bg-slate-200">
                                            <Image
                                                src={imageUrl}
                                                alt={article.title.rendered}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
                                        <div className="text-sm font-bold text-slate-400 flex items-center mt-auto group-hover:text-blue-600 transition-colors">
                                            Lees artikel <BookOpen size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}