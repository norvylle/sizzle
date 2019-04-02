import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Keyboard, TouchableOpacity, Image } from 'react-native';
import { CardItem, Input, Form, Item, Button, Icon, Left, Right, Thumbnail, Radio, Text, Card, Body, Spinner } from 'native-base';
import { usda, yummly } from '../Service/secret';
import { connect } from 'react-redux';

const autoBind = require('auto-bind');
const axios = require('axios');

class Search extends Component {
    constructor(props){
        super(props)
        this.state={
            text: "",
            searched:"",
            selected: 1,
            data: null,
            searching: false,
            clickedInfo: false,
            renderData: false
        }
        autoBind(this)
    }

    async handleSearch(){
        if(this.state.text === ""){
            Alert.alert("Sizzle","Please enter search on empty field");
            return
        }

        this.setState({searching: true, data:null, renderData: false});        
        Keyboard.dismiss();

        if(this.state.selected === 0){
            await axios.get(yummly.search,
                {
                    params:{
                        _app_id: yummly.id,
                        _app_key: yummly.api_key,
                        q: this.state.text
                    }
                }
            )
            .then(async function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                        }
                    }catch (error) {
                        await this.setState({data: response.data})
                        this.setState({renderData: true, searched: this.state.text})
                        console.log("RECIPE: Search success.")
                    }
                }
            }.bind(this))

            this.setState({searching: false});
        }
        else{    
            await axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        ds: "Standard Reference",
                        format: "json",
                        max: 50,
                        q: this.state.text,
                    }
                }
            )
            .then(async function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                        }
                    }catch (error) {
                        await this.setState({data: response.data, searched: this.state.text})
                        this.setState({renderData: true})
                        console.log("INGREDIENT: Search success.")
                    }
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.")
            })
            this.setState({searching: false});
        }
        this.setState({searching: false});
    }

    handleInfo(ndbno){
        axios.get(usda.report,
            {
                params:{
                    api_key: usda.api_key,
                    ndbno: ndbno
                }
            }
        ).then(async function(response){
            try {
                if(response.data.errors.error[0].status === 400){
                    Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                }
            }catch (error) {
                if(response.status === 200){
                    let data = response.data.report.food;
                    let info = "Nutrient\t|\tValue per 100g"
                    await data.nutrients.forEach(nutrient=>{
                        info = info+"\n"+nutrient.name+"\t|\t"+nutrient.value+" "+nutrient.unit;
                    })
                    Alert.alert("Nutrional Facts",info);
                }
            }
        })
        .catch(function(error){
            if(error != undefined){
                console.log("Error: "+error);
            }
        })
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
                    <Item>
                        <Item style={styles.half}>
                            <Left style={styles.left}>
                                <Radio onPress={()=>this.setState({selected: 0})} selected={this.state.selected === 0}/>
                            </Left>
                            <Text style={styles.right}>Recipe</Text>
                        </Item>
                        <Item style={styles.half}> 
                            <Left style={styles.left}>
                                <Radio onPress={()=>this.setState({selected: 1})} selected={this.state.selected === 1}/>
                            </Left>
                            <Text style={styles.right}>Ingredient</Text>
                        </Item>
                    </Item>
                </Form>
                <ScrollView>
                    {
                        this.state.selected == 1 ? 
                            (this.state.renderData ? 
                                this.state.data.list.item.map((item)=>{
                                    return(
                                        <TouchableOpacity key={item.ndbno} onPress={()=>this.handleInfo(item.ndbno)}>
                                            <Card  pointerEvents="none">
                                                <Left>
                                                    <Body>
                                                            <Text>{item.name}</Text>
                                                            <Text note>{item.group}</Text>
                                                    </Body>
                                                </Left>
                                            </Card>
                                        </TouchableOpacity>
                                    )
                                })
                            : null)
                        :
                            (this.state.searching === true ? 
                                <Spinner color="blue" style={{paddingTop: 50}}/> 
                            : null) 
                    }
                    {
                        this.state.selected === 1 ?
                        (this.state.renderData ? 
                            (<Text style={{paddingBottom: 120, textAlign: "center", color: "gray"}}>Showing 1-50 of 50 results"{this.state.searched}"</Text>)
                            : null) 
                        :
                        null   
                    }
                    {
                        this.state.selected === 0 ?
                        (this.state.renderData ? 
                            this.state.data.matches.map((item) =>{
                                return(
                                    <Card key={item.id} style={styles.card}>
                                        <CardItem>
                                            <Left>
                                                <Thumbnail source={{uri: this.state.data.attribution.logo}}/>
                                                <Body>
                                                    <Text>{item.recipeName}</Text>
                                                    <Text note>{item.sourceDisplayName}</Text>
                                                </Body>
                                            </Left>
                                        </CardItem>
                                        <CardItem cardBody>
                                            <Image source={{uri: item.imageUrlsBySize[90]}} style={styles.image}/>
                                        </CardItem>
                                        <CardItem>
                                            <Left>
                                                <Button transparent onPress={() =>{Alert.alert("Sizzle","Rated by Yummly\n\n5 Stars - Outstanding\n4 Stars - Really Liked It\n3 Stars - Liked It/Average\n2 Stars - Not great/Just Okay\n1 Star - Didn't Like It")} }>
                                                    <Icon type='Entypo' name='info-with-circle' style={styles.icon}/>
                                                </Button>
                                                <Text>{item.rating}/5 stars</Text>
                                            </Left>
                                            <Right>
                                                <Text>{item.totalTimeInSeconds/60} mins. cooking time.</Text>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                )
                            })
                            : null)                         
                        : 
                        (this.state.searching === true ? <Spinner color="blue" style={{paddingTop: 50}}/> : null) 
                    }
                    {
                        this.state.selected === 0 ? 
                        (this.state.renderData ? 
                            (<Text style={{paddingBottom: 120, textAlign: "center", color: "gray"}}>{this.state.data.attribution.text}</Text>)   
                            :null)
                        :
                        null
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item:{
        flexDirection: "row",
        paddingTop: 10
    },
    half:{
        width: "50%",
        height: 50
    },
    left:{
        width: "40%"
    },
    right:{
        width: "60%"
    },
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        height: 180, 
        width: 120, 
        flex: 1
    },
    card:{
        maxHeight: 350,
    },
    icon:{
        color: '#000'
    },
})

const mapStateToProps = state => {
    return state
}

// const SearchPage = connect(mapStateToProps)(Search);

// export default SearchPage;

export default Search;