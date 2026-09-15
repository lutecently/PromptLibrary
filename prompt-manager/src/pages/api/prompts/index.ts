import { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '@/types';
import { getPromptSlugs, createPrompt, getAllPrompts } from '@/lib/promptUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API request to prompts - method:', req.method, '- time:', new Date().toISOString());

  // Fetch the full data for all prompts
  if (req.method === 'GET') {
    try {
      console.log('Fetching all prompts...');
      const prompts = getAllPrompts();
      console.log(`API successfully fetched ${prompts.length} prompts`);

      // Detailed logging
      prompts.forEach((prompt, index) => {
        console.log(`Prompt ${index+1}: ${prompt.title} (${prompt.slug})`);
      });

      return res.status(200).json(prompts);
    } catch (error) {
      console.error('API error fetching prompt list:', error);
      return res.status(500).json({ error: 'Failed to fetch the prompt list' });
    }
  }
  
  // Create a new prompt
  else if (req.method === 'POST') {
    try {
      const promptData = req.body;
      
      if (!promptData || !promptData.title || !promptData.content) {
        return res.status(400).json({ error: 'Missing required prompt information' });
      }

      // Check whether a custom file name was provided
      const customSlug = promptData.customFileName || undefined;

      // Create the new prompt
      const newPrompt = createPrompt(promptData, customSlug);

      if (!newPrompt) {
        return res.status(500).json({ error: 'Failed to create prompt' });
      }

      return res.status(201).json(newPrompt);
    } catch (error) {
      console.error('API error creating prompt:', error);
      return res.status(500).json({ error: 'Failed to create prompt' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 