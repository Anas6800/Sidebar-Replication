import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    { name: 'Perplexity', code: 'pplx' },
    { name: 'GPT-4', code: 'gpt4' },
    { name: 'Claude', code: 'claude' }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };
  return (
    <div className="min-h-screen w-full bg-[#1e1f21] flex flex-col items-center justify-start px-4 pt-20">
      {/* Heading: Centered */}
      <h1 className="text-white text-7xl font-medium text-center mb-12">perplexity</h1>

      {/* Container to match chatbox width and vertical alignment */}
      <div className="w-full max-w-4xl border border-gray-300 rounded-2xl shadow-xl bg-[#1e1f21] p-6">
        {/* Search Input */}
        <div className="flex items-center mb-6">
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything or @mention a Space"
            className="flex-grow bg-[#1e1f21] text-white px-4 py-3 rounded-xl text-base border border-gray-600"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Bottom bar with flex box: space-between and aligned vertically */}
        <div className="flex items-center justify-between">
          {/* Left side buttons with same vertical alignment as right side */}
          <div className="flex gap-3 items-center">
            <Button
              label="Search"
              className="p-button-text text-gray-300 hover:text-white text-sm"
            />
            <Button
              label="Research"
              className="p-button-text text-gray-300 hover:text-white text-sm"
            />
            <Button
              label="Labs"
              className="p-button-text text-gray-300 hover:text-white text-sm"
            />
          </div>

          {/* Right side icons, same spacing and vertical alignment */}
          <div className="flex items-center gap-3">
            <Dropdown
              value={selectedModel}
              options={models}
              optionLabel="name"
              placeholder="Choose a model"
              className="w-36 bg-[#1e1f21] border border-gray-600 text-white text-sm"
            />
            <Button
              icon="pi pi-globe"
              className="p-button-text text-gray-300 hover:text-white"
              tooltip="Set Sources for search"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-file"
              className="p-button-text text-gray-300 hover:text-white"
              tooltip="Attach a file"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-microphone"
              className="p-button-text text-gray-300 hover:text-white"
              tooltip="Dictation"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-headphones"
              className="bg-[#00B8D9] border-[#00B8D9] hover:bg-[#009bb8] text-white"
              tooltip="Voice mode"
              tooltipOptions={{ position: 'top' }}
              rounded
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
