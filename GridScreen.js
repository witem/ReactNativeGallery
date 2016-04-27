'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} = ReactNative;

var CONSUMER_KEY = 'wB4ozJxTijCwNuggJvPGtBGCRqaZVcF6jsrzUadF';
var API_URL = 'https://api.500px.com/v1/photos';
var PAGE_SIZE = 26;
var FEATURE = 'popular';
var PARAMS = '?feature=' + FEATURE + '&consumer_key=' + CONSUMER_KEY + '&rpp=' + PAGE_SIZE;
PARAMS += '&image_size=3';
var REQUEST_URL = API_URL + PARAMS;

var device_width = Dimensions.get('window').width;
var device_height = Dimensions.get('window').height;
var resultsCache = {
  data: []
};

var GridScreen = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLoading: false,
      isLoadingTail: false,
      currentScreenWidth: device_width,
      currentScreenHeight: device_height,
      viewHeight: 200,
      currentPage: 0,
      maxPage: 1
    };
  },

  handleRotation: function(event) {
    var layout = event.nativeEvent.layout;
    this.setState({
      currentScreenWidth: layout.width,
      currentScreenHeight: layout.height,
    });
  },

  componentDidMount: function() {
    this.fetchData();
  },

  _urlForPage: function() {
    return (
      REQUEST_URL + '&page=' + this.state.currentPage
    );
  },

  fetchData: function() {
    this.setState({
      isLoading: true,
      currentPage: this.state.currentPage + 1,
    });
    fetch(this._urlForPage())
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        this.setState({
          isLoading: false,
        });
      })
      .then((responseData) => {
        var photos = responseData.photos.slice();
        for (var i in photos) {
          resultsCache.data.push(photos[i]);
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(resultsCache.data),
          isLoading: false,
          maxPage: responseData.total_pages,
        });
      })
      .done();
  },

  onEndReached: function() {
    if (this.state.currentPage === this.state.maxPage) {
      return;
    }

    this.setState({
      currentPage: this.state.currentPage + 1,
      isLoadingTail: true,
    });

    fetch(this._urlForPage())
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var photos = responseData.photos.slice();
        for (var i in photos) {
          resultsCache.data.push(photos[i]);
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(resultsCache.data),
          isLoadingTail: false,
        });
      })
      .done();
  },

  selectPhoto: function(photo) {
    this.props.navigator.push({
      title: photo.name,
      name: 'photo',
      photo: photo,
    });
  },

  renderFooter: function() {
    if (!this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }

    return (
      <View  style={{alignItems: 'center'}}>
        <ProgressBarAndroid styleAttr="Large"/>
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading photos...
        </Text>
      </View>
    );
  },

  renderPhoto: function(photo) {
    return (
      <TouchableHighlight onPress={() => this.selectPhoto(photo)}>
        <View
          style={[styles.container, this.calculateViewSize()]}
        >
          <Image
            source={{uri: photo.image_url}}
            style={[styles.image, this.calculateImgSize(photo)]}
          />
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        onLayout={this.handleRotation}//TODO not work
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderPhoto}
        onEndReached={this.onEndReached}
        style={styles.listView}
        contentContainerStyle={styles.containerView}
      />
    );
  },

  calculateViewSize: function() {
    return {
      width: this.state.currentScreenWidth / 2 - 10,
      height: this.state.viewHeight,
    };
  },

  calculateImgSize: function(photo) {
    var ratio = photo.width / photo.height;
    var width = this.state.currentScreenWidth / 2;
    var height = width * ratio;
    if (height < this.state.viewHeight) {
      height = this.state.viewHeight;
      width = height / ratio;
    }
    return {width, height};
  },
});

var styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginRight: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
  },
  containerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
    // paddingBottom: 5,
  },
  listView: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F5FCFF',
  },
});

// AppRegistry.registerComponent('ReactNativeGallery', () => ReactNativeGallery);
module.exports = GridScreen;
//
// var React = require('react');
// var ReactNative = require('react-native');
// var {
//   ActivityIndicatorIOS,
//   ListView,
//   Platform,
//   ProgressBarAndroid,
//   StyleSheet,
//   Text,
//   View,
// } = ReactNative;
// var TimerMixin = require('react-timer-mixin');
//
// var invariant = require('fbjs/lib/invariant');
// var dismissKeyboard = require('dismissKeyboard');
//
// var MovieCell = require('./MovieCell');
// var MovieScreen = require('./MovieScreen');
// var SearchBar = require('SearchBar');
//
// /**
//  * This is for demo purposes only, and rate limited.
//  * In case you want to use the Rotten Tomatoes' API on a real app you should
//  * create an account at http://developer.rottentomatoes.com/
//  */
// var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/';
// var API_KEYS = [
//   '7waqfqbprs7pajbz28mqf6vz',
//   // 'y4vwv8m33hed9ety83jmv52f', Fallback api_key
// ];
//
// // Results should be cached keyed by the query
// // with values of null meaning "being fetched"
// // and anything besides null and undefined
// // as the result of a valid query
// var resultsCache = {
//   dataForQuery: {},
//   nextPageNumberForQuery: {},
//   totalForQuery: {},
// };
//
// var LOADING = {};
//
// var SearchScreen = React.createClass({
//   mixins: [TimerMixin],
//
//   timeoutID: (null: any),
//
//   getInitialState: function() {
//     return {
//       isLoading: false,
//       isLoadingTail: false,
//       dataSource: new ListView.DataSource({
//         rowHasChanged: (row1, row2) => row1 !== row2,
//       }),
//       filter: '',
//       queryNumber: 0,
//     };
//   },
//
//   componentDidMount: function() {
//     this.searchMovies('');
//   },
//
//   _urlForQueryAndPage: function(query: string, pageNumber: number): string {
//     var apiKey = API_KEYS[this.state.queryNumber % API_KEYS.length];
//     if (query) {
//       return (
//         API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
//         encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber
//       );
//     } else {
//       // With no query, load latest movies
//       return (
//         API_URL + 'lists/movies/in_theaters.json?apikey=' + apiKey +
//         '&page_limit=20&page=' + pageNumber
//       );
//     }
//   },
//
//   searchMovies: function(query: string) {
//     this.timeoutID = null;
//
//     this.setState({filter: query});
//
//     var cachedResultsForQuery = resultsCache.dataForQuery[query];
//     if (cachedResultsForQuery) {
//       if (!LOADING[query]) {
//         this.setState({
//           dataSource: this.getDataSource(cachedResultsForQuery),
//           isLoading: false
//         });
//       } else {
//         this.setState({isLoading: true});
//       }
//       return;
//     }
//
//     LOADING[query] = true;
//     resultsCache.dataForQuery[query] = null;
//     this.setState({
//       isLoading: true,
//       queryNumber: this.state.queryNumber + 1,
//       isLoadingTail: false,
//     });
//
//     fetch(this._urlForQueryAndPage(query, 1))
//       .then((response) => response.json())
//       .catch((error) => {
//         LOADING[query] = false;
//         resultsCache.dataForQuery[query] = undefined;
//
//         this.setState({
//           dataSource: this.getDataSource([]),
//           isLoading: false,
//         });
//       })
//       .then((responseData) => {
//         LOADING[query] = false;
//         resultsCache.totalForQuery[query] = responseData.total;
//         resultsCache.dataForQuery[query] = responseData.movies;
//         resultsCache.nextPageNumberForQuery[query] = 2;
//
//         if (this.state.filter !== query) {
//           // do not update state if the query is stale
//           return;
//         }
//
//         this.setState({
//           isLoading: false,
//           dataSource: this.getDataSource(responseData.movies),
//         });
//       })
//       .done();
//   },
//
//   hasMore: function(): boolean {
//     var query = this.state.filter;
//     if (!resultsCache.dataForQuery[query]) {
//       return true;
//     }
//     return (
//       resultsCache.totalForQuery[query] !==
//       resultsCache.dataForQuery[query].length
//     );
//   },
//
  // onEndReached: function() {
  //   var query = this.state.filter;
  //   if (!this.hasMore() || this.state.isLoadingTail) {
  //     // We're already fetching or have all the elements so noop
  //     return;
  //   }
  //
  //   if (LOADING[query]) {
  //     return;
  //   }
  //
  //   LOADING[query] = true;
  //   this.setState({
  //     queryNumber: this.state.queryNumber + 1,
  //     isLoadingTail: true,
  //   });
  //
  //   var page = resultsCache.nextPageNumberForQuery[query];
  //   invariant(page != null, 'Next page number for "%s" is missing', query);
  //   fetch(this._urlForQueryAndPage(query, page))
  //     .then((response) => response.json())
  //     .catch((error) => {
  //       console.error(error);
  //       LOADING[query] = false;
  //       this.setState({
  //         isLoadingTail: false,
  //       });
  //     })
  //     .then((responseData) => {
  //       var moviesForQuery = resultsCache.dataForQuery[query].slice();
  //
  //       LOADING[query] = false;
  //       // We reached the end of the list before the expected number of results
  //       if (!responseData.movies) {
  //         resultsCache.totalForQuery[query] = moviesForQuery.length;
  //       } else {
  //         for (var i in responseData.movies) {
  //           moviesForQuery.push(responseData.movies[i]);
  //         }
  //         resultsCache.dataForQuery[query] = moviesForQuery;
  //         resultsCache.nextPageNumberForQuery[query] += 1;
  //       }
  //
  //       if (this.state.filter !== query) {
  //         // do not update state if the query is stale
  //         return;
  //       }
  //
  //       this.setState({
  //         isLoadingTail: false,
  //         dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
  //       });
  //     })
  //     .done();
  // },
//
//   getDataSource: function(movies: Array<any>): ListView.DataSource {
//     return this.state.dataSource.cloneWithRows(movies);
//   },
//
//   selectMovie: function(movie: Object) {
//     if (Platform.OS === 'ios') {
//       this.props.navigator.push({
//         title: movie.title,
//         component: MovieScreen,
//         passProps: {movie},
//       });
//     } else {
//       dismissKeyboard();
//       this.props.navigator.push({
//         title: movie.title,
//         name: 'movie',
//         movie: movie,
//       });
//     }
//   },
//
//   onSearchChange: function(event: Object) {
//     var filter = event.nativeEvent.text.toLowerCase();
//
//     this.clearTimeout(this.timeoutID);
//     this.timeoutID = this.setTimeout(() => this.searchMovies(filter), 100);
//   },
//
//   renderFooter: function() {
//     if (!this.hasMore() || !this.state.isLoadingTail) {
//       return <View style={styles.scrollSpinner} />;
//     }
//     if (Platform.OS === 'ios') {
//       return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
//     } else {
//       return (
//         <View  style={{alignItems: 'center'}}>
//           <ProgressBarAndroid styleAttr="Large"/>
//         </View>
//       );
//     }
//   },
//
//   renderSeparator: function(
//     sectionID: number | string,
//     rowID: number | string,
//     adjacentRowHighlighted: boolean
//   ) {
//     var style = styles.rowSeparator;
//     if (adjacentRowHighlighted) {
//         style = [style, styles.rowSeparatorHide];
//     }
//     return (
//       <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
//     );
//   },
//
//   renderRow: function(
//     movie: Object,
//     sectionID: number | string,
//     rowID: number | string,
//     highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
//   ) {
//     return (
//       <MovieCell
//         key={movie.id}
//         onSelect={() => this.selectMovie(movie)}
//         onHighlight={() => highlightRowFunc(sectionID, rowID)}
//         onUnhighlight={() => highlightRowFunc(null, null)}
//         movie={movie}
//       />
//     );
//   },
//
//   render: function() {
//     var content = this.state.dataSource.getRowCount() === 0 ?
//       <NoMovies
//         filter={this.state.filter}
//         isLoading={this.state.isLoading}
//       /> :
//       <ListView
//         ref="listview"
//         renderSeparator={this.renderSeparator}
//         dataSource={this.state.dataSource}
//         renderFooter={this.renderFooter}
//         renderRow={this.renderRow}
//         onEndReached={this.onEndReached}
//         automaticallyAdjustContentInsets={false}
//         keyboardDismissMode="on-drag"
//         keyboardShouldPersistTaps={true}
//         showsVerticalScrollIndicator={false}
//       />;
//
//     return (
//       <View style={styles.container}>
//         <SearchBar
//           onSearchChange={this.onSearchChange}
//           isLoading={this.state.isLoading}
//           onFocus={() =>
//             this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
//         />
//         <View style={styles.separator} />
//         {content}
//       </View>
//     );
//   },
// });
