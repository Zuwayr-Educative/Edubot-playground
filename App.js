import React, { useState, useEffect, useRef } from 'react';

// Main App Component
const App = () => {
    // State management
    const [apiKey, setApiKey] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiKeyError, setApiKeyError] = useState(null);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);
    const [model, setModel] = useState('gemini-2.5-flash-preview-05-20');
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(1);


    const messagesEndRef = useRef(null);

    // Effect to scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Function to handle sending a message
    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newMessages = [...messages, { role: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        // Format message history for the API call
        const apiHistory = newMessages
            .filter(msg => msg.role !== 'error') // Exclude any previous error messages
            .map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
        
        // Remove the last user message as it's the current prompt
        apiHistory.pop(); 

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        ...apiHistory,
                        { role: 'user', parts: [{ text: userInput }] }
                    ],
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    generationConfig: {
                        temperature: temperature,
                        topP: topP,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const err = new Error(errorData.error?.message || `API Error: ${response.status}`);
                err.status = response.status;
                throw err;
            }

            const data = await response.json();
            const modelResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (modelResponse) {
                setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
            } else {
                throw new Error('Received an empty response from the API.');
            }

        } catch (err) {
            // Check for invalid API key error
            if (err.status === 400 && err.message && err.message.toLowerCase().includes('api key not valid')) {
                setApiKeyError('Your API key is invalid. Please enter a valid one and try again.');
                setApiKey(''); // Reset API key to go back to the input screen
                setMessages([]); // Clear the chat history
            } else {
                // Handle other types of errors
                setError(err.message);
                setMessages(prev => [...prev, { role: 'error', text: `Error: ${err.message}` }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // UI Component for API Key input
    const ApiKeyInput = ({ onSetApiKey, error }) => {
        const [localApiKey, setLocalApiKey] = useState('');
        
        const handleSubmit = () => {
            if (localApiKey) {
                onSetApiKey(localApiKey);
            }
        };

        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="p-8 bg-gray-800 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-4 text-cyan-400">EduBot Playground</h1>
                    {error && <p className="mb-4 text-red-400">{error}</p>}
                    <p className="mb-6 text-gray-400">Please enter your Gemini API key to begin.</p>
                    <input
                        type="password"
                        value={localApiKey}
                        onChange={(e) => setLocalApiKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Enter your Gemini API Key"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-4 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                        Start Chatting
                    </button>
                </div>
            </div>
        );
    };

    // If no API key, show the input screen
    if (!apiKey) {
        const handleSetApiKey = (key) => {
            setApiKeyError(null);
            setApiKey(key);
        };
        return <ApiKeyInput onSetApiKey={handleSetApiKey} error={apiKeyError} />;
    }

    // Main Chat Interface
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
            {/* Header */}
            <header className="relative flex items-center justify-center p-4 bg-gray-800 border-b border-gray-700 shadow-md z-30">
                 <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="absolute left-4 p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-cyan-400">EduBot Playground</h1>
            </header>

            <div className="relative flex flex-1 overflow-hidden">
                {/* Settings Panel */}
                <aside className={`absolute top-0 left-0 h-full w-80 bg-gray-800 p-6 border-r border-gray-700 transition-transform duration-300 ease-in-out transform ${isSettingsOpen ? 'translate-x-0' : '-translate-x-full'} z-20 overflow-y-auto`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Settings</h2>
                        <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-md hover:bg-gray-700">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                             </svg>
                        </button>
                    </div>

                    {/* System Prompt */}
                    <div className="space-y-2 mb-6">
                        <label htmlFor="system-prompt" className="font-semibold text-gray-300">System Prompt</label>
                        <textarea
                            id="system-prompt"
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg resize-y focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            rows={5}
                        />
                    </div>

                     {/* Model Selection */}
                    <div className="space-y-2 mb-6">
                        <label htmlFor="model-select" className="font-semibold text-gray-300">Model</label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        >
                            <option value="gemini-2.5-flash-preview-05-20">Gemini 2.5 Flash</option>
                            <option value="gemini-pro">Gemini Pro</option>
                        </select>
                    </div>
                    
                    {/* Parameters */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="temp" className="font-semibold text-gray-300 flex justify-between">Temperature <span>{temperature.toFixed(2)}</span></label>
                            <input id="temp" type="range" min="0" max="1" step="0.01" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="topP" className="font-semibold text-gray-300 flex justify-between">Top P <span>{topP.toFixed(2)}</span></label>
                            <input id="topP" type="range" min="0" max="1" step="0.01" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className={`flex-1 flex flex-col p-4 transition-all duration-300 ease-in-out ${isSettingsOpen ? 'ml-80' : 'ml-0'}`}>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl shadow ${
                                    msg.role === 'user' ? 'bg-cyan-600' : 
                                    msg.role === 'model' ? 'bg-gray-700' : 'bg-red-800'
                                }`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                           <div className="flex justify-start">
                               <div className="bg-gray-700 px-5 py-3 rounded-2xl shadow flex items-center space-x-2">
                                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                               </div>
                           </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="mt-4 flex items-center gap-2">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            rows={1}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading} className="px-5 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                           Send
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;