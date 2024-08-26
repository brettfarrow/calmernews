import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Check if we're in the production environment
    if (process.env.VERCEL_ENV === 'production') {
      // Make a request to the index page
      const response = await fetch(`${process.env.HOST}`);

      if (response.ok) {
        console.log('Successfully pinged the index page');
        res.status(200).json({ message: 'Cron job completed successfully' });
      } else {
        console.error('Failed to ping the index page');
        res.status(500).json({ message: 'Failed to ping the index page' });
      }
    } else {
      console.log('Skipping cron job in non-production environment');
      res
        .status(200)
        .json({ message: 'Cron job skipped (non-production environment)' });
    }
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ message: 'Cron job failed', error: error.message });
  }
}
