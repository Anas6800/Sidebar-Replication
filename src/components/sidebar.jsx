import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const Sidebar = () => {
  const [clickedItem, setClickedItem] = useState('home');
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { id: 'home', icon: 'pi pi-home', label: 'Home' },
    { id: 'discover', icon: 'pi pi-compass', label: 'Discover' },
    { id: 'spaces', icon: 'pi pi-users', label: 'Spaces' },
  ];

  const actionButtons = [
    { id: 'accounts', icon: 'pi pi-user', label: 'Account' },
    { id: 'upgrade', icon: 'pi pi-star', label: 'Upgrade' },
    { id: 'install', icon: 'pi pi-download', label: 'Install' },
  ];

  // Home submenu
  const homeSubMenuItems = [
    { id: 'finance', icon: 'pi pi-chart-line', label: 'Finance' },
    { id: 'travel', icon: 'pi pi-send', label: 'Travel' },
    { id: 'academic', icon: 'pi pi-book', label: 'Academic' },
  ];

  // Discover submenu
  const discoverSubMenuItems = [
    { id: 'for_you', icon: 'pi pi-star', label: 'For You' },
    { id: 'top', icon: 'pi pi-arrow-up', label: 'Top' },
    { id: 'tech_science', icon: 'pi pi-cog', label: 'Tech & Science' },
    { id: 'finance', icon: 'pi pi-chart-line', label: 'Finance' },
    { id: 'arts_culture', icon: 'pi pi-palette', label: 'Arts and Culture' },
    { id: 'sports_entertainment', icon: 'pi pi-star', label: 'Sports and Entertainment' },
  ];

  // Spaces submenu sections
  const spacesSubMenuSections = {
    templates: [
      { id: 'templates', label: 'Templates' },
      { id: 'create_new_space', label: '+ Create New Space' },
    ],
    private: [
      { id: 'new_space', label: 'New space' },
    ],
  };

  const SidebarButton = ({ item, isSelected, onClick, keepHover }) => (
    <div className="flex flex-col items-center mb-3">
      <Button
        icon={item.icon}
        className="p-0 transform transition-transform duration-300 focus:outline-none hover:scale-105"
        style={{
          width: '40px',
          height: '40px',
          border: 'none',
          backgroundColor: isSelected ? '#374151' : 'transparent',
          color: isSelected ? '#FFFFFF' : '#9CA3AF',
          borderRadius: '6px',
          outline: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
        }}
        aria-label={item.label}
        onClick={() => {
          onClick();
          keepHover(true);
          if (isMobile) setSidebarOpen(true);
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#111827';
            e.currentTarget.style.color = '#FFFFFF';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#9CA3AF';
          }
        }}
      />
      <span className="text-[10px] text-gray-400 mt-0.5">{item.label}</span>
    </div>
  );

  // Generic submenu renderer for Home and Discover
  const renderSubMenu = (title, items) => (
    <div
      className={`absolute top-0 left-[56px] h-full w-56 z-10 transition-all duration-300 ease-in-out ${
        isMobile ? 'md:block' : ''
      } ${
        (isHovered || (isMobile && sidebarOpen)) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
      }`}
      style={{
        backgroundColor: '#000000',
        borderRight: '1px solid #1F2937',
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {isMobile && (
        <div className="flex items-center p-4 border-b border-gray-700">
          <Button
            icon="pi pi-arrow-left"
            className="p-2 mr-2"
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#9CA3AF', backgroundColor: 'transparent' }}
          />
          <span className="text-white font-semibold">{title}</span>
        </div>
      )}
      <div className="text-sm text-white px-4 py-4 space-y-2">
        <div>
          {!isMobile && (
            <div className="text-white font-semibold mb-2 flex items-center justify-between">
              <span>{title}</span>
              <i className="pi pi-thumbtack text-xs" style={{ color: '#9CA3AF' }} />
            </div>
          )}
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out"
                style={{ color: '#9CA3AF' }}
                onClick={() => {
                  setClickedItem(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  const icon = e.currentTarget.querySelector('i');
                  if (icon) icon.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (clickedItem !== item.id) {
                    e.currentTarget.style.color = '#9CA3AF';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = '#9CA3AF';
                  }
                }}
              >
                {item.icon && <i className={item.icon} style={{ color: '#9CA3AF' }} />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Library Section */}
        <div className="border-t border-gray-700 my-2" />
        <div>
          <div className="text-blue-400 font-medium mb-2 flex items-center justify-between">
            <span>Library</span>
            <i
              className="pi pi-plus text-xs"
              style={{ color: '#9CA3AF', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
            />
          </div>
          <div className="text-gray-400 text-xs">Your saved items will appear here</div>
        </div>
      </div>
    </div>
  );

  // Spaces submenu custom renderer with sections and Private part
  const renderSpacesSubMenu = () => (
    <div
      className={`absolute top-0 left-[56px] h-full w-56 z-10 transition-all duration-300 ease-in-out ${
        isMobile ? 'md:block' : ''
      } ${
        (isHovered || (isMobile && sidebarOpen)) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
      }`}
      style={{
        backgroundColor: '#000000',
        borderRight: '1px solid #1F2937',
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {isMobile && (
        <div className="flex items-center p-4 border-b border-gray-700">
          <Button
            icon="pi pi-arrow-left"
            className="p-2 mr-2"
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#9CA3AF', backgroundColor: 'transparent' }}
          />
          <span className="text-white font-semibold">Spaces</span>
        </div>
      )}
      <div className="text-sm text-white px-4 py-4 space-y-4">
        {/* Templates and Create New Space */}
        <div>
          {[
            { id: 'templates', label: 'Templates' },
            { id: 'create_new_space', label: '+ Create New Space' },
          ].map((item) => (
            <div
              key={item.id}
              className="hover:bg-gray-800 px-3 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out text-gray-400"
              onClick={() => {
                setClickedItem(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => {
                if (clickedItem !== item.id) e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700" />

        {/* Small Private heading */}
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Private</div>

        {/* New space section */}
        <div>
          <div
            className="hover:bg-gray-800 px-3 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out text-gray-400"
            onClick={() => {
              setClickedItem('new_space');
              if (isMobile) setSidebarOpen(false);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => {
              if (clickedItem !== 'new_space') e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            New space
          </div>
        </div>
      </div>
    </div>
  );

  // Select submenu to render based on which main button clicked
  let submenuContent = null;

  if (clickedItem === 'discover') {
    submenuContent = renderSubMenu('Discover', discoverSubMenuItems);
  } else if (clickedItem === 'spaces') {
    submenuContent = renderSpacesSubMenu();
  } else if (isHovered) {
    // If neither Discover nor Spaces is clicked,
    // show Home submenu on hover anywhere on sidebar
    submenuContent = renderSubMenu('Home', homeSubMenuItems);
  } else {
    submenuContent = null; // no submenu shown
  }

  // Mobile menu toggle button (now positioned at top left)
  const MobileMenuButton = () => (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Button
        icon={sidebarOpen ? "pi pi-times" : "pi pi-bars"}
        className="p-3"
        style={{
          backgroundColor: '#374151',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
        onClick={() => {
          if (sidebarOpen) {
            setIsHovered(false);
          }
          setSidebarOpen(!sidebarOpen);
        }}
      />
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <MobileMenuButton />

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <div
          className={`flex flex-col justify-between transition-all duration-300 ease-in-out fixed md:relative z-40 ${
            isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
          }`}
          style={{
            width: '56px',
            minWidth: '56px',
            backgroundColor: '#000000',
            borderRight: '1px solid #1F2937',
            paddingTop: '8px',
            paddingBottom: '8px',
            height: '100vh',
          }}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
          {/* Sidebar Content */}
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-4 mt-1">
              <div className="w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex flex-col items-center mb-4">
              <Button
                icon="pi pi-plus"
                className="p-0 transition-transform duration-300 hover:scale-105"
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  backgroundColor: '#111827',
                  color: '#9CA3AF',
                  borderRadius: '6px',
                }}
                onClick={() => {
                  // Logic for add button
                }}
              />
              <span className="text-[10px] text-gray-400 mt-0.5">Add</span>
            </div>

            {/* Navigation Buttons */}
            {navigation.map((item) => (
              <SidebarButton
                key={item.id}
                item={item}
                isSelected={clickedItem === item.id}
                onClick={() => {
                  setClickedItem(item.id);
                  setIsHovered(true);
                }}
                keepHover={setIsHovered}
              />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center">
            {actionButtons.map((item) => (
              <SidebarButton
                key={item.id}
                item={item}
                isSelected={clickedItem === item.id}
                onClick={() => {
                  setClickedItem(item.id);
                  setIsHovered(true);
                }}
                keepHover={setIsHovered}
              />
            ))}
          </div>
        </div>

        {/* Render submenu area */}
        {submenuContent}

        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => {
              setSidebarOpen(false);
              setIsHovered(false);
            }}
          />
        )}  
      </div>
    </>
  );
};

export default Sidebar;
