import { NextApiRequest, NextApiResponse } from 'next';
import { CategoryData } from '@/types';
import { getAllCategories, saveCategories, addCategory } from '@/lib/categoryUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fetch all categories
  if (req.method === 'GET') {
    try {
      // Fetch the category list
      const categories = getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('API error fetching category list:', error);
      return res.status(500).json({ error: 'Failed to fetch category list' });
    }
  }

  // Update the category list
  else if (req.method === 'PUT') {
    try {
      const categories = req.body;

      if (!Array.isArray(categories)) {
        return res.status(400).json({ error: 'Invalid category data' });
      }

      // Save the categories
      const success = saveCategories(categories);

      if (success) {
        return res.status(200).json({ message: 'Category list updated successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to save category list' });
      }
    } catch (error) {
      console.error('API error updating category list:', error);
      return res.status(500).json({ error: 'Failed to update category list' });
    }
  }

  // Add a new category
  else if (req.method === 'POST') {
    try {
      const categoryData = req.body;

      if (!categoryData || !categoryData.slug || !categoryData.name || !categoryData.icon) {
        return res.status(400).json({ error: 'Missing required category information' });
      }

      // Add the new category
      const success = addCategory(categoryData);

      if (success) {
        return res.status(201).json({ message: 'Category added successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to add category' });
      }
    } catch (error) {
      console.error('API error adding category:', error);
      return res.status(500).json({ error: 'Failed to add category' });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
