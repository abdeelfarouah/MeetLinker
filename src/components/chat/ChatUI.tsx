import React from 'react';

const ChatUI: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-md flex-none">
        <h1 className="text-white text-2xl font-bold">Awesome Chat Room</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Participants */}
        <aside className="w-1/4 bg-white border-r flex-none">
          <div className="h-full scrollable">
            <div className="p-4">
              <h2 className="text-gray-800 font-semibold mb-4">Participants</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <img src="/avatar1.jpg" alt="John Doe" className="w-8 h-8 rounded-full" />
                  <span className="text-gray-700">John Doe</span>
                </li>
                <li className="flex items-center space-x-2">
                  <img src="/avatar2.jpg" alt="Jane Smith" className="w-8 h-8 rounded-full" />
                  <span className="text-gray-700">Jane Smith</span>
                </li>
                <li className="flex items-center space-x-2">
                  <img src="/avatar3.jpg" alt="Jim Bean" className="w-8 h-8 rounded-full" />
                  <span className="text-gray-700">Jim Bean</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 scrollable">
            <div className="p-4 space-y-4">
              {/* Example Message: Received */}
              <div className="flex items-start">
                <img src="/avatar1.jpg" alt="John Doe" className="w-10 h-10 rounded-full mr-3" />
                <div className="bg-white p-3 shadow rounded-lg max-w-xs">
                  <p className="text-gray-800">Hello, everyone!</p>
                  <span className="block text-xs text-gray-500 mt-1">10:30 AM</span>
                </div>
              </div>

              {/* Example Message: Sent */}
              <div className="flex items-end justify-end">
                <div className="bg-indigo-600 text-white p-3 rounded-lg max-w-xs shadow">
                  <p>Hi! Welcome to the chat.</p>
                  <span className="block text-xs text-gray-200 mt-1">10:31 AM</span>
                </div>
                <img src="/avatar2.jpg" alt="You" className="w-10 h-10 rounded-full ml-3" />
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <footer className="bg-gray-200 p-4 flex-none">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
              >
                Send
              </button>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ChatUI;