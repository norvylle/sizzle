import React, { Component } from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const autoBind = require('auto-bind');

class TitlePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      fontOK: false,
      username:"",
      password:""
    }
    autoBind(this);
  }

  handleLogin(){
    Alert.alert(
      'Alert',
      'You entered\n'+this.state.username+'\n'+this.state.password,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: true }
    )
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
      <Text style={styles.text}>Sizzle</Text>
      ) : null
      }
      <Text style={{padding: 10}}/>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#ff5733" onChangeText={(username)=> this.setState({username})} underlineColorAndroid='#fff' maxLength={10}/>
      <Text style={{padding: 5}}/>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ff5733" onChangeText={(password)=> this.setState({password})} underlineColorAndroid='#fff' secureTextEntry={true} maxLength={16}/>
      <Text style={{padding: 5}}/>
      <Button onPress={this.handleLogin} title="Login"/>
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
  },
  input:{
    height:50,
    width:220,
    color:'#000',
    fontSize:25,
    textAlign:'center',
    backgroundColor:'#fff',
    alignItems:"center",
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:20,
  }
});

export default TitlePage;