import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);
  const [showMicrochipDropdown, setShowMicrochipDropdown] = useState(false);
  const [selectedMicrochipOption, setSelectedMicrochipOption] = useState(null);
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
        const transcript = event.results[0][0].transcript;
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

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
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

  const tooltipOptionsTop = { position: 'top' };

  return (
    <div className="flex min-h-screen bg-gray justify-center items-center">
      <div className="mb-16">
        <h1 className="text-6xl text-center text-white font-medium mb-6">perplexity</h1>
        <Card className="bg-[#1E1E1E] rounded-xl shadow-md p-0 w-[40rem] h-[8.5rem]">
          <div className="w-full">
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything or @mention a Space"
              className="w-full bg-transparent border-none text-white text-base placeholder-gray-500 h-12 relative -top-6 focus:outline-none focus:ring-0"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="flex justify-between mt-3 px-1 text-gray-400 relative -top-4">
            <div className="flex bg-[#181818] rounded-md overflow-hidden">
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

            <div className="flex gap-1 items-center">
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
        </Card>

        {/* Tooltip components with position 'top' */}
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
