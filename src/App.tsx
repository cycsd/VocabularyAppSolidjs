import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { A, Route, Routes } from '@solidjs/router';
import { Home } from './pages/Home';

const App: Component = () => {
  return (
    <div >
      <header>
        <A href='/'>Home</A>
      </header>
      <Routes>
        <Route path={"/"} component={Home}></Route>
      </Routes>
    </div>
  );
};

export default App;
