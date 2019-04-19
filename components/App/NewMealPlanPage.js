import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { View, Form, Input, Label, Item } from 'native-base';

const autoBind = require('auto-bind');

class NewMealPlan extends Component{
    constructor(props){
        super(props)
        this.state={
            mealPlanName: ""
        }
        autoBind(this)
    }

    render(){
        return(
            <View>
                <Form>
                    <Item stackedLabel>
                        <Label>Meal Plan Name</Label>
                        <Input style={styles.input} placeholder={"My Meal Plan"} value={this.state.mealPlanName} onChangeText={(mealPlanName)=> this.setState({mealPlanName})} maxLength={50}/>
                    </Item>
                    
                </Form>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        color:'#000',
        fontSize: 18,
    },
})

const mapStateToProps = state => {
    return state
}

const NewMealPlanPage = connect(mapStateToProps)(NewMealPlan);

export default NewMealPlanPage;