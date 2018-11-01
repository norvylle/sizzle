import React, { Component } from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Form, Item, Input, Label, Button } from 'native-base';

const autoBind = require('auto-bind');

export default class TitlePage extends Component {
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
    // Alert.alert(
    //   'Alert',
    //   'You entered\n'+this.state.username+'\n'+this.state.password,
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
    //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //   ],
    //   { cancelable: true }
    // )
    // this.setState({username:"",password:""})
    this.props.navigation.navigate('App');
  }

  handleCreate(){
    this.props.navigation.navigate('Create');
  }
  
  async componentWillMount(){
    await Font.loadAsync({
      'fantastic': require('../assets/fonts/fantastic.ttf'),
      'geoSansLight': require('../assets/fonts/geoSansLight.ttf'),
      'roboto': require('native-base/Fonts/Roboto.ttf'),
      'roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({fontOK: true})
  }

  render() {
    return (
      <View style={styles.view}>
      {
      this.state.fontOK ? (
      <View>
      <Text style={styles.title}>Sizzle</Text>
      <Text style={styles.text}>Login to Sizzle.</Text>
      </View>
      ) : null
      } 
      <Form>
      <Item stackedLabel >
      <Label style={styles.label}>Username</Label>
      <Input style={styles.input} value={this.state.username} onChangeText={(username)=> this.setState({username})} maxLength={50}/>
      </Item>
      <Item stackedLabel >
      <Label style={styles.label}>Password</Label>
      <Input style={styles.input} value={this.state.password} secureTextEntry={true} onChangeText={(password)=> this.setState({password})} maxLength={32}/>
      </Item>
      </Form>
      <Text style={{paddingTop:10}}/>
      <Button default block rounded style={styles.button} onPress={this.handleLogin}>
      {
        this.state.fontOK ? (<Text style={styles.buttonText}>LOGIN</Text>) : (<Text>LOGIN</Text>)
      }
      </Button>
      <Text style={{paddingTop:50}}/>
      <Button transparent style={styles.create} onPress={this.handleCreate}>
        <Text>Create Account</Text>
      </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#ff5733',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title:{
    color:'#fff',
    fontFamily:'fantastic', 
    fontSize:40,
    textAlign:"center",
    paddingBottom:30
  },
  text:{
    color:'#fff',
    fontFamily:'roboto', 
    fontSize:20,
    textAlign:"left",
    paddingLeft:15,
    paddingBottom:10
  },
  label:{
    color:'#fff',
  },
  input:{
    color:'#fff',
    fontSize: 18,
  },
  button:{
    width: 200,
    alignSelf: "center",
  },
  buttonText:{
    fontFamily:'roboto_medium',
    color:'#fff'
  },
  create:{
    paddingVertical: 10,
    alignSelf: "center",
  }
});