import "./StartScreen.css"

const StartScreen = ({startGame, pitoca}) => {

  const handleStartGame = () =>{
    startGame()
    pitoca()
  }
  
  return (
    <div className="start">
        <h1>Secret Word</h1>
        <p>Clique no botao abaixo para começar a jogar</p>
        <button onClick={handleStartGame}>
          Começar o jogo
        </button>
    </div>
  )
}

export default StartScreen