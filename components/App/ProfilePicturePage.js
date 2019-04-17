import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'native-base';

const autoBind = require('auto-bind');

class ProfilePicture extends Component{
    constructor(props){
        super(props)
        this.state={

        }
        autoBind(this)
    }

    render(){
        return(
            <View>
                <Text>
                    Hello World
                </Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
}

const ProfilePicturePage = connect(mapStateToProps)(ProfilePicture);

export default ProfilePicturePage;