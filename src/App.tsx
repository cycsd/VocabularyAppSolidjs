import type { Component } from 'solid-js';

// import logo from './logo.svg';
// import styles from './App.module.css';
import { A, Route, Routes } from '@solidjs/router';
import { Home } from './pages/Home';
import { Paragraph } from './pages/Paragraph';
import { Dictionary } from './pages/Dictionary';

const App: Component = () => {
  return (
    <div class="container m-auto">
      <header class="my-4 p-2 text-xl flex items-center gap-4 justify-start">
        <A href='/'>Home</A>
        <A href='/words'>Words</A>
      </header>
      <Routes>
        <Route path={"/"} component={Home}></Route>
        <Route path={"/paragraph/:path"} component={Paragraph}></Route>
        <Route path={"/words"} component={Dictionary}></Route>
      </Routes>
    </div>
  );
};

export default App;
