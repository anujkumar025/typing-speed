const generatePracticeWords = (wrongWordsArray, slowWordsDict, totalWords) => {
    // console.log("slowWordsDict", slowWordsDict);
    // return ["weriw"];
    // Generate a dictionary of English words (this will be the actual list of words)
    const generateEnglishDictionary = () => {
      return [
        "able ", "about ", "above ", "accept ", "according ", "account ", "across ", "act ", "action ", "activity ",
        "advice ", "affect ", "after ", "again ", "against ", "agency ", "agent ", "air ", "all ", "almost ", "along ",
        "already ", "although ", "always ", "among ", "amount ", "analysis ", "analyze ", "ancient ", "anger ", "animal ",
        "answer ", "any ", "apart ", "appeal ", "appear ", "approve ", "area ", "argue ", "arrive ", "artist ", "attack ",
        "attempt ", "author ", "average ", "bacon ", "balance ", "battery ", "beach ", "begin ", "believe ", "benefit ",
        "bicycle ", "billion ", "bother ", "bottle ", "boundary ", "brain ", "breathe ", "brother ", "button ", "candle ",
        "capital ", "carbon ", "category ", "cattle ", "celebrate ", "century ", "chance ", "change ", "charge ", "choice ",
        "citizen ", "classic ", "clean ", "climate ", "close ", "colour ", "company ", "computer ", "contract ", "control ",
        "convince ", "create ", "current ", "danger ", "daughter ", "debate ", "decide ", "define ", "democracy ", "detect ",
        "develop ", "direct ", "discuss ", "disease ", "donate ", "effect ", "enrich ", "escape ", "evaluate ", "example ",
        "expect ", "express ", "factor ", "fashion ", "female ", "fiction ", "follow ", "forbid ", "forget ", "gather ",
        "general ", "genuine ", "glance ", "gospel ", "govern ", "growth ", "handle ", "hardly ", "health ", "holiday ",
        "honest ", "hunger ", "hypothesis ", "identify ", "impact ", "import ", "include ", "interest ", "invest ", "invite ",
        "jungle ", "justify ", "label ", "library ", "local ", "machine ", "manage ", "master ", "method ", "modern ",
        "modify ", "narrow ", "nature ", "notice ", "object ", "operate ", "outcome ", "particular ", "patient ", "politics ",
        "positive ", "potential ", "preach ", "prepare ", "progress ", "project ", "propose ", "purpose ", "quality ",
        "quantity ", "reaction ", "relate ", "result ", "revise ", "sample ", "simple ", "society ", "species ", "strength ",
        "strategy ", "succeed ", "support ", "symbol ", "talent ", "target ", "theory ", "traffic ", "uncover ", "unique ",
        "unite ", "variety ", "volume ", "vulnerable ", "welcome ", "witness ", "wonder ", "xenon ", "yesterday ", "yoga ", "zebra ",
        "abandon ", "ability ", "absent ", "abstract ", "academy ", "accept ", "access ", "accident ", "accommodate ", "accompany ",
        "accuracy ", "achieve ", "acquire ", "address ", "advance ", "adventure ", "advice ", "affect ", "afford ", "against ",
        "agency ", "airport ", "allegro ", "ancient ", "analysis ", "ancient ", "animal ", "annual ", "answer ", "anxiety ",
        "apology ", "appeal ", "approve ", "arrange ", "arrival ", "article ", "assault ", "assess ", "attempt ", "balance ",
        "barrier ", "beauty ", "beyond ", "bicycle ", "biography ", "biology ", "bravery ", "breathe ", "brother ", "camera ",
        "cancer ", "celebrate ", "chance ", "channel ", "chronic ", "circular ", "classic ", "climate ", "combine ", "common ",
        "concept ", "concert ", "construct ", "contain ", "culture ", "debate ", "detect ", "destroy ", "dynamic ", "economy ",
        "educate ", "empathy ", "enjoy ", "entertain ", "equality ", "essence ", "evidence ", "expand ", "failure ", "famous ",
        "fantasy ", "fashion ", "feature ", "fertile ", "flavor ", "fortune ", "freedom ", "friendly ", "gather ", "glimpse ",
        "global ", "guitar ", "harmony ", "hidden ", "horizon ", "honest ", "honor ", "hospital ", "imagine ", "impact ", "infer ",
        "inspire ", "integrate ", "invade ", "jungle ", "justify ", "library ", "magnet ", "meaning ", "modern ", "narrow ",
        "observe ", "option ", "outcome ", "passion ", "payment ", "pioneer ", "police ", "present ", "priority ", "project ",
        "question ", "reality ", "refuse ", "remote ", "rescue ", "reunion ", "safety ", "sample ", "search ", "sequence ",
        "simplify ", "society ", "suggest ", "survival ", "tolerate ", "traffic ", "unique ", "unite ", "vaccine ", "venture ",
        "visible ", "volcano ", "vulnerable ", "welcome ", "wonder ", "witness ", "xenon ", "yoga ", "yellow ", "zealot ",
        "zephyr ", "zeal ", "zodiac ", "zoom "
      ]; // This list is dynamically used as the dictionary
    };
  
    // Keyboard adjacency mapping (topographical similarity)
    const keyboard_adjacency = {
      'q': ['w', 'a'], 'w': ['q', 'e', 's'], 'e': ['w', 'r', 'd'], 'r': ['e', 't', 'f'], 't': ['r', 'y', 'g'],
      'y': ['t', 'u', 'h'], 'u': ['y', 'i', 'j'], 'i': ['u', 'o', 'k'], 'o': ['i', 'p', 'l'], 'p': ['o'],
      'a': ['q', 's', 'z'], 's': ['a', 'w', 'd', 'x'], 'd': ['s', 'e', 'f', 'c'], 'f': ['d', 'r', 'g', 'v'],
      'g': ['f', 't', 'h', 'b'], 'h': ['g', 'y', 'j', 'n'], 'j': ['h', 'u', 'k', 'm'], 'k': ['j', 'i', 'l'],
      'l': ['k', 'o'], 'z': ['a', 'x'], 'x': ['z', 's', 'c'], 'c': ['x', 'd', 'v'], 'v': ['c', 'f', 'b'],
      'b': ['v', 'g', 'n'], 'n': ['b', 'h', 'm'], 'm': ['n', 'j']
    };
  
    // Helper function to get topographically similar words based on keyboard adjacency
    const getTopographicalSimilarWords = (baseWord, dictionary, top_n = 3) => {
      let similarWords = [];
      
      // Topographical similarity: find neighboring keys
      for (let char of baseWord) {
        if (keyboard_adjacency[char]) {
          similarWords = [...similarWords, ...keyboard_adjacency[char]];
        }
      }
  
      // Filter similar words to be valid dictionary words (in the dictionary list)
      const validSimilarWords = similarWords.filter(word => dictionary.includes(word) && word !== baseWord);
  
      // Return top N similar words based on adjacency
      return validSimilarWords.slice(0, top_n);
    };
  
    // Convert slowWordsDict (array of dictionaries) to a flattened list of words
    const extractSlowWords = (slowWordsDict) => {
      let slowWords = [];
      for (let session of slowWordsDict) {
        slowWords = [...slowWords, ...Object.keys(session)];
      }
      return slowWords;
    };
  
    // Flatten wrongWordsArray and extract slow words from the dictionary
    const allWrongWords = wrongWordsArray.flat();
    const allSlowWords = extractSlowWords(slowWordsDict);
  
    // Calculate word counts
    const wrongWordsCount = Math.floor(totalWords * 0.3);
    const slowWordsCount = Math.floor(totalWords * 0.2);
    const randomWordsCount = totalWords - wrongWordsCount - slowWordsCount;
  
    let practiceWords = [];
    const dictionary = generateEnglishDictionary();
  
    // Add similar words for wrong words
    allWrongWords.forEach(wrongWord => {
      if (practiceWords.length < wrongWordsCount) {
        practiceWords = [
          ...practiceWords,
          ...getTopographicalSimilarWords(wrongWord, dictionary)
        ];
      }
    });
  
    // Add similar words for slow words
    allSlowWords.forEach(slowWord => {
      if (practiceWords.length < wrongWordsCount + slowWordsCount) {
        practiceWords = [
          ...practiceWords,
          ...getTopographicalSimilarWords(slowWord, dictionary)
        ];
      }
    });
  
    // Fill the rest with random words from the dictionary
    while (practiceWords.length < totalWords) {
      const randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
      if (!practiceWords.includes(randomWord)) {
        practiceWords.push(randomWord);
      }
    }
    // console.log(practiceWords.slice(0, totalWords));
    
    var newwords = practiceWords.slice(0, totalWords);
    wrongWordsArray.forEach(wrongword =>{
      newwords = [...newwords, wrongword];
    })
    const shuffledWords = [...newwords];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }
    return shuffledWords;
};

export default generatePracticeWords;