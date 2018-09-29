import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'
import NavigationService from 'App/Services/NavigationService'
import { View } from 'react-native'
import styles from './RootScreenStyle'
import { connect } from 'react-redux'
import StartupActions from 'App/Stores/Startup/Actions'

import HomePageScreen from '../HomePageScreen'
import PreviewScreen from '../PreviewScreen'
import FullImageScreen from '../FullImageScreen'
import SearchScreen from '../SearchScreen'

const AppNav = createStackNavigator(
  {
    MainScreen: HomePageScreen,
    PreviewScreen: PreviewScreen,
    FullImageScreen: FullImageScreen,
    SearchScreen: SearchScreen
  },
  {
    initialRouteName: 'MainScreen',
    headerMode: 'none',
  }
)

class RootScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <AppNav
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreen)
