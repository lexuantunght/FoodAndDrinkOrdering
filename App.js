import React from 'react';
import {
    Image, StyleSheet
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createAppContainer } from 'react-navigation';
import { Transition } from 'react-native-reanimated';

import { LoginScreen } from './views/LoginScreen';
import { HomeScreen } from './views/HomeScreen';
import { ReservedScreen } from './views/ReservedScreen';
import { DetailScreen } from './views/DetailScreen';
import { BillScreen } from './views/BillScreen';
import { RegisterScreen } from './views/RegisterScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { HistoryOrderScreen } from './views/HistoryOrderScreen';
import { EndowScreen } from './views/EndowScreen';
import { MemberRequirementScreen } from './views/MemberRequirementScreen';
import { ChangeProfileScreen } from './views/ChangeProfileScreen';
import { ChangePasswordScreen } from './views/ChangePasswordScreen';


const Stack = createStackNavigator();
const HomeDetailStack = () => {
    return(
      <Stack.Navigator screenOptions = {{headerStyle: {backgroundColor: '#21bf73'}, headerTintColor: '#000000'}}>
        <Stack.Screen name = 'Home' component = {HomeScreen} options = {{
          title: 'Coffee & Milktea'
        }}/>
        <Stack.Screen name = 'Detail' component = {DetailScreen} options = {{
          title: 'Chi tiết',
          headerBackTitle: null
        }}/>
      </Stack.Navigator>
    );
};
const ReservedBillStack = () => {
    return(
      <Stack.Navigator screenOptions = {{headerStyle: {backgroundColor: '#21bf73'}, headerTintColor: '#000000'}}>
        <Stack.Screen name = 'Reserved' component = {ReservedScreen} options = {{
          title: 'Danh sách order',
        }}/>
        <Stack.Screen name = 'Bill' component = {BillScreen} options = {{
          headerLeft: null,
          title: 'Thông tin hoá đơn'
        }}/>
      </Stack.Navigator>
    );
};
const MenuStack = () => {
  return(
    <Stack.Navigator screenOptions = {{headerStyle: {backgroundColor: '#21bf73'}, headerTintColor: '#000000'}}>
      <Stack.Screen name = 'Profile' component = {ProfileScreen} options = {{
        title: 'Thông tin'
      }}/>
      <Stack.Screen name = 'HistoryOrder' component = {HistoryOrderScreen} options = {{
        title: 'Lịch sử order'
      }}/>
      <Stack.Screen name = 'ChangeProfile' component = {ChangeProfileScreen} options = {{
        title: 'Đổi thông tin'
      }}/>
      <Stack.Screen name = 'ChangePassword' component = {ChangePasswordScreen} options = {{
        title: 'Đổi mật khẩu'
      }}/>
      <Stack.Screen name = 'MemberRequirement' component = {MemberRequirementScreen} options = {{
        title: 'Hạng thành viên'
      }}/>
      <Stack.Screen name = 'Endow' component = {EndowScreen} options = {{
        title: 'Ưu đãi'
      }}/>
    </Stack.Navigator>
  );
};

const LoginRegisterStack = ({parentNavigation}) => {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions = {{headerShown: false}}>
                <Stack.Screen name = 'Login'>
                    {props => <LoginScreen {...props} parentNavigation={parentNavigation}/>}
                </Stack.Screen>
                <Stack.Screen name = 'Register' component = {RegisterScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const BottomTab = createBottomTabNavigator();
const MainApp = () => (
    <NavigationContainer>
        <BottomTab.Navigator tabBarOptions = {{
          style: {
            backgroundColor: '#ffffff',
          },
          activeTintColor: '#42b883',
        }}>
            <BottomTab.Screen name='Home' component = {HomeDetailStack} options = {{
              tabBarIcon: ({focused}) => {
                if (focused) {
                  return(
                    <Image source = {require('./resources/home-fill.png')} style = {styles.iconFocused}/>
                  );
                }
                return(
                  <Image source = {require('./resources/home.png')} style = {styles.iconUnfocused}/>
                );
              },
              tabBarLabel: 'Trang chủ'
            }}/>
            <BottomTab.Screen name='Reserved' component = {ReservedBillStack} options = {{
              tabBarIcon: ({focused}) => {
                if (focused) {
                  return(
                    <Image source = {require('./resources/buy-fill.png')} style = {styles.iconFocused}/>
                  );
                }
                return(
                  <Image source = {require('./resources/buy.png')} style = {styles.iconUnfocused}/>
                );
              },
              tabBarLabel: 'Giỏ hàng'
            }}/>
            <BottomTab.Screen name='Profile' component = {MenuStack} options = {{
              tabBarIcon: ({focused}) => {
                if (focused) {
                  return(
                    <Image source = {require('./resources/profile-fill.png')} style = {styles.iconFocused}/>
                  );
                }
                return(
                  <Image source = {require('./resources/profile.png')} style = {styles.iconUnfocused}/>
                );
              },
              tabBarLabel: 'Thông tin'
            }}/>
        </BottomTab.Navigator>
    </NavigationContainer>
);

const AppView = createAnimatedSwitchNavigator(
    {
        'LoginRegister': {
            screen: ({navigation}) => (<LoginRegisterStack parentNavigation = {navigation}/>)
        },
        'Main': MainApp,
    },
    {
        transition: (
          <Transition.Together>
            <Transition.Out
              type="slide-right"
              durationMs={400}
              interpolation="easeIn"
            />
            <Transition.In type="fade" durationMs={500} />
          </Transition.Together>
        ),
    }
);

const App = createAppContainer(AppView);

export default App;

const styles = StyleSheet.create({
  iconFocused: {
    tintColor: '#42b883', 
    width: 24, height: 24
  },
  iconUnfocused: {
    tintColor: '#42b883', 
    width: 24, height: 24
  }
});