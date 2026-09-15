import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import PromptCard from '@/components/PromptCard';
import { Prompt, CategoryData } from '@/types';

export default function PromptList() {
    const router = useRouter();
    const { category, featured, sort } = router.query;

    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string | null>(
        category ? String(category) : null
    );
    const [filterFeatured, setFilterFeatured] = useState<boolean>(
        featured === 'true'
    );
    const [sortBy, setSortBy] = useState<string>(
        sort ? String(sort) : 'newest'
    );

    // Load data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch prompt data via API
                const promptsResponse = await fetch('/api/prompts');
                if (promptsResponse.ok) {
                    const allPrompts = await promptsResponse.json();
                    setPrompts(allPrompts);
                } else {
                    console.error('Prompts API returned an error:', promptsResponse.status);
                    setPrompts([]);
                }

                // Fetch category data via API
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const allCategories = await categoriesResponse.json();
                    setCategories(allCategories);
                } else {
                    console.error('Categories API returned an error:', categoriesResponse.status);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setPrompts([]);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Update URL query params
    useEffect(() => {
        const query: Record<string, string> = {};

        if (filterCategory) {
            query.category = filterCategory;
        }

        if (filterFeatured) {
            query.featured = 'true';
        }

        if (sortBy !== 'newest') {
            query.sort = sortBy;
        }

        router.push({
            pathname: '/prompts',
            query
        }, undefined, { shallow: true });
    }, [filterCategory, filterFeatured, sortBy]);

    // Handle deleting a prompt
    const handleDeletePrompt = async (slug: string) => {
        if (confirm(`Are you sure you want to delete this prompt? This cannot be undone.`)) {
            try {
                // Delete the prompt via API
                const response = await fetch(`/api/prompts/${slug}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Remove the deleted prompt from the list
                    setPrompts(prompts.filter(p => p.slug !== slug));
                } else {
                    console.error('Delete prompt API returned an error:', response.status);
                }
            } catch (error) {
                console.error('Error deleting prompt:', error);
            }
        }
    };

    // Filter and sort prompts
    let filteredPrompts = [...prompts];

    // Apply the search filter
    if (searchTerm) {
        filteredPrompts = filteredPrompts.filter(prompt =>
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply the category filter
    if (filterCategory) {
        filteredPrompts = filteredPrompts.filter(prompt =>
            prompt.category.toLowerCase() === categories.find(c => c.slug === filterCategory)?.name.toLowerCase()
        );
    }

    // Apply the featured filter
    if (filterFeatured) {
        filteredPrompts = filteredPrompts.filter(prompt => prompt.featured);
    }

    // Apply sorting
    switch (sortBy) {
        case 'highest-rated':
            filteredPrompts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'a-z':
            filteredPrompts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'z-a':
            filteredPrompts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'newest':
        default:
            filteredPrompts.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
        case 'rating':
            filteredPrompts.sort((a, b) =>
                (b.rating || 0) - (a.rating || 0)
            );
            break;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4">
                    <div className="h-12 w-12 bg-apple-blue/20 rounded-full"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-36 bg-apple-blue/20 rounded"></div>
                        <div className="h-4 w-24 bg-apple-blue/20 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="title-apple">Prompt List</h1>

                <Link href="/new" className="btn-apple-primary flex items-center">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    <span>New Prompt</span>
                </Link>
            </div>

            {/* Search and filters */}
            <div className="bg-white rounded-xl shadow-apple-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-apple pl-10"
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 text-apple-darkGray absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 rounded-lg bg-apple-gray hover:bg-gray-200 transition-colors"
                    >
                        <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1" />
                        <span>Filters</span>
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    >
                        <option value="newest">Newest First</option>
                        <option value="highest-rated">Highest Rated</option>
                        <option value="a-z">Name A-Z</option>
                        <option value="z-a">Name Z-A</option>
                    </select>
                </div>

                {/* Filter options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-medium mb-3">Filter By</h3>

                        <div className="flex flex-wrap gap-6">
                            <div>
                                <h4 className="text-sm text-apple-darkGray mb-2">Category</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilterCategory(null)}
                                        className={`px-3 py-1 rounded-full text-sm ${filterCategory === null
                                            ? 'bg-apple-blue text-white'
                                            : 'bg-apple-gray text-apple-darkGray hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>

                                    {categories.map(cat => (
                                        <button
                                            key={cat.slug}
                                            onClick={() => setFilterCategory(cat.slug)}
                                            className={`px-3 py-1 rounded-full text-sm ${filterCategory === cat.slug
                                                ? 'bg-apple-blue text-white'
                                                : 'bg-apple-gray text-apple-darkGray hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm text-apple-darkGray mb-2">Other</h4>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={filterFeatured}
                                        onChange={(e) => setFilterFeatured(e.target.checked)}
                                        className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                    />
                                    <label htmlFor="featured" className="ml-2 text-sm">Show featured prompts only</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Prompt list */}
            {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.slug}
                            prompt={prompt}
                            onDelete={handleDeletePrompt}
                        />
                    ))}
                </div>
            ) : (
                <div className="card-apple text-center py-10">
                    <h2 className="text-xl font-medium text-apple-black mb-2">No Prompts Found</h2>
                    <p className="text-apple-darkGray mb-6">
                        {searchTerm || filterCategory || filterFeatured
                            ? 'No prompts match your filters.'
                            : 'Your prompt library is empty — start creating!'}
                    </p>
                    <Link href="/new" className="btn-apple-primary inline-flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" />
                        <span>Create New Prompt</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
