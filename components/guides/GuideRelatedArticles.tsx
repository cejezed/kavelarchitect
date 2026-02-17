import Link from 'next/link';
import type { FaqArticle } from '@/lib/faqArticles';
import { BookOpen, ArrowRight } from 'lucide-react';

export function GuideRelatedArticles({ articles }: { articles: FaqArticle[] }) {
    if (articles.length === 0) return null;

    return (
        <section className="guide-related-section mt-16 pt-16 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen size={20} />
                </div>
                <div>
                    <h2 className="font-serif text-2xl font-bold text-navy-900">Verdiepende artikelen</h2>
                    <p className="text-slate-500 text-sm">Aanvullende expertise over dit onderwerp</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/kennisbank/${article.slug}`}
                        className="group p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-600 hover:bg-white hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                            {article.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Lees artikel <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
