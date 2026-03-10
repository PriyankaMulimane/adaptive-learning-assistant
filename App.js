import React, { useState, useEffect } from 'react';
import './App.css';
import { Volume2, Eye, Type, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const lessonData = [
  {
    title: "Understanding Neural Networks",
    content: "Neural networks are a series of algorithms that endeavor to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.",
    simple: "Neural networks are computer systems that learn to find patterns in data, similar to how a human brain learns."
  },
  {
    title: "Why Adaptive UI Matters",
    content: "Traditional interfaces often present a high cognitive load, leading to visual fatigue and decreased retention for neurodivergent users.",
    simple: "Standard apps can be tiring for the brain. Adaptive apps change their look to make reading and learning easier."
  },
  {
    title: "Project Objective",
    content: "By implementing heuristic-based triggers, we can proactively reduce user frustration before the learner disengages from the material.",
    simple: "This project uses smart triggers to help the student before they get frustrated or give up."
  }
];

function App() {
  // 1. ALL HOOKS MUST STAY AT THE TOP
  const [isDyslexicMode, setDyslexicMode] = useState(false);
  const [useBionic, setUseBionic] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isSimplified, setIsSimplified] = useState(false);
  const [mouseIdleTime, setMouseIdleTime] = useState(0);

  // Fatigue detection timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
      setMouseIdleTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset page-specific states
  useEffect(() => {
    setTimer(0);
    setIsSimplified(false);
  }, [currentPage]);

  // 2. LOGIC FUNCTIONS
  const handleMouseMove = (e) => {
    setMouseY(e.clientY);
    setMouseIdleTime(0); // Reset idle time on movement
  };

  const formatBionic = (str) => {
    return str.split(' ').map((word, i) => {
      const mid = Math.ceil(word.length / 2);
      return (
        <span key={i} className="bionic-word">
          <b>{word.substring(0, mid)}</b>{word.substring(mid)}{' '}
        </span>
      );
    });
  };

  const speak = () => {
    const textToRead = isSimplified ? lessonData[currentPage].simple : lessonData[currentPage].content;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.8; 
    window.speechSynthesis.speak(utterance);
  };

  // Heuristic: Suggest help if user is on page > 15s OR idle > 10s
  const needsHelp = timer > 15 || mouseIdleTime > 10;

  return (
    <div 
      className={`app-container ${isDyslexicMode ? 'dyslexia-mode' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <div className="reading-ruler" style={{ top: `${mouseY}px` }} />

      <div className="content-card">
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentPage + 1) / lessonData.length) * 100}%` }} 
          />
        </div>

        <h1>Adaptive Learning Assistant</h1>
        
        <div className="button-group">
          <button onClick={() => setDyslexicMode(!isDyslexicMode)}>
            <Type size={18} /> {isDyslexicMode ? "Standard" : "Dyslexia"} Font
          </button>
          <button onClick={() => setUseBionic(!useBionic)}>
            <Eye size={18} /> Bionic Mode
          </button>
          <button onClick={speak}>
            <Volume2 size={18} /> Listen
          </button>
        </div>

        <div className="text-display">
          <h2>{lessonData[currentPage].title}</h2>
          
          <p className="main-text">
            {useBionic 
              ? formatBionic(isSimplified ? lessonData[currentPage].simple : lessonData[currentPage].content) 
              : (isSimplified ? lessonData[currentPage].simple : lessonData[currentPage].content)}
          </p>

          {needsHelp && !isSimplified && (
            <div className="adaptive-prompt">
              <p><Sparkles size={16} color="#e65100" /> Need a simpler version of this text?</p>
              <button onClick={() => setIsSimplified(true)}>Yes, Simplify</button>
            </div>
          )}
        </div>

        <div className="navigation-footer">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
            <ChevronLeft size={18} /> Back
          </button>
          <span className="page-indicator">Step {currentPage + 1} of {lessonData.length}</span>
          <button 
            disabled={currentPage === lessonData.length - 1} 
            onClick={() => setCurrentPage(currentPage + 1)}
            className="next-btn"
          >
            {currentPage === lessonData.length - 1 ? "End" : "Next"} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
