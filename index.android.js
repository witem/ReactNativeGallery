'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  BackAndroid,
  Navigator,
  ToolbarAndroid,
} = ReactNative;

var GridScreen = require('./GridScreen');
var PhotoScreen = require('./PhotoScreen');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'grid') {
    return (
      <GridScreen navigator={navigationOperations} />
    );
  } else if (route.name === 'photo') {
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          actions={[]}
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          titleColor="white"
          title={route.photo.name} />
        <PhotoScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          photo={route.photo}
        />
      </View>
    );
  }
};

var ReactNativeGallery = React.createClass({
  render: function() {
    var initialRoute = {name: 'grid'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

AppRegistry.registerComponent('ReactNativeGallery', () => ReactNativeGallery);

module.exports = ReactNativeGallery;
