import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Form, Item, Button, Icon, Text } from 'native-base';
// import { Speech } from 'expo';

const autoBind = require('auto-bind');

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state={
            text: ""
        }
        autoBind(this)
    }

    handleSearch(){
        this.setState({text: "button pressed"})
    }

    render() {
        return(
            <View>
                <Form>
                    <Item style={styles.item}>
                        <Input placeholder="Search" value={this.state.text} onChangeText={(text)=>this.setState({text: text})}/>
                        <Button rounded bordered warning onPress={this.handleSearch}>
                            <Icon type="Octicons" name="search"/>
                        </Button>
                    </Item>
                </Form>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item:{
        flexDirection: "row",
        paddingTop: 10
    }
})