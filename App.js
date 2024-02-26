import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/home';
import Setting from './screens/profile';
import { Dimensions, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get("window");

export default function App() {
  const Tab = createBottomTabNavigator();

  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View
        style={{
          right: 15,
          left: 18,
          bottom: 20,
          position: "absolute",
          width: width / 1.1,
          height: height / 16,
          flexDirection: 'row',
          backgroundColor: '#d1d1d1', 
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#d1d1d1', 
          borderRadius: 25, 
          marginBottom: 1,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;
          const tabBackgroundColor = isFocused ? '#fcfcf7' : '#d1d1d1';
          const tabBorderColor = isFocused ? '#fcfcf7' : '#d1d1d1';

          return (
            <View
              key={route.key}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: tabBackgroundColor,
                borderColor: tabBorderColor,
                borderWidth: 1,
                borderRadius: 25, 
                elevation: isFocused ? 10 : 0,
                shadowColor: '#d1d1d1',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: isFocused ? 0.25 : 0,
                shadowRadius: isFocused ? 4 : 0,
              }}
              onTouchEnd={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              {!isFocused && (
                <Animatable.View duration={300} animation="bounceInRight" easing='ease'>
                  <Feather name={label === "Home" ? 'home' : 'calendar'} size={20} color={isFocused ? 'black' : '#5e5e5e'} />
                </Animatable.View>
              )}
              {isFocused && (
                <Animatable.View duration={300} animation="bounceInLeft" easing='ease'>
                  <Text style={{ color: isFocused ? 'black' : '#5e5e5e', fontWeight: 'bold' }}>{label}</Text>
                </Animatable.View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        animated
        barStyle="dark-content"
        backgroundColor="#fcfcf7"
      />
      <NavigationContainer>
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
          <Tab.Screen
            name='Home' component={Home} options={{
              headerShown: false
            }}
          ></Tab.Screen>
          <Tab.Screen name='Calender' component={Setting} options={{
            headerShown: false
          }}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
