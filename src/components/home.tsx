import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';

interface AsyncFunc {
  (game_name: string, score: number): Promise<void>;
}

type Greet = {
  greet: (() => void) | null;
  send_score: AsyncFunc | null;
};

const HomePage = () => {
  // const load = () => {
  // }
  // useEffect(() => {
  //   const promise = await import('testWasm');
  //   promise.greet();
  // }, []);
  const isLoggedIn = useContext(UserContext)?.isLoggedIn;
  const [greet, setGreet] = useState<Greet>({ greet: null, send_score: null });
  useEffect(() => {
    const init = async () => {
      const wasm = await import('testWasm');
      setGreet(wasm);
    };
    init();
  }, []);

  return (
    <>
      <button
        onClick={async () => {
          if (greet.send_score) {
            const res = await greet.send_score('test_game', 100);
            console.log(res);
          }
        }}
      >
        Hello
      </button>
      <div className="p-20 h-screen flex justify-center items-start flex-col">
        <h1 className="text-5xl text-text">Welcome to Utopia 👋</h1>
        <p className="text-gray-400 mt-5 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
          consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo
          fugiat eveniet tempora, atque alias earum ullam inventore itaque
          sapiente iste?
        </p>
        <Link to={isLoggedIn ? '/game' : '/auth/login'}>
          <button className="p-4 bg-green-600 rounded-lg font-bold text-text mt-5 hover:bg-gray-600">
            Start the journey
          </button>
        </Link>
      </div>
    </>
  );
};

export { HomePage };
