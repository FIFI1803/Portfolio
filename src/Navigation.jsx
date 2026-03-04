import React from 'react'

const Navigation = () => {
    return (
        <div className="flex items-center justify-between px-10 py-10 bg-white">
            <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-full flex gap-6 mx-20">
                <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors">Projects</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors mx-20">
                    Download CV
                </button>
            </div>
        </div>
    )
}

export default Navigation