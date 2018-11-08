import React, { PureComponent } from 'react'
import { FlatList, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Spinkit from 'react-native-spinkit'
import { connect } from 'react-redux'
import _ from 'lodash'

import SearchBar from '../../Components/SearchBar/SearchBar'
import SearchHistoryActions from '../../Stores/SearchHistory/Actions'
import CoverItem from '../../Components/CoverItem'
import Header from '../../Components/Header'
import { Metrics, ApplicationStyles, Colors } from '../../Themes'
import API from '../../Services/Api'

class HomePageScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countPage: 1,
      loading: true,
      data: [],
      keyword: ''
    }
    this._loadMore = _.debounce(this._loadMore, 1000)
  }

  async loadHomepage() {
    console.log('Load page', this.state.countPage)
    var nData = await API.nHentaiHome().getHomePageUrl(this.state.countPage);
    var arrayData = nData.data.result.map((item) => {
      return {
        id: item.id,
        images: item.images,
        mediaId: item.media_id,
        numFavorites: item.num_favorites,
        numPages: item.num_pages,
        scanlator: item.scanlator,
        tags: item.tags,
        title: item.title,
        uploadDate: item.upload_date
      }
    })
    var newData = [...this.state.data, ...arrayData]
    this.setState({ data: newData, loading: false })
  }

  componentDidMount() {
    this.loadHomepage()
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({ item }) =>
    <CoverItem
      item={item}
      hide={true}
      onPress={this.goToPreview(item)} />

  goToPreview = (item) => () => this.props.navigation.navigate('PreviewScreen', { data: item })

  _loadMore = () => {
    this.setState({ countPage: this.state.countPage + 1, loading: true })
    this.loadHomepage()
  }

  renderFooter = () => this.state.loading &&
    <View style={[ApplicationStyles.center, { margin: 10 }]}>
      <Spinkit type='WanderingCubes' size={30} color='white' />
    </View>

  _onSearch = () => {
    if (this.state.keyword.length !== 0) {
      this.props.addSearchHistoryItem(this.state.keyword)
    }
  }

  render() {
    return (
      <LinearGradient colors={[Colors.g1, Colors.g2]}
        style={ApplicationStyles.mainContainer}>
        <Header title='nHentai' />
        <SearchBar placeholder='Type Here...' />
        <FlatList
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          numColumns={2}
          initialNumToRender={4}
          style={[ApplicationStyles.mainContainer, { padding: Metrics.smallMargin }]}
          onEndReached={this._loadMore}
          ListFooterComponent={this.renderFooter}
        />
      </LinearGradient>
    )
  }
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = (dispatch) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(HomePageScreen)
