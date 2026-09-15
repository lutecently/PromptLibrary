import { NextApiRequest, NextApiResponse } from 'next';
import { CategoryData } from '@/types';
import { getAllCategories, updateCategory, deleteCategory } from '@/lib/categoryUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid category identifier' });
  }

  // Fetch the category
  if (req.method === 'GET') {
    try {
      // Fetch all categories
      const categories = getAllCategories();

      // Find the requested category
      const category = categories.find(cat => cat.slug === slug);

      if (!category) {
        return res.status(404).json({ error: `No category found with slug ${slug}` });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error(`API error fetching category ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to fetch category' });
    }
  }

  // Update the category
  else if (req.method === 'PATCH') {
    try {
      const categoryData = req.body;

      if (!categoryData) {
        return res.status(400).json({ error: 'Missing update data' });
      }

      // Update the category
      const success = updateCategory(slug, categoryData);

      if (success) {
        // Fetch the updated category
        const categories = getAllCategories();
        const updatedCategory = categories.find(cat => cat.slug === slug);

        return res.status(200).json({
          message: 'Category updated successfully',
          category: updatedCategory
        });
      } else {
        return res.status(500).json({ error: 'Failed to update category' });
      }
    } catch (error) {
      console.error(`API error updating category ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to update category' });
    }
  }

  // Delete the category
  else if (req.method === 'DELETE') {
    try {
      // Delete the category
      const success = deleteCategory(slug);

      if (success) {
        return res.status(200).json({ message: 'Category deleted successfully' });
      } else {
        return res.status(404).json({ error: `No category found with slug ${slug}` });
      }
    } catch (error) {
      console.error(`API error deleting category ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
