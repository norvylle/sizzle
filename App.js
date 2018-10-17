import React from 'react';
import TitlePage from './components/TitlePage';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TitlePage/>
    );
  }
}