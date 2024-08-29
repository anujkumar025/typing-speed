import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

function Home() {
    const text = ["In the heart of the forest, a small stream meandered through the trees. Its gentle gurgling was the only sound that accompanied the rustle of leaves underfoot.",
      "A warm summer breeze brushed against the trees, rustling the leaves gently. The sky was painted with hues of orange and pink as the sun began to set. Birds chirped their evening songs, and the world seemed to slow down. It was a peaceful moment, one where everything felt in harmony, and time itself seemed to pause in reverence to the beauty around.",
      "The quick brown fox jumps over the lazy dog. It was a bright, sunny day, and the fox was feeling particularly energetic. As it leaped over the dog, it felt the wind rush through its fur, invigorating its senses. The dog, on the other hand, barely stirred, content with its nap under the warm sun.",
      "Technology has rapidly evolved, changing the way we live, work, and communicate. From smartphones to artificial intelligence, these advancements have made the world more connected and efficient. However, with these benefits come challenges, such as privacy concerns and the potential for job displacement. As we continue to innovate, it's crucial to find a balance that ensures progress while addressing these issues.",
      "Beneath the canopy of stars, the campers gathered around the fire, sharing stories of adventures and dreams, their laughter echoing through the quiet night.",
      "As the train sped through the countryside, fields of golden wheat stretched endlessly on either side. The passengers gazed out the windows, lost in thought, each on their own journey to unknown destinations.",
      "The ancient tree stood tall, its gnarled roots twisting deep into the earth. Generations had passed beneath its branches, each one leaving a mark, a memory. Now, it was a silent witness to the passage of time, holding countless secrets.",
      "The rain began to fall, softly at first, then in torrents, drenching the streets. People hurried for cover, their umbrellas struggling against the wind, as the storm intensified around them.",
    ];
    // const text = "In the heart of the forest.";
    const [selected, setSelected] = useState(Math.floor(Math.random() * 8));
    const [words, setWords] = useState(text[selected].split(' '));
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [status, setStatus] = useState(words.map(word => Array(word.length).fill(null)));
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [backCount, setBackCount] = useState(0);
    const [finished, setFinished] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
          const key = e.key;
          const currentWord = words[currentWordIndex];

        //   if(currentPosition >= text.length) return;
          
        if (!startTime && key.length === 1) {
            setStartTime(Date.now());
            console.log(text[selected].length);
        }
          if(currentPosition < text[selected].length){
    
          // Handle backspace
          if (key === 'Backspace') {
            if (currentPosition > 0) {
              setCurrentPosition(currentPosition - 1);
    
              // Reset the status of the previous character to null
              const newStatus = [...status];
              newStatus[currentWordIndex][currentPosition - 1] = null;
              setStatus(newStatus);
              setBackCount((backCount+1));
            }
          } 
          // Handle typing a character
          else if (key.length === 1 && currentPosition < currentWord.length) {
            if (key === currentWord[currentPosition]) {
              const newStatus = [...status];
              newStatus[currentWordIndex][currentPosition] = 'correct';
              setStatus(newStatus);
              setCurrentPosition(currentPosition + 1);
              
              if (currentWordIndex === words.length - 1 && currentPosition === currentWord.length - 1) {
                  setEndTime(Date.now());
                  setFinished(true);
                }
            }
            else {
                const newStatus = [...status];
                setCurrentPosition(currentPosition + 1);
                newStatus[currentWordIndex][currentPosition] = 'incorrect';
                setStatus(newStatus);
            }
          }
    
          if (key === ' ') {
                setCurrentWordIndex(currentWordIndex + 1);
                setCurrentPosition(0);
                setUserInput('');
          }}
        };
    
        document.addEventListener('keydown', handleKeyDown);


    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [currentWordIndex, currentPosition, status, startTime]);
    
      const calculateTimeTaken = () => {
        if (startTime && endTime) {
          const timeTaken = (endTime - startTime) / 1000; // time in seconds
          // console.log("back count"+backCount);
          return timeTaken.toFixed(2);
        }
        return null;
      };

      const handleStartOver = () => {
        const newvalue = Math.floor(Math.random() * 8); 
        if(selected === newvalue){
          handleStartOver();
        }
        else{
          setSelected(newvalue);
          const newWords = text[newvalue].split(' '); 
          setWords(newWords);
          // console.log(newvalue);
          setFinished(false);
          setCurrentWordIndex(0);
          setCurrentPosition(0);
          setUserInput('');
          setStatus(newWords.map(word => Array(word.length).fill(null)));
          setStartTime(null);
          setEndTime(null);
          setBackCount(0);
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
      };
    
    return (
        <div className='Home-main'> 
            <div className='Home-container'>
                <div className='Home-text-box'>
                {words.map((word, wordIndex) => (
                    <span key={wordIndex} style={{ marginRight: '8px' }}>
                        {word.split('').map((char, charIndex) => (
                        <span
                            key={charIndex}
                            style={{
                            backgroundColor:
                                status[wordIndex][charIndex] === 'incorrect'
                                ? '#FF7043'
                                : 'transparent',
                            color: status[wordIndex][charIndex] === 'correct' ? '#80CBC4' : '#2F4F4F',
                            textDecoration:
                            wordIndex === currentWordIndex && charIndex === currentPosition
                                ? 'underline'
                                : 'none',
                            }}
                        >
                            {char}
                        </span>
                        ))}
                    </span>
                    ))}
                </div>
                <div className='Home-input-box'>
                    <input
                        type="text"
                        style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
                        value={userInput}
                        onChange={() => {}}
                        ref={inputRef}
                        autoFocus
                    />
                    <button onClick={handleStartOver} id="bottone5">Start Over</button>
                </div>
                {(finished)? 
                <div className='Home-result-box'>
                    <label>Speed : <span>{Math.trunc((text[selected].length*60) / (calculateTimeTaken()*6))}</span> WPM</label><br/>
                    <label>Accuracy : <span>{Math.trunc(((text[selected].length-backCount)*100) / text[selected].length)}</span> %</label>
                </div>
                 : <div></div>}
            </div>
        </div>
    )
}

export default Home;