import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import { random_words } from "./Helper";

function TestPage({PracticeMode, setPracticeMode, loggedIn, setLoggedIn}) {
  const [username, setUsername] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [status, setStatus] = useState();
  const [startTime, setStartTime] = useState("");
  const [output, setOutput] = useState([-1, -1]); // stores [speed, accuracy]
  const [finished, setFinished] = useState(false);

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
    if(!loggedIn){
        return;
    }
    const handleKeyDown = (e) => {
      const key = e.key;
      const currentWord = words[currentWordIndex];
      
      // Ignore further key presses if the test is finished
      if (finished) {
          return;
        }
        // console.log(currentWordIndex, currentPosition);

      if (!startTime && key.length === 1) {
        setStartTime(Date.now());
      }

      if (currentPosition < words.length) {
        // Handle backspace
        if (key === "Backspace") {
          if (currentPosition > 0) {
            const newCurrentPos = currentPosition-1
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
            const tempCurrPos = currentPosition+1
            setCurrentPosition(tempCurrPos);
            
            // If the last word is completed with a character, mark the test as finished
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
        //   -----------------------------------------------------------------------
          // If the user presses space before finishing the current word
          if (currentPosition < currentWord.length-1) {
            const newStatus = [...status];

            // Mark remaining characters of the current word as incorrect
            for (let i = currentPosition; i < currentWord.length; i++) {
              newStatus[currentWordIndex][i] = "incorrect";
            }
            setStatus(newStatus);
          }

          // Correctly typed space between words
          if (currentPosition === currentWord.length) {
            const newStatus = [...status];
            if (currentWordIndex < words.length - 1) {
              newStatus[currentWordIndex].push("correct"); // Mark space as correct
            }
            setStatus(newStatus);
          }

          // Check if this is the last word
          if (currentWordIndex === words.length - 1) {
            // End the test if the last word is reached and space is pressed
            const eTimetemp = Date.now();
            calcOutput(eTimetemp);
            setFinished(true);
          } else {
            // Move to the next word only if there are more words left
            const temp = currentWordIndex+1
            setCurrentWordIndex(temp);
            setCurrentPosition(0);
          }

          // Refocus input after space press
          if (inputRef.current) {
            inputRef.current.focus();
          }
        //   ------------------------------------------------------------------------
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
    getRandomWords();
    setFinished(false);
    setCurrentWordIndex(0);
    setCurrentPosition(0);
    setStartTime(null);
    setOutput([-1, -1]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLogin = () =>{
    setLoggedIn(true);
    setFinished(false);
    setCurrentWordIndex(0);
    setCurrentPosition(0);
    setStartTime(null);
    setOutput([-1, -1]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handlePracticeMode = () => {
    setPracticeMode(true);
  }

  return (
    <div className="Home-main">
        {!loggedIn && (
            <div className="login-box">
            <h2>Enter your Roll No.</h2>
            <form onSubmit={handleLogin} className="form-login">
                <input
                    className="input-roll"
                    type="text"
                    placeholder="Roll No."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button className="button-login">Login</button>
            </form>
            </div>
        )}
        {(<div className="Home-main">
        <div className={`Home-container ${loggedIn ? "": "blurred"}`}>
        <div>
            <button onClick={handlePracticeMode}>Practice</button>
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
                ref={loggedIn? inputRef:null}
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

export default TestPage;
