import React from 'react';
import { HashRouter, BrowserRouter, Route } from 'react-router-dom'
import Menu from './Menu'
import Foo from './pages/Foo'
import Bar from './pages/Bar'

const config = { useHash: true }

const Router = config.useHash ? HashRouter : BrowserRouter

function App() {
  return (
    <Router>
      <Menu />
      <Route path="/foo">
        <Foo />
      </Route>
      <Route path="/bar">
        <Bar />
      </Route>
    </Router>
  );
}

export default App;
