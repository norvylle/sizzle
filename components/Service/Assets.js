import { Font } from 'expo';
async function  loadAssets(){
    await Font.loadAsync({
      'fantastic': require('../../assets/fonts/fantastic.ttf'),
      'geoSansLight': require('../../assets/fonts/geoSansLight.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
}


export{
    loadAssets
}