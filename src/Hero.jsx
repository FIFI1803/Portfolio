import React from 'react'

const Hero = () => {
    return (
        <div className="flex justify-center h-screen width-full px-10 py-10">
            <div className="flex flex-col justify-right items-right w-1/2 py-10 mt-20">
                <div className="flex justify-right items-right font-semibold text-2xl px-10 mx-10">
                    <p>Software Engineer</p>
                </div>
                <div className="flex justify-right text-9xl font-bold items-right px-10 py-20 pt-0 mx-10">
                    <h1>Filip <br /> Galach</h1>
                </div>
            </div>
            <div className="flex justify-left items-left px-10 mx-10">
                <img src="public/hero.jpeg" alt="hero" />
            </div>
        </div>
    )
}

export default Hero