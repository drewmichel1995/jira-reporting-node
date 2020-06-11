import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import SheetView from './components/SheetView';

export default function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" render={props => <SheetView {...props} />} />
      </div>
    </HashRouter>
  );
}
