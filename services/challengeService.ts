//this is my first time experimenting with functions outside of the file its used in
//it definitely makes it more efficient for more complex functions like the ones used here
//this reminds me of a singleton where all the functions are stored and can be used
import { OPENAI_API_KEY } from '@/config/api';
import { db } from '@/firebase';
import { get, ref, update } from 'firebase/database';

//obviously export allows it to be used in other files
//this is strictly typing each variable and what type of value to expect
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  estimatedDuration: string;
  createdAt: string;
}

//takes the attributes of challenge and adds more onto it
export interface AcceptedChallenge extends Challenge {
  acceptedAt: string;
  status: 'accepted' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface CompletedChallenge extends Challenge {
  acceptedAt: string;
  status: 'completed';
  completedAt: string;
}

interface SessionData {
  id: string;
  title: string;
  date: string;
  duration: string;
  notes: string;
  tags: string[];
  qualityLevel: string;
}

//Fetches user's training sessions from Firebase
export const fetchUserSessions = async (userId: string): Promise<SessionData[]> => {
  try {
    const sessionsRef = ref(db, `users/${userId}/sessions`);
    const snapshot = await get(sessionsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const raw = snapshot.val() as Record<string, any>;
    const sessions: SessionData[] = Object.entries(raw).map(([id, session]) => ({
      id,
      title: session.title || '',
      date: session.date || '',
      duration: session.duration || '0',
      notes: session.notes || '',
      tags: Array.isArray(session.tags) 
        ? session.tags 
        : Object.values(session.tags || {}),
      qualityLevel: session.qualityLevel || '0',
    }));
    
    //Sort by date (most recent first)
    sessions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}


//Analyzes sessions and prepares context for AI
const prepareSessionContext = (sessions: SessionData[], limit: number = 10): string => {
  const recentSessions = sessions.slice(0, limit);
  
  //calculate statistics
  const totalSessions = sessions.length;
  const avgQuality = sessions.reduce((sum, s) => sum + (parseFloat(s.qualityLevel) || 0), 0) / totalSessions;
  const totalHours = sessions.reduce((sum, s) => sum + (parseFloat(s.duration) || 0), 0);
  
  //tag frequency
  const tagFrequency: Record<string, number> = {};
  sessions.forEach(s => {
    s.tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });
  
  const sortedTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  // Build context string
  let context = `User Training Profile:
- Total sessions: ${totalSessions}
- Total training hours: ${totalHours.toFixed(1)}
- Average session quality: ${avgQuality.toFixed(1)}/10
- Most trained areas: ${sortedTags.map(([tag, count]) => `${tag} (${count})`).join(', ')}

Recent Sessions (last ${recentSessions.length}):
`;

  recentSessions.forEach((session, idx) => {
    context += `\n${idx + 1}. ${session.title} (${session.date})
   - Duration: ${session.duration}h
   - Quality: ${session.qualityLevel}/10
   - Tags: ${session.tags.join(', ')}
   - Notes: ${session.notes.substring(0, 150)}${session.notes.length > 150 ? '...' : ''}
`;
  });
  
  return context;
}

//Generates personalized challenges using OpenAI
export const generateChallenges = async (
  userId: string, 
  numberOfChallenges: number = 3
): Promise<Challenge[]> => {
  try {
    // Fetch user sessions
    const sessions = await fetchUserSessions(userId);
    
    if (sessions.length === 0) {
      // Return starter challenges for new users
      return getStarterChallenges();
    }
    
    // Prepare context
    const context = prepareSessionContext(sessions);
    
    //call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Latest cost-effective model
        messages: [
          {
            role: 'system',
            content: `You are a martial arts training coach AI. Analyze the user's training history and generate personalized training challenges. 

Each challenge should:
- Be specific and actionable
- Address areas for improvement based on their training patterns
- Be realistic and achievable
- Focus on skill development, consistency, or exploring new techniques

Return ONLY a valid JSON array with ${numberOfChallenges} challenges in this exact format:
[
  {
    "title": "Challenge title",
    "description": "Detailed description of what to do",
    "difficulty": "beginner|intermediate|advanced",
    "focusAreas": ["tag1", "tag2"],
    "estimatedDuration": "X hours/days/weeks"
  }
]`
          },
          {
            role: 'user',
            content: `Based on this training history, generate ${numberOfChallenges} personalized training challenges:\n\n${context}`
          }
        ],

      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    
    // Parse the JSON response
    const challengesData = JSON.parse(content);
    
    // Add IDs and timestamps
    const challenges: Challenge[] = challengesData.map((c: any, idx: number) => ({
      id: `challenge-${Date.now()}-${idx}`,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      focusAreas: c.focusAreas || [],
      estimatedDuration: c.estimatedDuration,
      createdAt: new Date().toISOString(),
    }));
    
    return challenges;
    
  } catch (error) {
    console.error('Error generating challenges:', error);
    // Fallback to starter challenges
    return getStarterChallenges();
  }
}

//starter challenges for new users with no training history
const getStarterChallenges = (): Challenge[] => {
  return [
    {
      id: `challenge-${Date.now()}-0`,
      title: 'Build Your Foundation',
      description: 'Complete 3 training sessions this week focusing on fundamentals. Document your progress with detailed notes about what you learned and how you felt during training.',
      difficulty: 'beginner',
      focusAreas: ['Fundamentals', 'Consistency'],
      estimatedDuration: '1 week',
      createdAt: new Date().toISOString(),
    },
    {
      id: `challenge-${Date.now()}-1`,
      title: 'Quality Over Quantity',
      description: 'Focus on one technique you want to improve. Practice it mindfully during your next session and rate your session quality 7 or higher.',
      difficulty: 'beginner',
      focusAreas: ['Technique', 'Mindfulness'],
      estimatedDuration: '1 session',
      createdAt: new Date().toISOString(),
    },
    {
      id: `challenge-${Date.now()}-2`,
      title: 'Explore & Experiment',
      description: 'Try incorporating a new training category or technique you haven\'t focused on before. Tag it appropriately and reflect on the experience in your notes.',
      difficulty: 'intermediate',
      focusAreas: ['Exploration', 'Growth'],
      estimatedDuration: '2 sessions',
      createdAt: new Date().toISOString(),
    },
  ];
}

//Fetches user's accepted challenges from Firebase (excludes completed)
export const fetchAcceptedChallenges = async (userId: string): Promise<AcceptedChallenge[]> => {
  try {
    const challengesRef = ref(db, `users/${userId}/challenges`);
    const snapshot = await get(challengesRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const raw = snapshot.val() as Record<string, any>;
    const challenges: AcceptedChallenge[] = Object.entries(raw)
      .filter(([_, challenge]) => challenge.status !== 'completed') //exclude completed
      .map(([id, challenge]) => ({
        id,
        title: challenge.title || '',
        description: challenge.description || '',
        difficulty: challenge.difficulty || 'beginner',
        focusAreas: Array.isArray(challenge.focusAreas) 
          ? challenge.focusAreas 
          : Object.values(challenge.focusAreas || {}),
        estimatedDuration: challenge.estimatedDuration || '',
        createdAt: challenge.createdAt || '',
        acceptedAt: challenge.acceptedAt || '',
        status: challenge.status || 'accepted',
        completedAt: challenge.completedAt || undefined,
      }));
    
    // Sort by accepted date (most recent first)
    challenges.sort((a, b) => {
      const dateA = new Date(a.acceptedAt).getTime();
      const dateB = new Date(b.acceptedAt).getTime();
      return dateB - dateA;
    });
    
    return challenges;
  } catch (error) {
    console.error('Error fetching accepted challenges:', error);
    return [];
  }
};

//Fetches user's completed challenges from Firebase
//pretty much the same function as accepted except this one is strictly equal to completed
export const fetchCompletedChallenges = async (userId: string): Promise<CompletedChallenge[]> => {
  try {
    const challengesRef = ref(db, `users/${userId}/challenges`);
    const snapshot = await get(challengesRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const raw = snapshot.val() as Record<string, any>;
    const challenges: CompletedChallenge[] = Object.entries(raw)
      .filter(([_, challenge]) => challenge.status === 'completed') // Only completed
      .map(([id, challenge]) => ({
        id,
        title: challenge.title || '',
        description: challenge.description || '',
        difficulty: challenge.difficulty || 'beginner',
        focusAreas: Array.isArray(challenge.focusAreas) 
          ? challenge.focusAreas 
          : Object.values(challenge.focusAreas || {}),
        estimatedDuration: challenge.estimatedDuration || '',
        createdAt: challenge.createdAt || '',
        acceptedAt: challenge.acceptedAt || '',
        status: 'completed',
        completedAt: challenge.completedAt || new Date().toISOString(),
      }));
    
    // Sort by completed date (most recent first)
    challenges.sort((a, b) => {
      const dateA = new Date(a.completedAt).getTime();
      const dateB = new Date(b.completedAt).getTime();
      return dateB - dateA;
    });
    
    return challenges;
  } catch (error) {
    console.error('Error fetching completed challenges:', error);
    return [];
  }
};

//Updates challenge status (in_progress, completed)
export const updateChallengeStatus = async (
  userId: string, 
  challengeId: string, 
  status: 'in_progress' | 'completed'
): Promise<void> => {
  try {
    const challengeRef = ref(db, `users/${userId}/challenges/${challengeId}`);
    const updates: any = { status };
    
    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    }
    
    //updating the challenges after a status change
    await update(challengeRef, updates);
  } catch (error) {
    console.error('Error updating challenge status:', error);
    throw error;
  }
};

//Quick analysis of user's training to show insights
export const getTrainingInsights = async (userId: string): Promise<string> => {
  try {
    const sessions = await fetchUserSessions(userId);
    
    if (sessions.length === 0) {
      return "Start logging your training sessions to get personalized insights!";
    }
    
    //the information that is being sent to GPT for insight
    const context = prepareSessionContext(sessions, 5);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a martial arts coach. Provide a brief, encouraging insight about the user\'s training patterns in 2-3 sentences.'
          },
          {
            role: 'user',
            content: `Provide a brief insight about this training history:\n\n${context}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });
    
    if (!response.ok) {
      return "Keep up the great work with your training!";
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Keep training hard!";
    
  } catch (error) {
    console.error('Error getting insights:', error);
    return "Your dedication to training is inspiring. Keep it up!";
  }
}

