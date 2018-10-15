import React, { Component } from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View } from 'react-native';

class TitlePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      text: "Sizzle",
      fontOK: false
    }
  }
  
  async componentWillMount(){
    await Font.loadAsync({
      'fantastic': require('../assets/fonts/fantastic.ttf')
    });
    this.setState({fontOK: true})
  }

  render() {
    return (
      <View style={styles.view}>
      {
      this.state.fontOK ? (
      <Text style={styles.text}>{this.state.text}</Text>
      ) : null
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#ff5733',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:'#fff',
    fontFamily:'fantastic', 
    fontSize:72,
  }
});

export default TitlePage;