import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';

// Gemini optional AI (requires user's own free API key stored locally)
const getGeminiApiKey = () => {
  try {
    return localStorage.getItem('gemini_api_key') || '';
  } catch (e) {
    return '';
  }
};

const setGeminiApiKey = (key) => {
  try {
    if (key) localStorage.setItem('gemini_api_key', key);
  } catch (e) {
    // ignore
  }
};

const ensureGeminiApiKey = async () => {
  const existing = getGeminiApiKey();
  if (existing) return existing;
  // eslint-disable-next-line no-alert
  const entered = window.prompt('Enter your Google AI Studio (Gemini) API key to enable AI answers:');
  if (entered && entered.trim()) {
    setGeminiApiKey(entered.trim());
    return entered.trim();
  }
  return '';
};

const fetchGeminiAnswer = async (query) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return 'Gemini API key not set. Select Gemini and provide a key when prompted.';
  }
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = {
      contents: [
        { role: 'user', parts: [{ text: query }] },
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    };
    const { data } = await axios.post(endpoint, body, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
    const text = data && data.candidates && data.candidates[0] && data.candidates[0].content && Array.isArray(data.candidates[0].content.parts)
      ? data.candidates[0].content.parts.map((p) => p.text).join('\n').trim()
      : '';
    return text || 'No response from Gemini. Try refining your question.';
  } catch (err) {
    if (err && err.response && (err.response.status === 401 || err.response.status === 403)) {
      return 'Gemini API key invalid or unauthorized. Update your key and try again.';
    }
    return 'Failed to fetch from Gemini. Please try again later.';
  }
};

// Llama via Ollama local API (no key required)
// Requires Ollama running locally and a Llama model pulled, e.g.:
//   1) Install from https://ollama.com
//   2) Run: ollama pull llama3.1:8b
//   3) Ensure the daemon is running (localhost:11434)
const fetchOllamaAnswer = async (query) => {
  try {
    const endpoint = 'http://localhost:11434/api/generate';
    const body = {
      model: 'llama3.1:8b',
      prompt: query,
      stream: false,
      options: { temperature: 0.7 }
    };
    const { data } = await axios.post(endpoint, body, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
    const text = data && data.response ? String(data.response).trim() : '';
    return text || 'No response from Llama. Try refining your question.';
  } catch (err) {
    return 'Could not reach Ollama at http://localhost:11434. Start Ollama and run "ollama pull llama3.1:8b".';
  }
};

// OpenRouter (hosted-friendly; requires user API key)
// Sign up: https://openrouter.ai/ - add a key, stored locally in the browser
const getOpenRouterApiKey = () => {
  try {
    return localStorage.getItem('openrouter_api_key') || '';
  } catch (e) {
    return '';
  }
};

const setOpenRouterApiKey = (key) => {
  try {
    if (key) localStorage.setItem('openrouter_api_key', key);
  } catch (e) {
    // ignore
  }
};

const ensureOpenRouterApiKey = async () => {
  const existing = getOpenRouterApiKey();
  if (existing) return existing;
  // eslint-disable-next-line no-alert
  const entered = window.prompt('Enter your OpenRouter API key to enable hosted AI (recommended):');
  if (entered && entered.trim()) {
    setOpenRouterApiKey(entered.trim());
    return entered.trim();
  }
  return '';
};

const fetchOpenRouterAnswer = async (query) => {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) return 'OpenRouter API key not set. Select Llama 3.1 (OpenRouter) and add your key.';
  try {
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const body = {
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'user', content: query }],
      temperature: 0.7,
      max_tokens: 512,
    };
    const { data } = await axios.post(endpoint, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // Optional headers improve routing/analytics; safe to omit or customize:
        'HTTP-Referer': window?.location?.origin || 'http://localhost',
        'X-Title': 'Perplexity Clone',
      },
      timeout: 20000,
    });
    const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? String(data.choices[0].message.content).trim()
      : '';
    return text || 'No response from OpenRouter. Try refining your question.';
  } catch (err) {
    if (err && err.response && (err.response.status === 401 || err.response.status === 403)) {
      return 'OpenRouter API key invalid or unauthorized. Update your key and try again.';
    }
    return 'Failed to fetch from OpenRouter. Please try again later.';
  }
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);
  const [showMicrochipDropdown, setShowMicrochipDropdown] = useState(false);
  const [selectedMicrochipOption, setSelectedMicrochipOption] = useState('Llama 3.1 (OpenRouter)');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0].transcript;
        setSearchQuery(transcript);
        setListening(false);
        setActiveIcon(null);
      };

      recognition.onend = () => {
        setListening(false);
        setActiveIcon(null);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setAIResponse('');
    let response = '';
    if (selectedMicrochipOption === 'Llama 3.1 (OpenRouter)') {
      const key = await ensureOpenRouterApiKey();
      response = key ? await fetchOpenRouterAnswer(searchQuery) : 'Please provide an OpenRouter API key to use hosted AI.';
    } else {
      response = 'Only Llama 3.1 is enabled right now. Please select "Llama 3.1 (OpenRouter)" to get an answer.';
    }
    setAIResponse(response);
    setLoading(false);
  };

  const handleIconClick = (id) => {
    if (id === 'microphone') {
      if (!recognitionRef.current) {
        alert('Speech recognition not supported in this browser.');
        return;
      }
      if (listening) {
        recognitionRef.current.stop();
        setListening(false);
        setActiveIcon(null);
      } else {
        recognitionRef.current.start();
        setListening(true);
        setActiveIcon('microphone');
      }
      setShowMicrochipDropdown(false);
    } else if (id === 'search') {
      handleSearch();
    } else {
      setActiveIcon(id);
      setShowMicrochipDropdown(id === 'microchip' ? !showMicrochipDropdown : false);

      if (id === 'paperclip' && fileInputRef.current) {
        fileInputRef.current.click();
      }

      if (listening && id !== 'microphone' && recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
    }
  };

  const microchipOptions = ['Llama 3.1 (OpenRouter)', 'ChatGPT', 'Claude', 'Gemini Ai'];

  const handleMicrochipOptionClick = async (option) => {
    setSelectedMicrochipOption(option);
    setShowMicrochipDropdown(false);
    if (option === 'Llama 3.1 (OpenRouter)') {
      const key = await ensureOpenRouterApiKey();
      if (!key) {
        // eslint-disable-next-line no-alert
        alert('Add your OpenRouter API key to use hosted Llama responses.');
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Only Llama 3.1 is enabled right now. Please select Llama 3.1 to use AI answers.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('Selected file:', e.target.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray justify-center items-center max-md:items-start max-md:pt-8 max-md:px-0 overflow-x-hidden">
      <div className="mb-16 w-full max-w-[40rem] max-md:mb-6 max-md:max-w-none">
        <h1 className="text-6xl text-center text-white font-medium mb-6 max-md:text-4xl">perplexity</h1>
        
        <Card className="bg-[#1E1E1E] rounded-6xl shadow-md p-0 w-[40rem] h-auto
          max-md:w-[90%] max-md:h-auto max-md:pb-4 max-md:mx-auto">
          
          <div className="w-full">
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything or @mention a Space"
              className="w-full bg-transparent border-none text-white text-base placeholder-gray-500
                h-12 relative -top-6 focus:outline-none focus:ring-0
                max-md:px-2 max-md:text-sm"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="flex justify-between mt-3 px-1 text-gray-400 relative -top-4
            max-md:flex-wrap max-md:gap-2 max-md:justify-center">

            {/* First icon group */}
            <div className="flex bg-[#181818] rounded-md overflow-hidden max-md:flex-wrap max-md:w-fit">
              {[
                { id: 'search', icon: 'pi-search', tooltip: 'Search' },
                { id: 'qrcode', icon: 'pi-refresh', tooltip: 'Refresh' },
                { id: 'lightbulb', icon: 'pi-lightbulb', tooltip: 'Ideas' },
              ].map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleIconClick(item.id)}
                  className={`px-3 py-1 text-base cursor-pointer icon-${item.id} ${
                    index !== 0 ? 'border-l border-gray-700' : ''
                  } ${activeIcon === item.id ? 'bg-[#1b3a3d]' : 'hover:bg-[#3a3a3a]'}`}
                  data-pr-tooltip={item.tooltip}
                >
                  <i
                    className={`pi ${item.icon} ${
                      activeIcon === item.id ? 'text-[#2C98A3]' : 'text-white'
                    }`}
                  ></i>
                </div>
              ))}
            </div>

            {/* Second icon group */}
            <div className="flex gap-1 items-center max-md:flex-wrap max-md:justify-center max-md:w-fit">
              <div className="relative flex flex-col items-center">
                <div
                  className="px-3 py-1 text-base cursor-pointer rounded-md bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center gap-2 icon-microchip"
                  onClick={() => handleIconClick('microchip')}
                  data-pr-tooltip="Select AI Model"
                >
                  <i className="pi pi-microchip" style={{ color: '#9d9e9d' }}></i>
                  {selectedMicrochipOption && (
                    <span className="text-gray-300 text-sm whitespace-nowrap">{selectedMicrochipOption}</span>
                  )}
                </div>
                {showMicrochipDropdown && (
                  <div className="absolute top-full mt-1 w-40 bg-[#1E1E1E] border border-gray-700 rounded-md shadow-lg z-50">
                    {microchipOptions.map((option) => (
                      <div
                        key={option}
                        className={`px-4 py-3 cursor-pointer text-gray-300 hover:bg-[#2C98A3] hover:text-white rounded-md ${
                          selectedMicrochipOption === option ? 'bg-[#2C98A3] text-white' : ''
                        }`}
                        onClick={() => handleMicrochipOptionClick(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {[
                { id: 'globe', icon: 'pi-globe', tooltip: 'Explore' },
                { id: 'paperclip', icon: 'pi-paperclip', tooltip: 'Attach File' },
                { id: 'microphone', icon: 'pi-microphone', tooltip: listening ? 'Stop Listening' : 'Speak' },
                { id: 'share-alt', icon: 'pi-share-alt', tooltip: 'Share' },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`px-3 py-1 text-base cursor-pointer rounded-md ${
                    item.id === 'share-alt' ? 'bg-[#3aaeba]' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                  } icon-${item.id}`}
                  onClick={() => handleIconClick(item.id)}
                  data-pr-tooltip={item.tooltip}
                >
                  <i
                    className={`pi ${item.icon}`}
                    style={{ color: item.id === 'share-alt' ? '#000000' : '#9d9e9d' }}
                  ></i>
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center text-gray-300 mt-4">Thinking...</div>
          )}

          {aiResponse && (
            <div
              className="mt-4 p-4 bg-[#2a2a2a] rounded-md text-white whitespace-pre-wrap max-h-48 overflow-y-auto"
              aria-live="polite"
            >
              {aiResponse}
            </div>
          )}
        </Card>

        {/* Tooltip components */}
        <Tooltip target=".icon-search" position="top" />
        <Tooltip target=".icon-qrcode" position="top" />
        <Tooltip target=".icon-lightbulb" position="top" />
        <Tooltip target=".icon-microchip" position="top" />
        <Tooltip target=".icon-globe" position="top" />
        <Tooltip target=".icon-paperclip" position="top" />
        <Tooltip target=".icon-microphone" position="top" />
        <Tooltip target=".icon-share-alt" position="top" />
      </div>
    </div>
  );
};

export default Search;
