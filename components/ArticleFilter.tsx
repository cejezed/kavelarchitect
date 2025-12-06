'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, BookOpen } from 'lucide-react';
import type { BlogPost, Category } from '@/lib/api';

interface ArticleFilterProps {
    articles: BlogPost[];
    categories: Category[];
}

export default function ArticleFilter({ articles, categories }: ArticleFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            // Filter by search query
            const matchesSearch = searchQuery === '' ||
                article.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.rendered.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by category
            const matchesCategory = selectedCategory === null ||
                article.categories.includes(selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [articles, searchQuery, selectedCategory]);

    return (
        <div>
            {/* Filter Controls */}
            <div className="mb-12 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Zoek in kennisbank..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center text-sm font-medium text-slate-600">
                            <Filter size={16} className="mr-2" />
                            Categorie:
                        </div>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === null
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            Alle ({articles.length})
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {(searchQuery || selectedCategory !== null) && (
                    <div className="text-sm text-slate-500">
                        {filteredArticles.length} {filteredArticles.length === 1 ? 'artikel' : 'artikelen'} gevonden
                        {searchQuery && ` voor "${searchQuery}"`}
                    </div>
                )}
            </div>

            {/* Render filtered articles */}
            {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredArticles.map(article => {
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
            ) : (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Geen artikelen gevonden</h3>
                    <p className="text-slate-600">
                        Probeer een andere zoekterm of categorie.
                    </p>
                </div>
            )}
        </div>
    );
}
