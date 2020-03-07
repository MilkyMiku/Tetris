import React, { useState } from 'react';

import { createStage , checkCollision} from "../gameHelpers";

import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import { StyledTetrisWrapper, StyledTetris} from "./styles/StyledTetris";


import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer) ;
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);
    console.log('re-render')

    const movePlayer = dir => {
        if(!checkCollision(player, stage, { x: dir, y: 0}))
        updatePlayerPos({x: dir, y: 0});
    }

    const startGame = () => {
        // Reset Everything
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setDropTime(500);
        setScore(0);
        setRows(0);
        setLevel(0);

    }

    const hardDrop = () => {
        console.log("Hard drop")
        let pot = 0;
        while (!checkCollision(player, stage, { x: 0, y: pot })) {
           pot += 1;
        }
        updatePlayerPos({ x: 0, y: pot-1 }); 
     }

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // With level comes speed
            if(dropTime < 400) {
                //If drop time is too fast to add 200...
                setDropTime(700 / (level + 1));
            }
            else {
                setDropTime(700 / (level + 1) + 200);
            }
        }
        if(!checkCollision(player, stage, {x: 0, y: 1})) {
            updatePlayerPos({x: 0, y: 1, collided: false})
        } else {
            // Game Over
            if(player.pos.y < 1) {
                console.log('Game Over');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true})
        }
    }

    const keyUp = ({keyCode}) => {
        if(!gameOver) {
            if(keyCode === 40) {
                console.log("Interval On")
                if(dropTime < 400) {
                    //If drop time is too fast to add 200...
                    setDropTime(500 / (level + 1));
                }
                else {
                    setDropTime(500 / (level + 1) + 200);
                }
            }
            if(keyCode === 32) {
                console.log("Hard drop off");
                if(dropTime < 400) {
                    //If drop time is too fast to add 200...
                    setDropTime(500 / (level + 1));
                }
                else {
                    setDropTime(500 / (level + 1) + 200);
                } 
            }
        }
    };

    const dropPlayer = () => {
        console.log("Interval Off")
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 37) {
                // if arrow left
                movePlayer(-1);
            }
            else if (keyCode === 39) {
                // if arrow right
                movePlayer(1);
            }
            else if (keyCode === 40) {
                // if arrow down
                dropPlayer();
            }
            else if (keyCode === 38 || keyCode === 90) {
                // if arrow up, or Z
                playerRotate(stage, 1);
            }
            else if(keyCode === 32) {
                // if spacebar
                hardDrop()
            }
            if(keyCode === 88) {
                // if arrow z
                playerRotate(stage, -1)
            }
        }
    }

    useInterval(() => {

        drop();
    }, dropTime)

    return(
        <StyledTetrisWrapper 
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
        >
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    {gameOver ? (
                        <div>
                            <Display gameOver={gameOver} text="Game Over"/>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                            <Display text={`Speed: ${dropTime ? dropTime : 0}`} />
                        </div>
                    ):(
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                            <Display text={`Speed: ${dropTime ? dropTime : 0}`} />
                        </div>
                    )};
                    <StartButton callback={startGame}/>
                </aside>
            </StyledTetris> 
        </StyledTetrisWrapper>
    )
}

export default Tetris