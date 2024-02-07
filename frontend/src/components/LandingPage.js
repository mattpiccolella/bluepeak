import React from 'react';

function LandingPage() {
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center flex-1">
          <header className="text-4xl font-bold text-gray-800 mb-4">Welcome to Polywise</header>
          <p className="text-xl text-gray-600 text-center max-w-md mb-6">
            Polywise is a new tool. It is a place to teach yourself 
          </p>
          <div>
            <a href="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
              Register
            </a>
            <a href="/login" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Login
            </a>
          </div>
        </div>
      );
}

export default LandingPage;