import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CategoryData, Prompt } from '@/types';
import { format } from 'date-fns';

export default function NewPrompt() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [rating, setRating] = useState<number>(8.0);
    const [featured, setFeatured] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [fileName, setFileName] = useState('');
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    // Load category data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch categories via API
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('Category API returned an error: ' + response.status);
                }
                const allCategories = await response.json();
                setCategories(allCategories);

                // Set the default category
                if (allCategories.length > 0) {
                    setCategory(allCategories[0].name);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load category data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle creating the prompt
    const handleCreatePrompt = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !content.trim() || !category) {
            setError('Please fill in all required fields');
            return;
        }

        // Prepare the prompt data to create
        const newPrompt: Omit<Prompt, 'slug'> & { customFileName?: string } = {
            title,
            description,
            category,
            content,
            image,
            createdAt: format(new Date(), 'yyyy-MM-dd'),
            updatedAt: format(new Date(), 'yyyy-MM-dd'),
            featured,
            isNew,
            views: 0,
            likes: 0,
            usageCount: 0,
            favoriteCount: 0,
            tags: [],
            author: ''
        };

        // If the user provided a custom file name, include it
        if (fileName.trim()) {
            newPrompt.customFileName = fileName.trim();
        }

        try {
            // Create the prompt via API
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPrompt),
            });

            if (response.ok) {
                const createdPrompt = await response.json();
                // Successfully created, navigate to the prompt detail page
                router.push(`/prompts/${createdPrompt.slug}`);
            } else {
                const errorData = await response.json();
                setError(`Failed to create prompt: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating prompt:', error);
            setError('Error creating prompt');
        }
    };

    // Generate a default template
    const generateTemplate = (templateType: string) => {
        if (templateType === 'simple') {
            setContent(`# Prompt Title

## Use Case

Describe the use case for this prompt here.

## Prompt Content

Write your main prompt content here. Explain the task, requirements, and expected output in detail.

## Example Input

Provide an example input showing how to use this prompt.

## Example Output

Provide an example output showing the expected result of this prompt.`);
        } else if (templateType === 'detailed') {
            setContent(`# Prompt Title

## Role

You are a professional [role description] with expertise in [relevant knowledge/skills].

## Task Background

[Provide task background and context]

## Detailed Instructions

1. First, you need to [first step]
2. Then, [second step]
3. Next, [third step]
4. Finally, [last step]

## Output Format

Please provide your response in the following format:

- Part one: [description]
- Part two: [description]
- Part three: [description]

## Constraints

- Constraint one: [description]
- Constraint two: [description]

## Example

Example input:
\`\`\`
[example input content]
\`\`\`

Example output:
\`\`\`
[example output content]
\`\`\`

## Additional Information

[Any other relevant information or resources]`);
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

    return (
        <div className="animate-fadeIn">
            {/* Back button and title */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link
                        href="/prompts"
                        className="inline-flex items-center text-apple-darkGray hover:text-apple-blue transition-colors mr-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        <span>Back</span>
                    </Link>
                    <h1 className="title-apple">Create New Prompt</h1>
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
                <form onSubmit={handleCreatePrompt} className="space-y-6">
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
                                            Custom File Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            className="input-apple"
                                            placeholder="Optional, will be auto-generated if left blank"
                                        />
                                        <p className="text-xs text-apple-darkGray mt-1">
                                            Letters, numbers, hyphens, and underscores only — no file extension needed
                                        </p>
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Prompt Content <span className="text-apple-red">*</span></h2>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => generateTemplate('simple')}
                                            className="text-sm text-apple-blue hover:underline"
                                        >
                                            Use Simple Template
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => generateTemplate('detailed')}
                                            className="text-sm text-apple-blue hover:underline"
                                        >
                                            Use Detailed Template
                                        </button>
                                    </div>
                                </div>

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
                                            {rating.toFixed(1)}
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
                                        Create Prompt
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
                            onClick={handleCreatePrompt}
                            className="btn-apple-primary"
                        >
                            Create Prompt
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
