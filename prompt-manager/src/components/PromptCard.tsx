import React from 'react';
import Link from 'next/link';
import { StarIcon, TagIcon } from '@heroicons/react/24/solid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Prompt } from '@/types';
import { format, differenceInDays } from 'date-fns';

interface PromptCardProps {
    prompt: Prompt;
    onDelete?: (slug: string) => void;
    isNew?: boolean; // Optional isNew override, allows the caller to force the value
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onDelete, isNew: explicitIsNew }) => {
    const {
        slug,
        title,
        description,
        category,
        rating,
        createdAt,
        featured,
        image,
    } = prompt;

    // Format the date
    const formattedDate = format(new Date(createdAt), 'MMM d, yyyy');

    // Determine whether this is a new prompt (if isNew isn't explicitly set, treat anything created within 7 days as new)
    const isCreatedRecently = differenceInDays(new Date(), new Date(createdAt)) <= 7;
    const isNew = explicitIsNew !== undefined ? explicitIsNew : isCreatedRecently;

    return (
        <div className="bg-white rounded-xl shadow-apple-sm hover:shadow-apple-md transition-shadow duration-300 overflow-hidden">
            {image && (
                <div className="w-full h-32 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <Link href={`/prompts/${slug}`}>
                            <h3 className="text-lg font-semibold text-apple-black hover:text-apple-blue transition-colors">
                                {title}
                            </h3>
                        </Link>
                        <div className="flex items-center mt-1 space-x-3">
                            <div className="flex items-center text-apple-darkGray">
                                <TagIcon className="w-4 h-4 mr-1" />
                                <span className="text-sm">{category}</span>
                            </div>
                            <div className="flex items-center text-apple-darkGray">
                                <StarIcon className="w-4 h-4 mr-1 text-amber-500" />
                                <span className="text-sm">{rating}</span>
                            </div>
                            <span className="text-xs text-apple-darkGray">{formattedDate}</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex space-x-2">
                        {isNew && (
                            <span className="px-2 py-1 text-xs font-medium text-white bg-apple-green rounded-full">
                                New
                            </span>
                        )}
                        {featured && (
                            <span className="px-2 py-1 text-xs font-medium text-white bg-apple-purple rounded-full">
                                Featured
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-apple-darkGray line-clamp-2 mb-4">
                    {description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Link
                        href={`/prompts/${slug}`}
                        className="text-sm font-medium text-apple-blue hover:underline"
                    >
                        View Details
                    </Link>

                    <div className="flex space-x-3">
                        <Link
                            href={`/prompts/${slug}/edit`}
                            className="text-apple-darkGray hover:text-apple-blue transition-colors"
                            title="Edit"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </Link>

                        {onDelete && (
                            <button
                                onClick={() => onDelete(slug)}
                                className="text-apple-darkGray hover:text-apple-red transition-colors"
                                title="Delete"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptCard; 