import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import { random_words } from "./Helper";
import generatePracticeWords from "./GenerateWords";

function PracticePage({PracticeMode, setPracticeMode, loggedIn, setLoggedIn}) {
  // const [username, setUsername] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [status, setStatus] = useState();
  const [startTime, setStartTime] = useState("");
  const [startWordTime, setStartWordTime] = useState("");
  const [output, setOutput] = useState([-1, -1]); // stores [speed, accuracy]
  const [finished, setFinished] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [totalSpeed, setTotalSpeed] = useState(0);
  const [slowWords, setSlowWords] = useState({});

  const inputRef = useRef(null);

  const getRandomWords = () => {
    // Get a random number between 40 and 60
    const numberOfWords = Math.floor(Math.random() * 21) + 5;

    // Shuffle the array
    const shuffledWords = [...random_words].sort(() => 0.5 - Math.random());

    // Select the first 'numberOfWords' from the shuffled array
    const selectedWords = shuffledWords.slice(0, numberOfWords);
    setStatus(selectedWords.map((word) => Array(word.length).fill(null)));

    // Update the state with the selected words
    setWords(selectedWords);
  };

  // Trigger getRandomWords on component mount
  useEffect(() => {
    getRandomWords();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const currentWord = words[currentWordIndex];
  
      // Ignore further key presses if the test is finished
      if (finished) {
          return;
      }
  
      // Start timing the word
      if (!startTime && key.length === 1) {
          setStartTime(Date.now());
      }
  
      if (currentPosition < words.length) {
          // Handle backspace
          if (key === "Backspace") {
              if (currentPosition > 0) {
                  const newCurrentPos = currentPosition - 1;
                  setCurrentPosition(newCurrentPos);
  
                  const newStatus = [...status];
                  newStatus[currentWordIndex][newCurrentPos] = null;
                  setStatus(newStatus);
              }
          }
          // Handle typing a character
          else if (key.length === 1 && currentPosition < currentWord.length) {
              if (key === currentWord[currentPosition]) {
                  const newStatus = [...status];
                  newStatus[currentWordIndex][currentPosition] = "correct";
                  setStatus(newStatus);
                  const tempCurrPos = currentPosition + 1;
                  setCurrentPosition(tempCurrPos);
                  if (
                    currentWordIndex === words.length - 1 &&
                    tempCurrPos-1 === currentWord.length - 2
                    ) {
                    const eTimetemp = Date.now();
                    calcOutput(eTimetemp);
                    setFinished(true);
                  }
              } else {
                  const newStatus = [...status];
                  newStatus[currentWordIndex][currentPosition] = "incorrect";
                  setStatus(newStatus);
                  setCurrentPosition(currentPosition + 1);
              }
          }
  
          if (key === " ") {
              // Record end time for the current word
              const wordEndTime = Date.now();
              const wordDuration = (wordEndTime - startWordTime) / 1000; // Word duration in seconds
  
              // Update average and check for below-average speed
              setTotalWords((prev) => prev + 1);
              setTotalSpeed((prev) => prev + wordDuration);
              const newAverage = (totalSpeed + wordDuration) / (totalWords + 1);
  
              if (wordDuration < newAverage) {
                // if(slowWords.length < 10){
                    setSlowWords((prev) => ({
                        ...prev,
                        [currentWord]: wordDuration,
                    }));
                // }
              }

              if (status[currentWordIndex].includes("incorrect")) {
                setWrongWords((prev) => {
                    if (!prev.includes(currentWord)) {
                        return [...prev, currentWord];
                    }
                    return prev;
                });
            }
  
              // Reset word timing
              setStartWordTime(null);
            //   setStartWordTime(null);
  
              // Move to the next word
              if (currentPosition < currentWord.length - 1) {
                  const newStatus = [...status];
                  for (let i = currentPosition; i < currentWord.length; i++) {
                      newStatus[currentWordIndex][i] = "incorrect";
                  }
                  setStatus(newStatus);
              } else if (currentPosition === currentWord.length) {
                  const newStatus = [...status];
                  if (currentWordIndex < words.length - 1) {
                      newStatus[currentWordIndex].push("correct");
                  }
                  setStatus(newStatus);
              }
  
              if (currentWordIndex === words.length - 1) {
                  const eTimetemp = Date.now();
                  calcOutput(eTimetemp);
                  setFinished(true);
              } else {
                  setCurrentWordIndex((prev) => prev + 1);
                  setCurrentPosition(0);
              }
          }
      }
  };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWordIndex, currentPosition, status, startTime, finished]);

  const calcOutput = (eTime) => {
    let correctCount = 0;
    let totalChars = 0;
    const timeTaken = ((eTime - startTime) / 1000).toFixed(2);

    status.forEach((wordStatus, wordIndex) => {
      wordStatus.forEach((charStatus) => {
        totalChars++; // Count every character
        if (charStatus === "correct") {
          correctCount++;
        }
      });
    });

    totalChars--;

    setOutput([ Math.trunc((totalChars * 60) / (timeTaken * 5)), Math.trunc((correctCount * 100) / totalChars)]);
  }

  const handleStartOver = () => {
    const sloww = [slowWords];
    const newwords = generatePracticeWords(wrongWords, sloww, 20); 
    setStatus(newwords.map((word) => Array(word.length).fill(null)));
    setWords(newwords);
    setWrongWords([]);
    setSlowWords({});
    setTotalSpeed(0)
    setFinished(false);
    setCurrentWordIndex(0);
    setCurrentPosition(0);
    setStartTime(null);
    setOutput([-1, -1]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTestMode = () => {
    setPracticeMode(false);
  }


  return (
    <div className="Home-main">
        {(<div className="Home-main">
        <div className={`Home-container`}>
            <div>
                <button onClick={handleTestMode}>Test your speed</button>
            </div>
            <div className="Home-text-box">
            {words.map((word, wordIndex) => (
                <span key={wordIndex}>
                {word.split("").map((char, charIndex) => (
                    <span
                    key={charIndex}
                    style={{
                        backgroundColor:
                        status[wordIndex][charIndex] === "incorrect"
                            ? "#FF7043"
                            : "transparent",
                        color:
                        status[wordIndex][charIndex] === "correct"
                            ? "#80CBC4"
                            : "#2F4F4F",
                        textDecoration:
                        wordIndex === currentWordIndex &&
                        charIndex === currentPosition
                            ? "underline"
                            : "none",
                    }}
                    >
                    {char}
                    </span>
                ))}
                </span>
            ))}
            </div>
            <div className="Home-input-box">
            <input
                type="text"
                style={{ opacity: 0, position: "absolute", left: "-9999px" }}
                onChange={() => {}}
                autoFocus
            />
            <button onClick={handleStartOver} id="bottone5">
                Start Over
            </button>
            </div>
            {finished ? (
            <div className="Home-result-box">
            {(output[0] !== -1)? 
            <div>
            {(output[1] >= 80) ? (
                <>
                    <label>
                    Speed :{" "}
                    <span>
                        {output[0]}
                    </span>{" "}
                    WPM
                    </label>
                    <br />
                    <label>
                    Accuracy : <span>{output[1]}</span> %
                    </label>
                </>
                ) : (
                <div style={{ color: "red" }}>Your accuracy is below 80%.</div>
                )}
            </div>: 
            <div>
                wait
            </div>}
            </div>
            ) : (
            <div></div>
            )}
        </div>
        </div>)}
    </div>
  );
}

export default PracticePage