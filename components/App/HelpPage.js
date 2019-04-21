import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text } from 'native-base';
import Swiper from 'react-native-swiper';

const autoBind = require('auto-bind');

export default class HelpPage extends Component{
    constructor(props){
        super(props)
        this.state={
            
        }
        autoBind(this)
    }


    render(){
        return(
            <Swiper showsButtons={true} showsHorizontalScrollIndicator={true}>
                <ScrollView>
                    <Text>Recipe</Text>
                </ScrollView>
                <ScrollView>
                    <Text>Search</Text>
                </ScrollView>
                <ScrollView>
                    <Text>Meal Plan</Text>
                </ScrollView>
            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
})