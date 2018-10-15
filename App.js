import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TitlePage from './components/TitlePage';

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
    /*
        <View style={styles.view}>
      {
      this.state.fontOK ? (
      <Text style={styles.text}>{this.state.text}</Text>
      ) : null
      }
      </View>
        */
  }

  render() {
    return (
      <TitlePage/>
    );
  }
}

// const styles = StyleSheet.create({
//   view: {
//     flex: 1,
//     backgroundColor: '#ff5733',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text:{
//     color:'#fff',
//     fontFamily:'fantastic', 
//     fontSize:72,
//   }
// });
