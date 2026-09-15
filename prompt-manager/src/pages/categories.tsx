import React, { useState, useEffect } from 'react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { CategoryData } from '@/types';
import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '@/lib/categoryUtils';
import { getAllPrompts } from '@/lib/promptUtils';

export default function Categories() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySlug, setNewCategorySlug] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('fa-tag');
    const [promptsCount, setPromptsCount] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);

    // Load data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all categories
                const allCategories = await getAllCategories();
                setCategories(allCategories);

                // Fetch all prompts to count how many belong to each category
                const allPrompts = await getAllPrompts();

                // Tally the prompt count per category
                const counts: Record<string, number> = {};

                allPrompts.forEach(prompt => {
                    const category = prompt.category;
                    counts[category] = (counts[category] || 0) + 1;
                });

                setPromptsCount(counts);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load category data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle adding a category
    const handleAddCategory = async () => {
        if (!newCategoryName.trim() || !newCategorySlug.trim()) {
            setError('Category name and slug cannot be empty');
            return;
        }

        try {
            // Check whether the slug already exists
            if (categories.some(c => c.slug === newCategorySlug)) {
                setError('This category slug already exists');
                return;
            }

            const success = await addCategory({
                name: newCategoryName,
                slug: newCategorySlug,
                icon: newCategoryIcon
            });

            if (success) {
                // Reload categories
                const updatedCategories = await getAllCategories();
                setCategories(updatedCategories);

                // Reset the form
                setNewCategoryName('');
                setNewCategorySlug('');
                setNewCategoryIcon('fa-tag');
                setIsAdding(false);
                setError(null);
            } else {
                setError('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Error adding category');
        }
    };

    // Handle updating a category
    const handleUpdateCategory = async (slug: string) => {
        if (!newCategoryName.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        try {
            const success = await updateCategory(slug, {
                name: newCategoryName,
                icon: newCategoryIcon
            });

            if (success) {
                // Reload categories
                const updatedCategories = await getAllCategories();
                setCategories(updatedCategories);

                // Reset the form
                setEditingId(null);
                setNewCategoryName('');
                setNewCategoryIcon('');
                setError(null);
            } else {
                setError('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setError('Error updating category');
        }
    };

    // Handle deleting a category
    const handleDeleteCategory = async (slug: string, name: string) => {
        const categoryName = categories.find(c => c.slug === slug)?.name;
        const promptCount = promptsCount[categoryName || ''] || 0;

        if (promptCount > 0) {
            if (!confirm(`This category has ${promptCount} prompt(s). Deleting it will leave those prompts without a category. Delete anyway?`)) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
                return;
            }
        }

        try {
            const success = await deleteCategory(slug);

            if (success) {
                // Remove the deleted category from the list
                setCategories(categories.filter(c => c.slug !== slug));
            } else {
                setError('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Error deleting category');
        }
    };

    // Start editing a category
    const startEditing = (category: CategoryData) => {
        setEditingId(category.slug);
        setNewCategoryName(category.name);
        setNewCategoryIcon(category.icon);
    };

    // Cancel editing or adding
    const cancelAction = () => {
        setEditingId(null);
        setIsAdding(false);
        setNewCategoryName('');
        setNewCategorySlug('');
        setNewCategoryIcon('fa-tag');
        setError(null);
    };

    // Generate a slug
    const handleNameChange = (name: string) => {
        setNewCategoryName(name);
        if (isAdding) {
            // Auto-generate the slug
            setNewCategorySlug(
                name.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
            );
        }
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

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="title-apple">Category Management</h1>

                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-apple-primary flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        <span>New Category</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                    <p>{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-700 hover:text-red-900"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Add category form */}
            {isAdding && (
                <div className="card-apple mb-6">
                    <h2 className="text-lg font-semibold mb-4">New Category</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="input-apple"
                                placeholder="Enter a category name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                Category Slug
                            </label>
                            <input
                                type="text"
                                value={newCategorySlug}
                                onChange={(e) => setNewCategorySlug(e.target.value)}
                                className="input-apple"
                                placeholder="e.g. programming"
                            />
                            <p className="text-xs text-apple-darkGray mt-1">
                                A unique identifier used in URLs and internal references — lowercase letters, numbers, and hyphens only
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-apple-darkGray mb-1">
                                Icon
                            </label>
                            <input
                                type="text"
                                value={newCategoryIcon}
                                onChange={(e) => setNewCategoryIcon(e.target.value)}
                                className="input-apple"
                                placeholder="Font Awesome icon class, e.g. fa-code"
                            />
                            <p className="text-xs text-apple-darkGray mt-1">
                                Use a Font Awesome icon class name, e.g. "fa-code"
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                onClick={cancelAction}
                                className="btn-apple-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="btn-apple-primary"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category list */}
            <div className="bg-white rounded-xl shadow-apple-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    Category Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    Slug
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    Icon
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    Prompt Count
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-apple-darkGray uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(category => (
                                <tr key={category.slug}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === category.slug ? (
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="input-apple py-1"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-apple-black">
                                                {category.name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-apple-darkGray">
                                            {category.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingId === category.slug ? (
                                            <input
                                                type="text"
                                                value={newCategoryIcon}
                                                onChange={(e) => setNewCategoryIcon(e.target.value)}
                                                className="input-apple py-1"
                                            />
                                        ) : (
                                            <div className="text-sm text-apple-darkGray">
                                                {category.icon}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-apple-darkGray">
                                            {promptsCount[category.name] || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingId === category.slug ? (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleUpdateCategory(category.slug)}
                                                    className="text-apple-green hover:text-green-700"
                                                    title="Save"
                                                >
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={cancelAction}
                                                    className="text-apple-red hover:text-red-700"
                                                    title="Cancel"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => startEditing(category)}
                                                    className="text-apple-blue hover:text-blue-700"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.slug, category.name)}
                                                    className="text-apple-red hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-apple-darkGray">
                                        No categories yet — click "New Category" to create one
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
