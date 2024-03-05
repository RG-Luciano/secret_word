import './App.css';
import { wordsList } from './data/Words';
import {useCallback, useEffect, useState} from "react"
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages= [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])


  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback (() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(category, word)
    return {word, category}
  }, [words])

  const onlyStart = ()=>{
    setGameStage(stages[1].name)
        // clear all letters
    clearLettersStates()
    //pick word and pick category
    const {word, category } = pickWordAndCategory()
    // create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l)=> l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
  }
  // starts the scret word game
  const startGame = ()=> {
    setGameStage(stages[0].name)
  }

  // process the letter input
  const verifyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }
    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters)=>[
        ...actualGuessedLetters,
        letter
      ])
    }else{
      setWrongLetters((actualWrongLetters)=>[
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1);
    }

  }

    // restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(3)
      
    setGameStage(stages[0].name)
  }
  
  const clearLettersStates = ()=>{
    setGuessedLetters([])
    setWrongLetters([])
  }
  useEffect(()=>{

    if(guesses === 0){
      //reset  all states
      clearLettersStates()

      setGuessedLetters(pickedWord.toLowerCase().split(""))

      setTimeout (function(){
        setGameStage(stages[2].name)
    }, 500)
    }

  },[guesses, pickedWord])

  // check win condition
  useEffect(()=>{

    const uniqueLetters=[...new Set(letters)]
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      //add score
      setScore((actualScore)=> actualScore += 100)

      //restart game with new word
      setTimeout (function(){

      startGame()

      }, 500)
    }

  },[guessedLetters, letters, gameStage])

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} onlyStart={onlyStart} />}
      {gameStage === 'game' && 
        <Game 
          verifyLetter={verifyLetter}  
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score} 
        />
      }
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
