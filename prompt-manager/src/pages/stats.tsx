import React, { useState, useEffect } from 'react';
import {
    ChartBarIcon,
    StarIcon,
    CalendarDaysIcon,
    TagIcon
} from '@heroicons/react/24/solid';
import { Prompt, CategoryData } from '@/types';

export default function Stats() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all prompts via API
                const promptsResponse = await fetch('/api/prompts');
                if (promptsResponse.ok) {
                    const allPrompts = await promptsResponse.json();
                    setPrompts(allPrompts);
                    console.log(`Successfully fetched ${allPrompts.length} prompts`);
                } else {
                    console.error('Prompts API returned an error:', promptsResponse.status);
                    setError('Failed to load prompt data');
                }

                // Fetch all categories via API
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const allCategories = await categoriesResponse.json();
                    setCategories(allCategories);
                    console.log(`Successfully fetched ${allCategories.length} categories`);
                } else {
                    console.error('Categories API returned an error:', categoriesResponse.status);
                    setError('Failed to load category data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Compute statistics
    const statsData = React.useMemo(() => {
        if (prompts.length === 0) return null;

        // Tally by category
        const promptsByCategory: Record<string, number> = {};

        // Tally by rating
        const promptsByRating: Record<string, number> = {
            '1-2': 0,
            '3-4': 0,
            '5-6': 0,
            '7-8': 0,
            '9-10': 0
        };

        // Tally created count by month
        const monthlyCreation: Record<string, number> = {};

        // Featured and new prompt counts
        let featuredCount = 0;
        let newCount = 0;

        // Rating sum and count, used to compute the average rating
        let ratingSum = 0;
        let ratingCount = 0;

        // Highest- and lowest-rated prompts
        let highestRatedPrompt = prompts[0];
        let highestRating = prompts[0].rating || 0;
        let lowestRatedPrompt = prompts[0];
        let lowestRating = prompts[0].rating || 10;

        prompts.forEach(prompt => {
            // Tally by category
            const category = prompt.category;
            promptsByCategory[category] = (promptsByCategory[category] || 0) + 1;

            // Tally by rating
            const rating = prompt.rating || 0;
            if (rating > 0) {
                if (rating <= 2) promptsByRating['1-2']++;
                else if (rating <= 4) promptsByRating['3-4']++;
                else if (rating <= 6) promptsByRating['5-6']++;
                else if (rating <= 8) promptsByRating['7-8']++;
                else promptsByRating['9-10']++;

                // Accumulate the rating
                ratingSum += rating;
                ratingCount++;

                // Update the highest and lowest rating
                if (rating > highestRating) {
                    highestRating = rating;
                    highestRatedPrompt = prompt;
                }
                if (rating < lowestRating) {
                    lowestRating = rating;
                    lowestRatedPrompt = prompt;
                }
            } else {
                // Default to the 7-8 bucket when there's no rating
                promptsByRating['7-8']++;
            }

            // Tally by month
            const date = new Date(prompt.createdAt);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCreation[monthYear] = (monthlyCreation[monthYear] || 0) + 1;

            // Featured and new prompt counts
            if (prompt.featured) featuredCount++;
            if (prompt.isNew) newCount++;
        });

        // Compute the average rating
        const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 8.0;

        return {
            totalPrompts: prompts.length,
            promptsByCategory,
            promptsByRating,
            monthlyCreation,
            featuredCount,
            newCount,
            averageRating,
            highestRatedPrompt,
            lowestRatedPrompt,
            highestRating,
            lowestRating
        };
    }, [prompts]);

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

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    // No data
    if (!statsData || prompts.length === 0) {
        return (
            <div className="card-apple text-center py-10">
                <h2 className="text-xl font-medium text-apple-black mb-2">No Statistics Yet</h2>
                <p className="text-apple-darkGray">Add some prompts first to see statistics</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h1 className="title-apple mb-6">Prompt Statistics</h1>

            {/* Overview stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card-apple flex items-center">
                    <div className="bg-apple-blue/10 p-3 rounded-full mr-4">
                        <ChartBarIcon className="h-8 w-8 text-apple-blue" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">Total Prompts</h3>
                        <p className="text-2xl font-semibold">{statsData.totalPrompts}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">Average Rating</h3>
                        <p className="text-2xl font-semibold">{statsData.averageRating.toFixed(1)}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <StarIcon className="h-8 w-8 text-apple-purple" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">Featured Prompts</h3>
                        <p className="text-2xl font-semibold">{statsData.featuredCount}</p>
                    </div>
                </div>

                <div className="card-apple flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <CalendarDaysIcon className="h-8 w-8 text-apple-green" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-apple-darkGray">New Prompts</h3>
                        <p className="text-2xl font-semibold">{statsData.newCount}</p>
                    </div>
                </div>
            </div>

            {/* By category */}
            <div className="card-apple mb-8">
                <h2 className="text-lg font-semibold mb-4">By Category</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            {Object.entries(statsData.promptsByCategory).map(([category, count]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TagIcon className="w-5 h-5 text-apple-blue mr-2" />
                                        <span>{category}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{count}</span>
                                        <span className="text-apple-darkGray ml-1">prompts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-apple-darkGray mb-2">Category Breakdown</h3>

                            {Object.entries(statsData.promptsByCategory).map(([category, count]) => {
                                const percentage = Math.round((count / statsData.totalPrompts) * 100);
                                return (
                                    <div key={category} className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{category}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-apple-blue rounded-full h-2"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* By rating */}
            <div className="card-apple mb-8">
                <h2 className="text-lg font-semibold mb-4">By Rating</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            {Object.entries(statsData.promptsByRating).map(([ratingRange, count]) => (
                                <div key={ratingRange} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <StarIcon className="w-5 h-5 text-amber-500 mr-2" />
                                        <span>{ratingRange}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{count}</span>
                                        <span className="text-apple-darkGray ml-1">prompts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-apple-darkGray mb-2">Highest-Rated Prompt</h3>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{statsData.highestRatedPrompt.title}</h4>
                                        <div className="flex items-center text-amber-500">
                                            <StarIcon className="w-4 h-4 mr-1" />
                                            <span>{statsData.highestRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-apple-darkGray line-clamp-2">
                                        {statsData.highestRatedPrompt.description}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-apple-darkGray mb-2">Lowest-Rated Prompt</h3>
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{statsData.lowestRatedPrompt.title}</h4>
                                        <div className="flex items-center text-amber-500">
                                            <StarIcon className="w-4 h-4 mr-1" />
                                            <span>{statsData.lowestRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-apple-darkGray line-clamp-2">
                                        {statsData.lowestRatedPrompt.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* By month */}
            <div className="card-apple">
                <h2 className="text-lg font-semibold mb-4">Creation Timeline</h2>

                <div className="grid grid-cols-1 gap-6">
                    <div className="overflow-x-auto">
                        <div className="min-w-full">
                            <div className="flex items-end h-60">
                                {Object.entries(statsData.monthlyCreation)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([month, count]) => {
                                        const maxCount = Math.max(...Object.values(statsData.monthlyCreation));
                                        const height = Math.max(20, (count / maxCount) * 100);

                                        return (
                                            <div key={month} className="flex flex-col items-center mx-2">
                                                <div
                                                    className="w-14 bg-apple-blue rounded-t-lg flex items-end justify-center"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <span className="text-xs text-white font-medium pb-1">{count}</span>
                                                </div>
                                                <div className="w-14 text-xs text-apple-darkGray mt-2 text-center">
                                                    {month}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
