import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Create connection to Claude API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// This function runs when someone sends a message
export async function POST(request: NextRequest) {
  try {
    // Get the user's message from the request
    const { message } = await request.json();

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a helpful customer service assistant for Boston Brew Coffee Shop.
      
Here's information about the business:
- Hours: Monday-Friday 7am-6pm, Saturday-Sunday 8am-5pm
- Location: 123 Main Street, Boston, MA 02108
- Menu: Coffee ($3-6), Tea ($2-4), Pastries ($4-8), Sandwiches ($8-12)
- WiFi: Free for all customers
- Seating: 30 seats inside, 10 seats outside on patio
- Parking: Street parking available, garage 2 blocks away

Answer customer questions helpfully and professionally.
Keep responses short (2-3 sentences maximum).
If you don't know something, say so politely.
Always be friendly and welcoming!`,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Get Claude's response text
    const aiMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Sorry, I could not process that.';

    // Send it back to the frontend
    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}