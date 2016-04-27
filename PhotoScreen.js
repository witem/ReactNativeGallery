'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} = ReactNative;

var device_width = Dimensions.get('window').width;
var device_height = Dimensions.get('window').height;

var getImageSource = function(photo) {
  return {uri: photo.image_url};//TODO need get big img
};
var calculateImgSize = function(photo) {//TODO need check rotate
  var ratio = photo.width / photo.height;
  var width = device_width;
  var height = width * ratio;
  if (height > device_height) {
    height = device_height;
    width = height / ratio;
  }
  return {};
  return {width, height};
}

var MovieScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.contentContainer}>
        <Image
          source={getImageSource(this.props.photo)}
          style={[styles.detailsImage, calculateImgSize(this.props.photo)]}
        />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 5,
    overflow: 'hidden',
    backgroundColor: '#eaeaea',
  },
  detailsImage: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

module.exports = MovieScreen;
