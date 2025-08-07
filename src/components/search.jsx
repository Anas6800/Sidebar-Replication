import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleIconClick = (id) => {
    setActiveIcon(id);
  };

  return (
    <div className="flex min-h-screen bg-gray justify-center items-center">
      <div className="mb-16">
        
        {/* Heading */}
        <h1 className="text-6xl text-center text-white font-medium mb-6">perplexity</h1>

        {/* Search Box */}
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

          {/* Icon row below input */}
          <div className="flex justify-between mt-3 px-1 text-gray-400 relative -top-4">

            {/* Left Icon Group */}
            <div className="flex bg-[#181818] rounded-md overflow-hidden">
              {[
                { id: 'search', icon: 'pi-search' },
                { id: 'qrcode', icon: 'pi-qrcode' },
                { id: 'lightbulb', icon: 'pi-lightbulb' },
              ].map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleIconClick(item.id)}
                  className={`px-3 py-1 text-base cursor-pointer ${
                    index !== 0 ? 'border-l border-gray-700' : ''
                  } ${activeIcon === item.id ? 'bg-[#1b3a3d]' : 'hover:bg-[#3a3a3a]'}`}
                >
                  <i
                    className={`pi ${item.icon} ${
                      activeIcon === item.id ? 'text-[#2C98A3]' : 'text-white'
                    }`}
                  ></i>
                </div>
              ))}
            </div>

{/* Right Icon Group */}
<div className="flex gap-1">
  {[
    { id: 'microchip', icon: 'pi-microchip' },
    { id: 'globe', icon: 'pi-globe' },
    { id: 'paperclip', icon: 'pi-paperclip' },
    { id: 'microphone', icon: 'pi-microphone' },
    { id: 'share-alt', icon: 'pi-share-alt' },
  ].map((item) => (
    <div
      key={item.id}
      className={`px-3 py-1 text-base cursor-pointer rounded-md ${
        item.id === 'share-alt' ? 'bg-[#3aaeba]' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
      }`}
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
      </div>
    </div>
  );
};

export default Search;
