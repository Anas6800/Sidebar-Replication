import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';

const OPENAI_API_KEY = 'your_openai_api_key_here'; // Replace with your actual OpenAI API key

const fetchAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI request error:', error);
    // Optionally, return a simulated response instead of failure message for testing:
    // return `Simulated AI response for: "${prompt}"`;
    return 'Sorry, I could not get a response from the AI service. Please check your API key and network connection.';
  }
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);
  const [showMicrochipDropdown, setShowMicrochipDropdown] = useState(false);
  const [selectedMicrochipOption, setSelectedMicrochipOption] = useState(null);
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
    const response = await fetchAIResponse(searchQuery);
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

  const microchipOptions = ['Claude Ai', 'GPT 4.0', 'Gemini Ai', 'GPT 4.1'];

  const handleMicrochipOptionClick = (option) => {
    setSelectedMicrochipOption(option);
    setShowMicrochipDropdown(false);
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
