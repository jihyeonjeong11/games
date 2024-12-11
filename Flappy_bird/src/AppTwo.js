import React from "react";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version
  return (...args) => {
    if (timerFlag === null) {
      // If there is no timer currently running
      mainFunction(...args); // Execute the main function
      timerFlag = setTimeout(() => {
        // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}

const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 2;
const PIPE_WIDTH = 52;
const OBJ_SPEED = 2;
const OBJ_GAP = 200;

const AppTwo = () => {
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirdpos] = useState(WALL_HEIGHT / 2);
  const [pipeHeight, setPipeHeight] = useState(0);
  const [pipePos, setPipepos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const birdPosRef = useRef(birdpos);

  const birdAnimationFrameId = useRef();
  const pipeAnimationFrameId = useRef();

  useEffect(() => {
    birdPosRef.current = birdpos; // Sync ref with state
  }, [birdpos]);

  useEffect(() => {
    if (!isStart) return;
    const updateGravity = () => {
      if (birdPosRef.current >= WALL_HEIGHT - BIRD_HEIGHT) {
        cancelAnimationFrame(birdAnimationFrameId.current);
        return;
      }
      setBirdpos((prev) => prev + GRAVITY);
      birdAnimationFrameId.current = requestAnimationFrame(updateGravity);
    };

    birdAnimationFrameId.current = requestAnimationFrame(updateGravity);

    return () => cancelAnimationFrame(birdAnimationFrameId.current);
  }, [birdpos, isStart]);

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < pipeHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
        WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - pipeHeight) - BIRD_HEIGHT;

    if (
      pipePos >= PIPE_WIDTH &&
      pipePos <= PIPE_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setBirdpos(300);
      setScore(0);
      setPipepos(WALL_WIDTH);
      setPipeHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
    }

    if (birdpos + BIRD_HEIGHT >= WALL_HEIGHT) {
      setIsStart(false);
      setBirdpos(300);
      setScore(0);
      setPipepos(WALL_WIDTH);
      setPipeHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
    }
  }, [birdpos, pipeHeight, pipePos]);

  useEffect(() => {
    if (!isStart) return;
    const moveObstacles = () => {
      if (pipePos <= -PIPE_WIDTH) {
        setPipepos(WALL_WIDTH);
        setPipeHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
        if (isStart) setScore((prev) => score + 1);
      } else {
        setPipepos((prev) => prev - OBJ_SPEED);
      }

      pipeAnimationFrameId.current = requestAnimationFrame(moveObstacles);
    };

    pipeAnimationFrameId.current = requestAnimationFrame(moveObstacles);

    return () => cancelAnimationFrame(pipeAnimationFrameId.current);
  }, [isStart, pipePos, score]);

  const onKeyDown = (e) => {
    if (e.code === "Space" && isStart) {
      setBirdpos((prev) => Math.max(0, prev - 50));
    }
  };
  return (
    <Home onKeyDown={onKeyDown} tabIndex={0}>
      <ScoreShow>Score: {score}</ScoreShow>
      <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
        {!isStart ? (
          <Startboard onClick={() => setIsStart(true)}>
            Click To Start
          </Startboard>
        ) : null}
        <Obj
          height={pipeHeight}
          width={PIPE_WIDTH}
          left={pipePos}
          top={0}
          deg={180}
        />
        <Bird
          height={BIRD_HEIGHT}
          width={BIRD_WIDTH}
          top={birdpos}
          left={100}
        />
        <Obj
          height={WALL_HEIGHT - OBJ_GAP - pipeHeight}
          width={PIPE_WIDTH}
          left={pipePos}
          top={
            WALL_HEIGHT - (pipeHeight + (WALL_HEIGHT - OBJ_GAP - pipeHeight))
          }
          deg={0}
        />
      </Background>
    </Home>
  );
};

export default AppTwo;

const Home = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  background-image: url("./images/background-day.png");
  background-repeat: cover;
  background-size: contain;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url("./images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("./images/pipe-green.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const ScoreShow = styled.div`
  position: absolute;
  top: 10%;
  left: 47%;
  z-index: 1;
  font-weight: bold;
  font-size: 30px;
`;

const Startboard = styled.div`
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;
