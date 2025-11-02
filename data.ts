export interface Vocabulary {
    appearance: { word: string; definition: string }[];
    personality: { word: string; definition: string }[];
}

export interface MatchingPair {
    id: number;
    imageUrl: string;
    description: string;
}

export interface Mission {
    id: string;
    title: string;
    objective: string;
    briefing: string;
    tasks: string[];
    geminiPrompt: string;
    points: number;
    // New optional fields for the interactive mission
    interactiveData?: {
        informantImageUrl: string;
        vocabulary: Vocabulary;
        matchingPairs: MatchingPair[];
    }
}


export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    missionsCompleted: number;
}

export const MISSIONS: Mission[] = [
    {
        id: 'dp-01',
        title: 'The Mysterious Informant',
        objective: 'Learn to describe people and create a detailed profile of a mysterious informant.',
        briefing: 'Agent, we have intercepted a blurry photo of a key informant. We need you to use your descriptive English skills to create a detailed dossier. Before you proceed, you must complete your training. Your description will be used by our field agents to identify them. Be precise.',
        tasks: [
            'Complete the vocabulary training on descriptive adjectives.',
            'Succeed in the agent recognition matching drill.',
            'Write a detailed dossier describing the informant\'s appearance and speculating on their personality.',
            'Submit your full dossier for review by HQ.'
        ],
        points: 100,
        geminiPrompt: 'You are a senior intelligence analyst at a secret agency, known as "Handler". A junior agent has submitted a descriptive dossier. Review their English writing. Correct any grammar or spelling mistakes. Suggest more vivid adjectives and descriptive phrases. Check if they correctly used adjectives to describe appearance and personality. Keep your feedback encouraging and within the secret agent theme. For example, start with "Good work, Agent..." and end with "Keep up the good work. Over and out."',
        interactiveData: {
            informantImageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            vocabulary: {
                appearance: [
                    { word: 'Tall', definition: 'Of great or more than average height.' },
                    { word: 'Short', definition: 'Of less than average height.' },
                    { word: 'Slender', definition: 'Gracefully thin; slim.' },
                    { word: 'Muscular', definition: 'Having well-developed muscles.' },
                    { word: 'Elegant', definition: 'Graceful and stylish in appearance or manner.' },
                    { word: 'Scruffy', definition: 'Shabby and untidy or dirty.' },
                ],
                personality: [
                    { word: 'Friendly', definition: 'Kind and pleasant.' },
                    { word: 'Mysterious', definition: 'Difficult or impossible to understand or explain.' },
                    { word: 'Confident', definition: 'Feeling or showing certainty about oneself.' },
                    { word: 'Timid', definition: 'Showing a lack of courage or confidence; easily frightened.' },
                    { word: 'Generous', definition: 'Willing to give more than is usual or expected.' },
                    { word: 'Cautious', definition: 'Careful to avoid potential problems or dangers.' },
                ]
            },
            matchingPairs: [
                { id: 1, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'He is a friendly man with short, gray hair and a beard. He seems confident.' },
                { id: 2, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'She is an elegant woman with long, brown hair. She looks cautious.' },
                { id: 3, imageUrl: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'He is a muscular man with curly hair and a beard. He looks very serious.' },
            ]
        }
    },
    {
        id: 'da-01',
        title: 'A Day in the Life',
        objective: 'Document your daily routine to establish a cover identity.',
        briefing: 'To operate effectively, every agent needs a solid cover story. Your mission is to write a detailed log of a typical day. Use present tense and include specific times and activities. This will be your official cover profile.',
        tasks: [
            'List your morning activities from waking up to going to school.',
            'Describe your afternoon, including school and after-school activities.',
            'Detail your evening routine until you go to bed.',
            'Use time-related vocabulary (e.g., "in the morning," "at 8:00 AM," "after that," "before dinner").'
        ],
        points: 100,
        geminiPrompt: 'You are an experienced spy master reviewing a junior agent\'s cover story about their daily routine. Check for correct use of present tense, time prepositions (in, at, on), and sequencing words. Ensure the routine is detailed and believable. Provide feedback in a professional, spy-themed tone.'
    },
    {
        id: 'dir-01',
        title: 'The Secret Dead Drop',
        objective: 'Write clear directions to a secret dead drop location for another agent to follow.',
        briefing: 'An allied agent needs to retrieve a package from a dead drop location. Your mission is to write foolproof directions. Use landmarks and prepositions of place. The success of their mission depends on your clarity.',
        tasks: [
            'Choose a starting point (e.g., your school gate).',
            'Write step-by-step directions to a final location (e.g., the library).',
            'Use command verbs (e.g., "Turn left," "Go straight," "Walk past").',
            'Include landmarks (e.g., "next to the post office," "across from the park").'
        ],
        points: 100,
        geminiPrompt: 'You are a logistics officer for a spy agency. A field agent has written directions for a dead drop. Review them for clarity, accuracy, and correct use of directional language and prepositions. Point out any ambiguities that could compromise the mission. Frame your feedback as a security review.'
    },
    {
        id: 'hob-01',
        title: 'Skill Profile',
        objective: 'Create a profile of your hobbies and skills to identify your potential in the agency.',
        briefing: 'HQ is assessing agents for specialized roles. We need to know what you do in your downtime. Write about your hobbies and interests. This will help us understand your unique talents.',
        tasks: [
            'Write about two or three of your favorite hobbies.',
            'Explain why you enjoy them.',
            'Describe any special skills you have because of these hobbies (e.g., teamwork from playing soccer, patience from drawing).',
            'Use gerunds (e.g., "I like playing...") and infinitives (e.g., "I want to learn...").'
        ],
        points: 100,
        geminiPrompt: 'You are a talent scout for a secret intelligence agency. You are reviewing a candidate\'s profile based on their hobbies. Check for correct use of gerunds and infinitives. Evaluate how they connect their hobbies to skills. Give encouraging feedback on their potential and how their skills could be used in the agency.'
    },
    {
        id: 'pe-01',
        title: 'After Action Report',
        objective: 'Write a report about a significant past event in your life.',
        briefing: 'Every agent has a history. Your mission is to write an "After Action Report" on a memorable past experience, like a vacation, a school event, or a personal achievement. Use the past tense to narrate the events clearly.',
        tasks: [
            'Choose a memorable event from your past.',
            'Describe what happened, where it happened, and who was with you.',
            'Explain why this event was important or memorable to you.',
            'Use simple past and past continuous tenses correctly.'
        ],
        points: 100,
        geminiPrompt: 'You are a debriefing officer reviewing an agent\'s report on a past event. Check for correct usage of past tenses (simple past, past continuous). Ensure the narrative is clear and well-structured. Provide feedback in the formal tone of a report review, suggesting improvements for clarity and detail.'
    },
     {
        id: 'fp-01',
        title: 'Operation: Future',
        objective: 'Outline your future plans and ambitions for a long-term strategy assessment.',
        briefing: 'A great agent always thinks ahead. Your mission is to outline your plans for the future. What are your goals for next year, in five years, and in ten years? HQ needs to know your long-term ambitions to plan your career path.',
        tasks: [
            'Write about your academic goals for the next year.',
            'Describe a personal skill you want to develop.',
            'Talk about your dream job or what you want to do after you finish school.',
            'Use future tenses like "will," "be going to," and "would like to."'
        ],
        points: 100,
        geminiPrompt: 'You are a career development advisor at a spy agency. You are reviewing an agent\'s long-term plan. Check for the correct use of future tenses. Offer advice and encouragement on their goals. Your feedback should be motivational and forward-looking, like a mentor guiding a promising young agent.'
    }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [];
