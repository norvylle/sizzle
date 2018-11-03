import React, { Component } from 'react';
import { View } from 'react-native';
import { Input, Form, Item } from 'native-base';

// const autoBind = require('auto-bind');

export default class SearchPage extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View>
                <Form>
                    <Item><Input placeholder="Search"/></Item>
                </Form>
            </View>
        );
    }
}