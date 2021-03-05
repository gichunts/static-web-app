import React, { Component, lazy, Suspense } from 'react';
import 'bulma/css/bulma.css';
import './styles.scss';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { HeaderBar, NavBar, NotFound } from './components';
import About from './pages/About';
import TriviaGame from './pages/TriviaGame';
import JoinGame from './pages/JoinGame';
import PlayGame from './pages/PlayGame';
import EndOfTheGame from './pages/EndOfTheGame';

const Products = withRouter(
  lazy(() => import(/* webpackChunkName: "products" */ './products/Products')),
);

class App extends Component {
  render() {
    return (
      <div>
        <HeaderBar />
        <div className="section columns">
          <NavBar />
          <main className="column">
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                {/* <Redirect from="/" exact to="/products" /> */}
                <Redirect from="/" exact to="/triviagame" />
                <Route path="/products" component={Products} />
                <Route path="/about" component={About} />
                <Route exact path="/triviagame" component={TriviaGame} />
                <Route path="/game/join/:id" component={JoinGame} />
                <Route path="/game/play/:id/:playerId" component={PlayGame} />
                <Route
                  path="/game/finish/:id/:playerId"
                  component={EndOfTheGame}
                />

                <Route exact path="**" component={NotFound} />
              </Switch>
            </Suspense>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
