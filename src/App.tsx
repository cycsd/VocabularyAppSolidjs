import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { A, Route, Routes } from '@solidjs/router';
import { Home } from './pages/Home';
import { Paragraph } from './pages/Paragraph';
import { WordProvider } from './context/WordContext';

const App: Component = () => {
  return (
    <div class="container m-auto">
      <header class="my-4 p-2 text-xl flex items-center gap-4 justify-start">
        <A href='/'>Home</A>
      </header>
      <WordProvider>
      <Routes>
        <Route path={"/"} component={Home}></Route>
        <Route path={"/paragraph/:path"} component={Paragraph}></Route>
      </Routes>
      </WordProvider>
    </div>
  );
};

export default App;
