import { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '@/types';
import { getPromptBySlug, updatePrompt, deletePrompt } from '@/lib/promptUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  console.log(`API request for a single prompt - slug: ${slug}, method: ${req.method}, time: ${new Date().toISOString()}`);

  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug parameter:', slug);
    return res.status(400).json({ error: 'Invalid prompt identifier' });
  }

  // Fetch the prompt
  if (req.method === 'GET') {
    try {
      console.log(`Attempting to fetch prompt: ${slug}`);
      const prompt = getPromptBySlug(slug);

      if (!prompt) {
        console.error(`No prompt found with slug ${slug}`);
        return res.status(404).json({ error: `No prompt found with slug ${slug}` });
      }

      console.log(`Successfully fetched prompt: ${prompt.title}`);
      return res.status(200).json(prompt);
    } catch (error) {
      console.error(`API error fetching prompt ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to fetch prompt' });
    }
  }

  // Update the prompt
  else if (req.method === 'PUT') {
    try {
      const promptData = req.body;

      if (!promptData) {
        return res.status(400).json({ error: 'Missing update data' });
      }

      // Check whether the prompt exists
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `No prompt found with slug ${slug}` });
      }

      // Update the prompt
      const success = updatePrompt(slug, promptData);

      if (success) {
        const updatedPrompt = getPromptBySlug(slug);
        return res.status(200).json({
          message: 'Prompt updated successfully',
          prompt: updatedPrompt
        });
      } else {
        return res.status(500).json({ error: 'Failed to save prompt' });
      }
    } catch (error) {
      console.error(`API error updating prompt ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to update prompt' });
    }
  }

  // Delete the prompt
  else if (req.method === 'DELETE') {
    try {
      // Check whether the prompt exists
      const existingPrompt = getPromptBySlug(slug);
      if (!existingPrompt) {
        return res.status(404).json({ error: `No prompt found with slug ${slug}` });
      }

      // Delete the prompt files
      const success = deletePrompt(slug);

      if (success) {
        return res.status(200).json({ message: 'Prompt deleted successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to delete prompt' });
      }
    } catch (error) {
      console.error(`API error deleting prompt ${slug}:`, error);
      return res.status(500).json({ error: 'Failed to delete prompt' });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
