import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button, Icon } from 'native-base';
import { Speech } from 'expo';
import Swiper from 'react-native-swiper';
import CountdownCircle from 'react-native-countdown-circle';

const autoBind = require('auto-bind');

export default class CookPage extends Component{
    constructor(props){
        super(props)
        this.swiperRef = swiper => this.swiper = swiper
        this.state={
            steps: [],
            firstPlay: true,
            playing: false,
            stopped: false,
            swiper: null,
            index: 0
        }
        autoBind(this)
    }

    async componentWillMount(){
        this.setState({steps: this.props.navigation.state.params.recipe.steps, colorLoaded: true});
    }

    handlePlayPause(index){
        // play
        if(this.state.firstPlay){
            //play from scratch
            this.setState({firstPlay: false})
            Speech.speak(this.state.steps[index].direction,
                {
                    language: "en",
                    pitch: 1.2,
                    rate: 0.9,
                    onStart: ()=>this.setState({playing: true, stopped: false}),
                    onDone: ()=>this.setState({playing: false, stopped: true}),
                    OnError: ()=>this.setState({playing: false, stopped: true})
                }
            )
        }
        else{
            //replay from scratch
            Speech.speak(this.state.steps[index].direction,
                {
                    language: "en",
                    pitch: 1.2,
                    rate: 0.9,
                    onStart: ()=>this.setState({playing: true, stopped: false}),
                    onDone: ()=>this.setState({playing: false, stopped: true}),
                    OnError: ()=>this.setState({playing: false, stopped: true})
                }
            )
        }
    }

    handleStop(){
        //stop playing
        Speech.stop();
        this.setState({stopped: true, playing: false});
    }

    handleTime(){
        if(this.state.stopped && !this.state.playing){
            if(this.state.index < this.state.steps.length-1){
                this.swiper.scrollBy(1,true);
                this.setState({firstPlay: true});
            }else{
                this.props.navigation.pop();
            }
        }
    }

    handleIndex(index){
        this.setState({stopped: false, firstPlay: true, playing: false, index});
        this.handlePlayPause(index);
    }

    render(){
        return(
            <Swiper style={styles.wrapper} activeDotColor="white" dotColor="grey" showsHorizontalScrollIndicator={true} onIndexChanged={(index)=>{this.handleIndex(index)}} index={this.state.index} ref={this.swiperRef}>
                {
                    this.state.steps.map((item,index)=>{
                        return(
                            <View key={index} style={[styles.slide, {backgroundColor: this.props.navigation.state.params.recipe.color}]}>
                                <Text style={styles.text}>{item.direction}</Text>
                                {index === this.state.steps.length-1 ? 
                                    (<Button bordered style={styles.button} onPress={()=>{this.props.navigation.pop()}}>
                                        <Text style={styles.buttonText}>Back</Text>
                                    </Button>) : null
                                }
                                <View style={styles.lower}>
                                    <Button transparent onPress={()=>this.handlePlayPause(index)}>
                                        <Icon style={styles.buttonText} type="Ionicons" name="ios-play"/>
                                    </Button>
                                    <Button transparent onPress={()=>this.handleStop()}>
                                        <Icon style={styles.buttonText} type="MaterialIcons" name="stop"/>
                                    </Button>
                                    {
                                        this.state.stopped ?
                                        <CountdownCircle seconds={15} radius={20} borderWidth={5} onTimeElapsed={()=>this.handleTime()}/>
                                        : null
                                    }
                                </View>
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
        marginTop: 25
    },
    buttonText:{
        color: "white",
    },
    lower:{
        position: 'absolute',
        bottom: 10,
        left: 0,
        flexDirection: "row",
        alignSelf: "center"
    }
});