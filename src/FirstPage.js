import React, {useState} from 'react'
import PracticePage from './PracticePage';
import TestPage from './TestPage';

function FirstPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    // const [username, setUsername] = useState("");
    const [PracticeMode, setPracticeMode] = useState(false);

    return (
        <div>
            {PracticeMode? 
                <PracticePage PracticeMode={PracticeMode} setPracticeMode={setPracticeMode} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>:
                <TestPage  PracticeMode={PracticeMode} setPracticeMode={setPracticeMode} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}   
        </div>
    )
}

export default FirstPage