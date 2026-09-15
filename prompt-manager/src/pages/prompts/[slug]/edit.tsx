import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CategoryData, Prompt } from '@/types';

export default function EditPrompt() {
    const router = useRouter();
    const { slug } = router.query;

    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [rating, setRating] = useState<number>(8.0);
    const [featured, setFeatured] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [createdAt, setCreatedAt] = useState('');
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    // Load the prompt and category data
    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                // Fetch the prompt data via API
                const promptResponse = await fetch(`/api/prompts/${slug}`);

                if (!promptResponse.ok) {
                    console.error('Prompt API returned an error:', promptResponse.status);
                    setError('Prompt not found');
                    setIsLoading(false);
                    return;
                }

                const promptData = await promptResponse.json();

                setPrompt(promptData);
                setTitle(promptData.title);
                setDescription(promptData.description);
                setContent(promptData.content);
                setCategory(promptData.category);
                setImage(promptData.image || '');
                setFeatured(promptData.featured);
                setIsNew(promptData.isNew);
                setCreatedAt(promptData.createdAt);
                setRating(promptData.rating || 8.0);

                // Fetch category data via API
                const categoriesResponse = await fetch('/api/categories');

                if (categoriesResponse.ok) {
                    const allCategories = await categoriesResponse.json();
                    setCategories(allCategories);
                } else {
                    console.error('Category API returned an error:', categoriesResponse.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Handle saving the prompt
    const handleSavePrompt = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim() || !category) {
            setError('Please fill in all required fields');
            return;
        }

        if (!prompt || !prompt.slug) {
            setError('Could not find the prompt to update');
            return;
        }

        // Prepare the updated prompt data
        const updatedPrompt: Prompt = {
            ...prompt,
            title,
            description,
            category,
            content,
            image,
            featured,
            isNew,
            rating
        };

        try {
            // Update the prompt via API
            const response = await fetch(`/api/prompts/${prompt.slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPrompt),
            });

            if (response.ok) {
                // Successfully saved, navigate to the prompt detail page
                router.push(`/prompts/${prompt.slug}`);
            } else {
                console.error('Save prompt API returned an error:', response.status);
                setError('Failed to save prompt');
            }
        } catch (error) {
            console.error('Error saving prompt:', error);
            setError('Error saving prompt');
        }
    };

    // Preview mode content
    const previewContent = () => {
        return (
            <div className="prose max-w-none bg-white rounded-xl p-6 shadow-apple-sm">
                <h1>{title || 'Prompt Title'}</h1>
                <p className="text-apple-darkGray">{description || 'Prompt description'}</p>
                <hr className="my-4" />
                {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                ) : (
                    <p className="text-apple-darkGray">No prompt content yet</p>
                )}
            </div>
        );
    };

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

    // Prompt does not exist
    if (!prompt && !isLoading) {
        return (
            <div className="card-apple text-center py-10">
                <h2 className="text-xl font-medium text-apple-black mb-2">Prompt Not Found</h2>
                <p className="text-apple-darkGray mb-6">Could not find the prompt to edit</p>
                <Link href="/prompts" className="btn-apple-primary">
                    Back to Prompts
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Back button and title */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link
                        href={`/prompts/${slug}`}
                        className="inline-flex items-center text-apple-darkGray hover:text-apple-blue transition-colors mr-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        <span>Back</span>
                    </Link>
                    <h1 className="title-apple">Edit Prompt</h1>
                </div>

                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center btn-apple-secondary"
                >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {!previewMode ? (
                <form onSubmit={handleSavePrompt} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            {/* Basic information */}
                            <div className="card-apple">
                                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            Title <span className="text-apple-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="input-apple"
                                            placeholder="The prompt's title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            Description <span className="text-apple-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="input-apple"
                                            placeholder="A brief description of what this prompt does"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            Category <span className="text-apple-red">*</span>
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="input-apple"
                                            required
                                        >
                                            {categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <option key={cat.slug} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No categories yet</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            className="input-apple"
                                            placeholder="Optional, the full URL of an image"
                                        />
                                        {image && (
                                            <img
                                                src={image}
                                                alt="Image preview"
                                                className="mt-2 rounded-lg max-h-40 object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Prompt content */}
                            <div className="card-apple">
                                <h2 className="text-lg font-semibold mb-4">Prompt Content <span className="text-apple-red">*</span></h2>

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="input-apple min-h-[400px] font-mono"
                                    placeholder="Write the prompt content here (Markdown supported)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="card-apple">
                            <h2 className="text-lg font-semibold mb-4">Prompt Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                        Created Date
                                    </label>
                                    <input
                                        type="text"
                                        value={createdAt}
                                        className="input-apple"
                                        disabled
                                    />
                                    <p className="text-xs text-apple-darkGray mt-1">
                                        The created date cannot be changed
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                        Rating (1-10)
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="0.1"
                                            value={rating}
                                            onChange={(e) => setRating(parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                        <span className="text-sm font-medium bg-apple-blue text-white rounded-md px-2 py-1">
                                            {rating ? rating.toFixed(1) : "8.0"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={featured}
                                            onChange={(e) => setFeatured(e.target.checked)}
                                            className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                        />
                                        <label htmlFor="featured" className="ml-2 text-sm font-medium text-apple-black">
                                            Mark as featured prompt
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isNew"
                                            checked={isNew}
                                            onChange={(e) => setIsNew(e.target.checked)}
                                            className="w-4 h-4 text-apple-blue focus:ring-apple-blue border-gray-300 rounded"
                                        />
                                        <label htmlFor="isNew" className="ml-2 text-sm font-medium text-apple-black">
                                            Mark as new prompt
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        className="w-full btn-apple-primary"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-apple-sm p-4 mb-6">
                        <div className="flex space-x-4">
                            <div className="px-3 py-1 rounded-full bg-gray-100 text-apple-darkGray text-sm">
                                {category || 'No category selected'}
                            </div>

                            <div className="px-3 py-1 rounded-full bg-gray-100 text-apple-darkGray text-sm">
                                Rating: {rating.toFixed(1)}
                            </div>

                            {featured && (
                                <div className="px-3 py-1 rounded-full bg-apple-purple text-white text-sm">
                                    Featured
                                </div>
                            )}

                            {isNew && (
                                <div className="px-3 py-1 rounded-full bg-apple-green text-white text-sm">
                                    New
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview content */}
                    {previewContent()}

                    <div className="flex justify-end">
                        <button
                            onClick={handleSavePrompt}
                            className="btn-apple-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
