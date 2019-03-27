import React, { Component } from 'react';
import { StyleSheet, Alert, ListView } from 'react-native';
import { Text, Content, List, ListItem, Button, Icon } from 'native-base';

const autoBind = require('auto-bind');

export default class IngredientsPage extends Component{
    constructor(props){
        super(props)
        this.state={
            ingredients:[]
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    async componentWillMount(){
        await this.setState({ingredients: [...this.props.navigation.state.params] })
    }

    render(){
        return(
            <Content>
                {
                    this.state.ingredients===null ? null :
                    <List
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    dataSource={this.ds.cloneWithRows(this.state.ingredients)}
                    renderRow={
                        data=>
                            <ListItem>
                                <Text>{data.name}</Text>
                            </ListItem>
                    }
                    renderLeftHiddenRow={data =>
                        <Button full onPress={() => Alert.alert(data.qty+" "+data.unit+" "+data.name,"Nutritional facts:\n")}>
                        <Icon active name="information-circle" />
                        </Button>
                    }
                    renderRightHiddenRow={data=>
                        <Button full danger onPress={() => Alert.alert("Sizzle","Delete "+data.name+"?")}>
                        <Icon active name="trash" />
                        </Button>
                    }
                    />
                }
            </Content>
        )
    }
}

const styles = StyleSheet.create({

})