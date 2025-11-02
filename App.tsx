import React, { useState, useCallback, ReactNode, useEffect, useMemo, useRef } from 'react';
import { HomeIcon, InfoIcon, MissionIcon, LeaderboardIcon, BackIcon, CheckIcon, AiIcon, SendIcon, CopyIcon, PlusIcon, TrashIcon, EditIcon, UserIcon, LogoutIcon } from './components/icons';
import { MISSIONS, LeaderboardEntry, Mission, Vocabulary, MatchingPair } from './data';
import { getFeedback } from './services/geminiService';

type View = 'home' | 'about' | 'missions' | 'leaderboard' | 'mission_detail' | 'mission_form';
type UserRole = 'teacher' | 'student';

const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon />, roles: ['teacher', 'student'] },
    { id: 'about', label: 'About', icon: <InfoIcon />, roles: ['teacher', 'student'] },
    { id: 'missions', label: 'Missions', icon: <MissionIcon />, roles: ['teacher', 'student'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: <LeaderboardIcon />, roles: ['teacher', 'student'] },
    { id: 'mission_form', label: 'Create', icon: <PlusIcon />, roles: ['teacher'] },
];

// --- Helper Components ---

const AnimatedBorderBox = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div className={`relative p-6 bg-black bg-opacity-30 border border-agent-blue/30 rounded-lg shadow-lg shadow-agent-blue/10 ${className}`}>
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-agent-blue rounded-tl-lg opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-agent-purple rounded-br-lg opacity-50"></div>
        {children}
    </div>
);

const SectionTitle = ({ children }: { children?: ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-display text-agent-blue mb-6 tracking-widest uppercase">{children}</h2>
);


// --- View Components ---

const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole, name: string) => void }) => {
    const [role, setRole] = useState<UserRole>('student');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (role === 'teacher') {
            if (password === 'invisible') {
                onLogin('teacher', 'Teacher');
            } else {
                setError('Incorrect password.');
            }
        } else if (role === 'student') {
            if (name.trim()) {
                onLogin('student', name.trim());
            } else {
                setError('Please enter your name.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-agent-dark">
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-display text-agent-blue uppercase tracking-wider animate-pulse">
                    Mission: Possible
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
                    Identify Your Role to Proceed
                </p>
            </div>
            <AnimatedBorderBox className="mt-12 w-full max-w-sm">
                <div className="flex justify-center border-b border-agent-blue/30 mb-6">
                    <button onClick={() => setRole('student')} className={`px-6 py-2 text-lg font-bold transition-colors ${role === 'student' ? 'text-agent-blue border-b-2 border-agent-blue' : 'text-gray-500'}`}>Student</button>
                    <button onClick={() => setRole('teacher')} className={`px-6 py-2 text-lg font-bold transition-colors ${role === 'teacher' ? 'text-agent-blue border-b-2 border-agent-blue' : 'text-gray-500'}`}>Teacher</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {role === 'student' && (
                        <div>
                            <label htmlFor="name" className={labelClass}>Agent Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your callsign"
                                required
                            />
                        </div>
                    )}
                    {role === 'teacher' && (
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Enter access code"
                                required
                            />
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-8 py-4 bg-agent-purple text-white font-bold text-lg rounded-md shadow-glow-purple hover:bg-agent-pink hover:shadow-lg hover:shadow-agent-pink/50 transition-all duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
            </AnimatedBorderBox>
        </div>
    );
};


const Home = ({ navigate }: { navigate: (view: View) => void }) => (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)] p-4">
        <h1 className="text-5xl md:text-7xl font-display text-agent-blue uppercase tracking-wider animate-pulse">
            Mission: Possible
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
            Your English learning adventure starts now. Accept your mission, enhance your skills, and climb the ranks to become a top agent.
        </p>
        <button
            onClick={() => navigate('missions')}
            className="mt-8 px-8 py-3 bg-agent-blue text-agent-dark font-bold rounded-md shadow-glow-blue hover:bg-agent-green hover:shadow-lg hover:shadow-agent-green/50 transition-all duration-300 transform hover:scale-105"
        >
            CHOOSE YOUR MISSION
        </button>
    </div>
);

const About = () => (
    <div className="p-4 md:p-8">
        <SectionTitle>About Mission: Possible</SectionTitle>
        <AnimatedBorderBox className="space-y-4 text-gray-300 text-lg">
            <p><strong className="text-agent-green">Mission: Possible</strong> is a futuristic, secret agent-themed platform designed for junior high school students (grades 7-9) to master English in an engaging way.</p>
            <p>We use <strong className="text-agent-green">Project-Based Learning (PjBL)</strong>, where you, the agent, complete meaningful missions. Each mission is a project that requires you to use English to describe, direct, narrate, and plan—just like a real field agent!</p>
            <p>With <strong className="text-agent-green">Gamification</strong> elements like a leaderboard and mission achievements, learning becomes a thrilling competition. Climb the ranks and prove you're the best agent in the agency.</p>
            <p>Our platform is designed to be easily updated by teachers, allowing for new and exciting missions to be added regularly. This ensures the adventure never ends!</p>
        </AnimatedBorderBox>
    </div>
);

const Missions = ({ navigate, setSelectedMission, missions, userRole, onEditMission }: { navigate: (view: View) => void; setSelectedMission: (mission: Mission) => void; missions: Mission[]; userRole: UserRole, onEditMission: (mission: Mission) => void; }) => {

    const handleMissionSelect = (mission: Mission) => {
        setSelectedMission(mission);
        navigate('mission_detail');
    };

    return (
        <div className="p-4 md:p-8">
            <SectionTitle>Mission Board</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map(mission => (
                     <div key={mission.id} className="bg-black bg-opacity-20 border border-agent-purple/30 rounded-lg p-5 flex flex-col justify-between hover:border-agent-purple hover:shadow-glow-purple transition-all duration-300 transform hover:-translate-y-1">
                        <div>
                            <h3 className="text-xl font-bold font-display text-agent-green mt-1">{mission.title}</h3>
                            <p className="text-gray-400 mt-2 text-sm">{mission.objective}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                             <button onClick={() => handleMissionSelect(mission)} className="w-full px-4 py-2 bg-agent-purple text-white font-bold rounded-md hover:bg-agent-pink transition-colors">
                                Accept Mission
                            </button>
                            {userRole === 'teacher' && (
                                <button onClick={() => onEditMission(mission)} className="p-2 bg-gray-700 text-agent-blue rounded-md hover:bg-agent-blue hover:text-agent-dark transition-colors" title="Edit Mission">
                                    <EditIcon />
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Mission Detail Components ---

const MissionProgressBar = ({ current, total }: { current: number, total: number }) => (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div className="bg-agent-blue h-2.5 rounded-full" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
);

const VocabularyTraining = ({ vocabulary, onComplete }: { vocabulary: Vocabulary, onComplete: () => void }) => {
    const [expandedVocab, setExpandedVocab] = useState<string | null>(null);
    
    const VocabList = ({ title, items }: { title: string, items: { word: string; definition: string }[] }) => (
        <div>
            <h4 className="text-lg font-bold text-agent-purple mb-3">{title}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map(item => (
                    <div key={item.word} className="p-3 border border-gray-600 rounded-md cursor-pointer hover:bg-agent-purple/20" onClick={() => setExpandedVocab(expandedVocab === item.word ? null : item.word)}>
                        <p className="font-bold text-agent-green">{item.word}</p>
                        {expandedVocab === item.word && <p className="text-sm text-gray-300 mt-1">{item.definition}</p>}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AnimatedBorderBox>
            <h3 className="text-xl font-bold text-agent-green mb-4">Phase 1: Vocabulary Acquisition</h3>
            <div className="space-y-6">
                <VocabList title="Appearance Adjectives" items={vocabulary.appearance} />
                <VocabList title="Personality Adjectives" items={vocabulary.personality} />
            </div>
            <button onClick={onComplete} className="mt-6 w-full px-4 py-2 bg-agent-blue text-agent-dark font-bold rounded-md hover:bg-agent-green transition-colors">
                Training Complete, Proceed to Next Phase
            </button>
        </AnimatedBorderBox>
    );
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const MatchingGame = ({ pairs, onComplete }: { pairs: MatchingPair[], onComplete: () => void }) => {
    const [shuffledDescriptions, setShuffledDescriptions] = useState<{ id: number; description: string }[]>([]);
    const [droppedItems, setDroppedItems] = useState<Record<number, number | null>>({});
    
    useEffect(() => {
        setShuffledDescriptions(shuffleArray(pairs.map(p => ({ id: p.id, description: p.description }))));
        const initialDrops: Record<number, null> = {};
        pairs.forEach(p => initialDrops[p.id] = null);
        setDroppedItems(initialDrops);
    }, [pairs]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, descriptionId: number) => {
        e.dataTransfer.setData('descriptionId', descriptionId.toString());
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, imageId: number) => {
        e.preventDefault();
        const descriptionId = parseInt(e.dataTransfer.getData('descriptionId'));
        if (descriptionId) {
            setDroppedItems(prev => ({ ...prev, [imageId]: descriptionId }));
        }
    };
    
    const isComplete = useMemo(() => {
        return pairs.every(p => droppedItems[p.id] === p.id);
    }, [droppedItems, pairs]);

    return (
        <AnimatedBorderBox>
            <h3 className="text-xl font-bold text-agent-green mb-4">Phase 2: Agent Recognition Drill</h3>
            <p className="text-gray-300 mb-6">Drag the correct description to match the agent's profile picture. The border will turn green for a correct match.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Drop Targets */}
                <div className="space-y-4">
                    {pairs.map(pair => {
                        const droppedId = droppedItems[pair.id];
                        const isCorrect = droppedId === pair.id;
                        const borderColor = droppedId ? (isCorrect ? 'border-agent-green' : 'border-agent-pink') : 'border-gray-600';

                        return (
                            <div key={pair.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, pair.id)} className={`flex items-center gap-4 p-2 rounded-lg border-2 ${borderColor}`}>
                                <img src={pair.imageUrl} alt={`Agent ${pair.id}`} className="w-20 h-20 rounded-full object-cover" />
                                <div className="w-full h-16 bg-black/30 rounded flex items-center justify-center p-2">
                                    {droppedId ? 
                                        <p className="text-sm text-center">{shuffledDescriptions.find(d => d.id === droppedId)?.description}</p> 
                                        : <p className="text-gray-500 text-sm">Drop description here</p>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* Draggable Descriptions */}
                <div className="space-y-3">
                    {shuffledDescriptions.map(desc => (
                         <div 
                            key={desc.id} 
                            draggable={!Object.values(droppedItems).includes(desc.id)} 
                            onDragStart={(e) => handleDragStart(e, desc.id)} 
                            className={`p-3 bg-gray-800 rounded-md text-sm cursor-grab ${Object.values(droppedItems).includes(desc.id) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-agent-purple/50'}`}
                         >
                            {desc.description}
                        </div>
                    ))}
                </div>
            </div>
            {isComplete && (
                <button onClick={onComplete} className="mt-6 w-full px-4 py-2 bg-agent-blue text-agent-dark font-bold rounded-md hover:bg-agent-green transition-colors animate-pulse">
                    Drill Complete, Proceed to Final Dossier
                </button>
            )}
        </AnimatedBorderBox>
    );
};


const MissionSubmission = ({ mission, onGetFeedback, studentInput, setStudentInput, isLoading, error, feedback, copied, onCopy }: {
    mission: Mission;
    onGetFeedback: () => void;
    studentInput: string;
    setStudentInput: (val: string) => void;
    isLoading: boolean;
    error: string;
    feedback: string;
    copied: boolean;
    onCopy: () => void;
}) => {
    return (
        <>
            <AnimatedBorderBox>
                <h3 className="text-xl font-bold text-agent-green mb-4">Final Phase: Create Dossier</h3>
                {mission.interactiveData?.informantImageUrl && (
                    <img src={mission.interactiveData.informantImageUrl} alt="Mysterious Informant" className="w-full h-64 object-cover rounded-lg mb-4" />
                )}
                <p className="text-gray-300 mb-4">Observe the informant. Write a detailed description covering their appearance and speculate on their personality based on what you see. Use the vocabulary from your training.</p>
                <textarea
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-agent-blue text-white"
                    placeholder="Enter your mission report here, Agent."
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    onClick={onGetFeedback}
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-agent-blue text-agent-dark font-bold rounded-md shadow-glow-blue hover:bg-agent-green transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-agent-dark"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SendIcon />
                            <span>Submit Dossier to HQ</span>
                        </>
                    )}
                </button>
                {error && <p className="mt-2 text-red-400">{error}</p>}
            </AnimatedBorderBox>

            {feedback && (
                <div className="mt-8">
                    <SectionTitle>HQ Feedback</SectionTitle>
                    <AnimatedBorderBox className="relative">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-agent-green mb-2">
                           <AiIcon /> Analyst Report
                        </h3>
                        <pre className="whitespace-pre-wrap font-sans text-gray-300 bg-black bg-opacity-20 p-4 rounded-md">{feedback}</pre>
                        <button onClick={onCopy} className="absolute top-4 right-4 p-2 bg-gray-700 rounded-md hover:bg-agent-purple transition-colors">
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <p className="mt-4 text-center text-agent-green font-bold text-lg">Mission Complete! You have been awarded {mission.points} points.</p>
                    </AnimatedBorderBox>
                </div>
            )}
        </>
    );
};

const MissionDetail = ({ mission, navigate, onMissionComplete }: { mission: Mission; navigate: (view: View) => void; onMissionComplete: (missionId: string) => void; }) => {
    const [studentInput, setStudentInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const isInteractive = !!mission.interactiveData;
    const totalSteps = isInteractive ? 3 : 1;

    const handleGetFeedback = useCallback(async () => {
        if (!studentInput.trim()) {
            setError('Please complete your dossier before submitting to HQ.');
            return;
        }
        setError('');
        setIsLoading(true);
        setFeedback('');
        try {
            const result = await getFeedback(studentInput, mission.geminiPrompt);
            setFeedback(result);
            onMissionComplete(mission.id);
        } catch (err) {
            setError('Failed to get feedback from HQ. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [studentInput, mission.geminiPrompt, mission.id, onMissionComplete]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(feedback);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderInteractiveMission = () => {
        if (!mission.interactiveData) return null;
        
        switch (currentStep) {
            case 0:
                return <VocabularyTraining vocabulary={mission.interactiveData.vocabulary} onComplete={() => setCurrentStep(1)} />;
            case 1:
                return <MatchingGame pairs={mission.interactiveData.matchingPairs} onComplete={() => setCurrentStep(2)} />;
            case 2:
                return <MissionSubmission 
                    mission={mission}
                    onGetFeedback={handleGetFeedback}
                    studentInput={studentInput}
                    setStudentInput={setStudentInput}
                    isLoading={isLoading}
                    error={error}
                    feedback={feedback}
                    copied={copied}
                    onCopy={handleCopy}
                />;
            default:
                return null;
        }
    };
    
    const renderStandardMission = () => (
         <div className="mt-8">
            <SectionTitle>Submit Dossier to HQ</SectionTitle>
            <AnimatedBorderBox>
                <textarea
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-agent-blue text-white"
                    placeholder="Enter your mission report here, Agent."
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    onClick={handleGetFeedback}
                    disabled={isLoading}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-agent-blue text-agent-dark font-bold rounded-md shadow-glow-blue hover:bg-agent-green transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-agent-dark"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SendIcon />
                            <span>Get Feedback</span>
                        </>
                    )}
                </button>
                {error && <p className="mt-2 text-red-400">{error}</p>}
            </AnimatedBorderBox>
             {feedback && (
                <div className="mt-8">
                    <SectionTitle>HQ Feedback</SectionTitle>
                    <AnimatedBorderBox className="relative">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-agent-green mb-2">
                           <AiIcon /> Analyst Report
                        </h3>
                        <pre className="whitespace-pre-wrap font-sans text-gray-300 bg-black bg-opacity-20 p-4 rounded-md">{feedback}</pre>
                        <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-gray-700 rounded-md hover:bg-agent-purple transition-colors">
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <p className="mt-4 text-center text-agent-green font-bold text-lg">Mission Complete! You have been awarded {mission.points} points.</p>
                    </AnimatedBorderBox>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => navigate('missions')} className="flex items-center gap-2 text-agent-blue hover:text-agent-green mb-6">
                <BackIcon />
                <span>Return to Mission Board</span>
            </button>

            <AnimatedBorderBox>
                <h2 className="text-3xl md:text-4xl font-display text-agent-blue mt-1 mb-4">{mission.title}</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-agent-green mb-2">Objective:</h3>
                        <p className="text-gray-300">{mission.objective}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-agent-green mb-2">Tasks:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {mission.tasks.map((task, index) => <li key={index}>{task}</li>)}
                        </ul>
                    </div>
                </div>
            </AnimatedBorderBox>
            
            <div className="mt-8">
                {isInteractive && <MissionProgressBar current={currentStep + 1} total={totalSteps} />}
                {isInteractive ? renderInteractiveMission() : renderStandardMission()}
            </div>
        </div>
    );
};

const Leaderboard = ({ leaderboardData }: { leaderboardData: LeaderboardEntry[] }) => (
    <div className="p-4 md:p-8">
        <SectionTitle>Top Agents</SectionTitle>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="p-3 bg-black bg-opacity-20 border-b-2 border-agent-purple text-agent-blue uppercase tracking-wider">Rank</th>
                        <th className="p-3 bg-black bg-opacity-20 border-b-2 border-agent-purple text-agent-blue uppercase tracking-wider">Agent</th>
                        <th className="p-3 bg-black bg-opacity-20 border-b-2 border-agent-purple text-agent-blue uppercase tracking-wider">Score</th>
                        <th className="p-3 bg-black bg-opacity-20 border-b-2 border-agent-purple text-agent-blue uppercase tracking-wider">Missions Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.length > 0 ? (
                        leaderboardData.map((agent) => (
                            <tr key={agent.rank} className="bg-gray-900/50 hover:bg-agent-purple/10">
                                <td className="p-3 border-b border-gray-800 font-display text-2xl text-agent-green">{agent.rank}</td>
                                <td className="p-3 border-b border-gray-800">{agent.name}</td>
                                <td className="p-3 border-b border-gray-800 text-agent-blue">{agent.score}</td>
                                <td className="p-3 border-b border-gray-800">{agent.missionsCompleted}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center p-8 text-gray-500">No agents on the board yet. Complete a mission to get ranked!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Mission Form Component (Create/Edit) ---
const inputClass = "w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-agent-blue text-white";
const labelClass = "block text-agent-green font-bold mb-1 mt-4";
const fieldsetBoxClass = "p-4 border border-agent-purple/30 rounded-lg mt-6";

const emptyMissionData: Omit<Mission, 'id'> = {
    title: '',
    objective: '',
    briefing: '',
    tasks: [''],
    geminiPrompt: '',
    points: 100,
};

type MissionFormData = Omit<Mission, 'id'> & { isInteractive: boolean };

const MissionForm = ({ onSave, missionToEdit }: { onSave: (mission: Mission) => void; missionToEdit: Mission | null }) => {
    const [missionData, setMissionData] = useState<MissionFormData>(() => {
        if (missionToEdit) {
            return { ...missionToEdit, isInteractive: !!missionToEdit.interactiveData };
        }
        return { ...emptyMissionData, isInteractive: false };
    });

    useEffect(() => {
        if (missionToEdit) {
            setMissionData({ ...missionToEdit, isInteractive: !!missionToEdit.interactiveData });
        } else {
             setMissionData({ ...emptyMissionData, isInteractive: false });
        }
    }, [missionToEdit]);
    
    const isEditing = !!missionToEdit;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseInt(value) : value;
        setMissionData(prev => ({ ...prev, [name]: finalValue }));
    };
    
    const handleTaskChange = (index: number, value: string) => {
        const newTasks = [...missionData.tasks];
        newTasks[index] = value;
        setMissionData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleAddTask = () => setMissionData(prev => ({ ...prev, tasks: [...prev.tasks, ''] }));
    const handleRemoveTask = (index: number) => {
        if (missionData.tasks.length > 1) {
            setMissionData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
        }
    };
    
    const handleInteractiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setMissionData(prev => ({
            ...prev,
            isInteractive: isChecked,
            interactiveData: isChecked ? {
                informantImageUrl: '',
                vocabulary: { appearance: [{word: '', definition: ''}], personality: [{word: '', definition: ''}] },
                matchingPairs: [{id: 1, imageUrl: '', description: ''}]
            } : undefined
        }));
    };
    
    const handleInteractiveDataChange = (field: string, value: string) => {
        if (!missionData.interactiveData) return;
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, [field]: value }}));
    };
    
    const handleVocabChange = (type: 'appearance' | 'personality', index: number, field: 'word' | 'definition', value: string) => {
        if (!missionData.interactiveData) return;
        const newVocab = {...missionData.interactiveData.vocabulary};
        newVocab[type][index][field] = value;
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, vocabulary: newVocab}}))
    };

    const handleAddVocab = (type: 'appearance' | 'personality') => {
        if (!missionData.interactiveData) return;
        const newVocab = {...missionData.interactiveData.vocabulary};
        newVocab[type].push({word: '', definition: ''});
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, vocabulary: newVocab}}))
    }

    const handleRemoveVocab = (type: 'appearance' | 'personality', index: number) => {
         if (!missionData.interactiveData || missionData.interactiveData.vocabulary[type].length <= 1) return;
         const newVocab = {...missionData.interactiveData.vocabulary};
         newVocab[type] = newVocab[type].filter((_, i) => i !== index);
         setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, vocabulary: newVocab}}))
    }

    const handlePairChange = (index: number, field: 'imageUrl' | 'description', value: string) => {
        if (!missionData.interactiveData) return;
        const newPairs = [...missionData.interactiveData.matchingPairs];
        newPairs[index] = {...newPairs[index], [field]: value};
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, matchingPairs: newPairs}}))
    };

    const handleAddPair = () => {
        if (!missionData.interactiveData) return;
        const newPairs = [...missionData.interactiveData.matchingPairs];
        const newId = newPairs.length > 0 ? Math.max(...newPairs.map(p => p.id)) + 1 : 1;
        newPairs.push({id: newId, imageUrl: '', description: ''});
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, matchingPairs: newPairs}}))
    };

    const handleRemovePair = (index: number) => {
        if (!missionData.interactiveData || missionData.interactiveData.matchingPairs.length <= 1) return;
        const newPairs = missionData.interactiveData.matchingPairs.filter((_, i) => i !== index);
        setMissionData(prev => ({...prev, interactiveData: {...prev.interactiveData!, matchingPairs: newPairs}}))
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { isInteractive, ...rest } = missionData;
        const finalMission: Mission = {
            ...rest,
            id: isEditing ? missionToEdit.id : `custom-${Date.now()}`,
        };
        onSave(finalMission);
    };

    return (
        <div className="p-4 md:p-8">
            <SectionTitle>{isEditing ? 'Edit Mission' : 'Create New Mission'}</SectionTitle>
            <form onSubmit={handleSubmit}>
                <AnimatedBorderBox>
                    <fieldset>
                        <legend className="text-xl font-bold text-agent-green mb-4">Mission Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass} htmlFor="title">Mission Title</label>
                                <input type="text" id="title" name="title" value={missionData.title} onChange={handleInputChange} className={inputClass} required />
                            </div>
                             <div>
                                <label className={labelClass} htmlFor="points">Points Awarded</label>
                                <input type="number" id="points" name="points" value={missionData.points} onChange={handleInputChange} className={inputClass} required />
                            </div>
                        </div>
                        
                        <label className={labelClass} htmlFor="objective">Objective</label>
                        <textarea id="objective" name="objective" value={missionData.objective} onChange={handleInputChange} className={inputClass} rows={2} required />

                        <label className={labelClass} htmlFor="briefing">Briefing</label>
                        <textarea id="briefing" name="briefing" value={missionData.briefing} onChange={handleInputChange} className={inputClass} rows={3} required />
                    </fieldset>

                    <fieldset className={fieldsetBoxClass}>
                        <legend className="text-xl font-bold text-agent-green mb-4">Tasks</legend>
                        {missionData.tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input type="text" value={task} onChange={e => handleTaskChange(index, e.target.value)} className={inputClass} placeholder={`Task ${index + 1}`} />
                                <button type="button" onClick={() => handleRemoveTask(index)} className="p-2 text-red-400 hover:text-red-600"><TrashIcon /></button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddTask} className="mt-2 text-agent-blue hover:text-agent-green">+ Add Task</button>
                    </fieldset>
                    
                     <fieldset className={fieldsetBoxClass}>
                        <legend className="text-xl font-bold text-agent-green mb-4">AI Feedback Prompt</legend>
                        <label className={labelClass} htmlFor="geminiPrompt">Gemini System Prompt</label>
                        <textarea id="geminiPrompt" name="geminiPrompt" value={missionData.geminiPrompt} onChange={handleInputChange} className={inputClass} rows={5} required placeholder="e.g., You are a senior intelligence analyst..." />
                    </fieldset>

                    <fieldset className={fieldsetBoxClass}>
                        <legend className="text-xl font-bold text-agent-green mb-2">Interactive Mission</legend>
                        <div className="flex items-center gap-3">
                           <input type="checkbox" id="isInteractive" name="isInteractive" checked={missionData.isInteractive} onChange={handleInteractiveChange} className="h-5 w-5 bg-gray-900 border-gray-600 rounded text-agent-blue focus:ring-agent-blue" />
                           <label htmlFor="isInteractive" className="text-gray-300">Enable Interactive Components</label>
                        </div>
                    </fieldset>
                    
                    {missionData.isInteractive && missionData.interactiveData && (
                        <div className="mt-6 space-y-6">
                            <fieldset className={fieldsetBoxClass}>
                                <legend className="text-lg font-bold text-agent-purple mb-4">Interactive Content</legend>
                                <label className={labelClass} htmlFor="informantImageUrl">Informant Image URL</label>
                                <input type="text" id="informantImageUrl" value={missionData.interactiveData.informantImageUrl} onChange={e => handleInteractiveDataChange('informantImageUrl', e.target.value)} className={inputClass} />
                            </fieldset>

                            <fieldset className={fieldsetBoxClass}>
                                <legend className="text-lg font-bold text-agent-purple mb-4">Vocabulary: Appearance</legend>
                                {missionData.interactiveData.vocabulary.appearance.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 items-center">
                                        <input type="text" value={item.word} onChange={e => handleVocabChange('appearance', index, 'word', e.target.value)} className={inputClass} placeholder="Word" />
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={item.definition} onChange={e => handleVocabChange('appearance', index, 'definition', e.target.value)} className={inputClass} placeholder="Definition" />
                                            <button type="button" onClick={() => handleRemoveVocab('appearance', index)} className="p-2 text-red-400 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddVocab('appearance')} className="mt-2 text-agent-blue hover:text-agent-green">+ Add Appearance Vocab</button>
                            </fieldset>

                             <fieldset className={fieldsetBoxClass}>
                                <legend className="text-lg font-bold text-agent-purple mb-4">Vocabulary: Personality</legend>
                                {missionData.interactiveData.vocabulary.personality.map((item, index) => (
                                     <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 items-center">
                                        <input type="text" value={item.word} onChange={e => handleVocabChange('personality', index, 'word', e.target.value)} className={inputClass} placeholder="Word" />
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={item.definition} onChange={e => handleVocabChange('personality', index, 'definition', e.target.value)} className={inputClass} placeholder="Definition" />
                                            <button type="button" onClick={() => handleRemoveVocab('personality', index)} className="p-2 text-red-400 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddVocab('personality')} className="mt-2 text-agent-blue hover:text-agent-green">+ Add Personality Vocab</button>
                            </fieldset>
                            
                            <fieldset className={fieldsetBoxClass}>
                                <legend className="text-lg font-bold text-agent-purple mb-4">Matching Pairs</legend>
                                {missionData.interactiveData.matchingPairs.map((pair, index) => (
                                     <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 items-center">
                                        <input type="text" value={pair.imageUrl} onChange={e => handlePairChange(index, 'imageUrl', e.target.value)} className={inputClass} placeholder="Image URL" />
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={pair.description} onChange={e => handlePairChange(index, 'description', e.target.value)} className={inputClass} placeholder="Description" />
                                            <button type="button" onClick={() => handleRemovePair(index)} className="p-2 text-red-400 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddPair} className="mt-2 text-agent-blue hover:text-agent-green">+ Add Matching Pair</button>
                            </fieldset>
                        </div>
                    )}

                    <button type="submit" className="mt-8 w-full px-8 py-3 bg-agent-green text-agent-dark font-bold rounded-md shadow-lg shadow-agent-green/30 hover:bg-agent-blue hover:shadow-agent-blue/50 transition-all duration-300 transform hover:scale-105">
                        {isEditing ? 'UPDATE MISSION' : 'CREATE MISSION'}
                    </button>
                </AnimatedBorderBox>
            </form>
        </div>
    );
};


// --- Layout Components ---

const Header = ({ activeView, navigate, user, onLogout }: { activeView: View; navigate: (view: View) => void; user: { role: UserRole, name: string }; onLogout: () => void; }) => {
    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));
    
    return (
    <header className="bg-agent-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-agent-blue/20">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-2xl font-display text-agent-blue uppercase cursor-pointer" onClick={() => navigate('home')}>
                M:P
            </div>
            <ul className="hidden md:flex items-center space-x-6">
                {filteredNavItems.map(item => (
                    <li key={item.id}>
                        <button onClick={() => navigate(item.id as View)} className={`px-3 py-2 rounded-md transition-colors text-lg ${activeView === item.id ? 'text-agent-blue' : 'text-gray-300 hover:text-agent-green'}`}>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-agent-green">
                    <UserIcon />
                    <span className="capitalize">{user.name}</span>
                </div>
                <button onClick={onLogout} title="Logout" className="text-gray-400 hover:text-agent-pink"><LogoutIcon /></button>
            </div>
        </nav>
    </header>
);
}
const Footer = () => (
    <footer className="bg-black bg-opacity-30 border-t border-agent-purple/20 mt-auto">
        <div className="container mx-auto px-4 py-4 text-gray-500 flex justify-center items-center">
            <span>&copy; {new Date().getFullYear()} Mission: Possible Educational Division. All rights reserved.</span>
        </div>
    </footer>
);


// --- Main App Component ---

export default function App() {
    const [user, setUser] = useState<{ role: UserRole; name: string } | null>(null);
    const [activeView, setActiveView] = useState<View>('home');
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null);
    const [missions, setMissions] = useState<Mission[]>(MISSIONS);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    
    const navigate = (view: View) => {
        window.scrollTo(0, 0);
        if (view === 'mission_form' && missionToEdit) {
            setMissionToEdit(null); // Clear editing state if navigating to create form directly
        }
        setActiveView(view);
    };
    
    const handleLogin = (role: UserRole, name: string) => {
        setUser({ role, name });
        navigate('home');
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleSaveMission = (missionToSave: Mission) => {
        const index = missions.findIndex(m => m.id === missionToSave.id);
        if (index > -1) { // Existing mission
            setMissions(prev => prev.map(m => m.id === missionToSave.id ? missionToSave : m));
        } else { // New mission
            setMissions(prev => [...prev, missionToSave]);
        }
        setMissionToEdit(null);
        navigate('missions');
    };

    const handleEditMission = (mission: Mission) => {
        setMissionToEdit(mission);
        navigate('mission_form');
    };

    const handleMissionComplete = useCallback((missionId: string) => {
        if (user?.role !== 'student') return;

        const mission = missions.find(m => m.id === missionId);
        if (!mission) return;

        setLeaderboard(prev => {
            const studentName = user.name;
            const existingEntryIndex = prev.findIndex(e => e.name === studentName);
            let newLeaderboard: LeaderboardEntry[];

            if (existingEntryIndex > -1) {
                newLeaderboard = [...prev];
                const existingEntry = newLeaderboard[existingEntryIndex];
                newLeaderboard[existingEntryIndex] = {
                    ...existingEntry,
                    score: existingEntry.score + mission.points,
                    missionsCompleted: existingEntry.missionsCompleted + 1
                };
            } else {
                newLeaderboard = [...prev, {
                    rank: 0, // temp rank
                    name: studentName,
                    score: mission.points,
                    missionsCompleted: 1
                }];
            }
            
            // Sort and re-rank
            const sorted = newLeaderboard.sort((a, b) => b.score - a.score);
            return sorted.map((entry, index) => ({...entry, rank: index + 1}));
        });

    }, [user, missions]);

    const renderView = () => {
        if (!user) return null;

        switch (activeView) {
            case 'home':
                return <Home navigate={navigate} />;
            case 'about':
                return <About />;
            case 'missions':
                return <Missions navigate={navigate} setSelectedMission={setSelectedMission} missions={missions} userRole={user.role} onEditMission={handleEditMission} />;
            case 'leaderboard':
                return <Leaderboard leaderboardData={leaderboard} />;
            case 'mission_detail':
                return selectedMission ? <MissionDetail mission={selectedMission} navigate={navigate} onMissionComplete={handleMissionComplete} /> : <Missions navigate={navigate} setSelectedMission={setSelectedMission} missions={missions} userRole={user.role} onEditMission={handleEditMission}/>;
            case 'mission_form':
                return <MissionForm onSave={handleSaveMission} missionToEdit={missionToEdit} />;
            default:
                return <Home navigate={navigate} />;
        }
    };
    
    // Bottom navigation for mobile
    const BottomNav = ({ user }: { user: { role: UserRole } }) => {
        const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));
        return (
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-agent-dark border-t border-agent-blue/20 z-50">
                <ul className="flex justify-around items-center h-16">
                    {filteredNavItems.map(item => (
                         <li key={item.id}>
                            <button onClick={() => navigate(item.id as View)} className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${activeView === item.id ? 'text-agent-blue' : 'text-gray-400'}`}>
                                {item.icon}
                                <span className="text-xs mt-1">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header activeView={activeView} navigate={navigate} user={user} onLogout={handleLogout} />
            <main className="container mx-auto px-4 py-8 flex-grow">
                {renderView()}
            </main>
            <Footer />
            <BottomNav user={user} />
            <div className="pb-16 md:pb-0"></div> {/* Spacer for bottom nav */}
        </div>
    );
}