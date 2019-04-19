import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import Swiper from 'react-native-swiper'

const autoBind = require('auto-bind');

class Cook extends Component{
    constructor(props){
        super(props)
        this.state={
            steps: []
        }
        autoBind(this)
    }

    async componentWillMount(){
        this.setState({steps: this.props.navigation.state.params.recipe.steps, colorLoaded: true});
    }


    render(){
        return(
            <Swiper style={styles.wrapper} activeDotColor="white" dotColor="grey" showsHorizontalScrollIndicator={true}>
                {
                    this.state.steps.map((item,index)=>{
                        return(
                            <View key={index} style={[styles.slide, {backgroundColor: this.props.navigation.state.params.recipe.color}]}>
                                <Text style={styles.text}>{item.direction}</Text>
                                {index === this.state.steps.length-1 ? 
                                    (<Button bordered style={styles.button} onPress={()=>this.props.navigation.pop()}>
                                        <Text style={styles.buttonText}>Back</Text>
                                    </Button>) : null
                                }
                            </View>
                        )       
                    })
                }
            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    wrapper:{
        
    },
    text:{
        color: "#fff",
        fontSize: 30,
    },
    slide:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button:{
        alignSelf: "center",
        borderColor: "white",
        marginTop: 10
    },
    buttonText:{
        color: "white",
    }
});


const mapStateToProps = state => {
    return state
}

const CookPage = connect(mapStateToProps)(Cook);

export default CookPage;