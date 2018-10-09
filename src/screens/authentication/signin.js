import React, { Component } from 'react';
import { View, Image, TouchableHighlight, Text, ScrollView, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Mutation } from "react-apollo";

import Color from 'constants/colors';
import style from 'styles/signin';

import { FormLabel, FormInput, Button } from 'react-native-elements';

import { LOGIN_MUTATION } from '../../graphql/mutation';
import { setToken, setUserInfo, setUser, getUser, getActiveTeam, setActiveTeam } from '../../utils/util';
const EMAIL = 'Email';
const PASSWORD = 'Password';

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: false,
      errorMessage: ''
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount(){
    AsyncStorage.getItem('IS_LOGIN').then((value) => {
        if(value === 'true'){
          AsyncStorage.setItem('IS_TIMER_RESET', 'false');
          let { screenProps: { signIn } } = this.props;
          signIn();
        }
    });
  }

  signIn = async targetMutation => {
    try {
      this.setState({
        error: false,
        errorMessage: ''
      });
      const {
        email,
        password
      } = this.state;

      if (email.trim() !== '' && password.trim() !== '') {
        const data = await targetMutation({ variables: { email, password } });

        setToken(data.data.user_Login.token);
        setUserInfo(JSON.stringify(data.data.user_Login.user));
        setUser(data.data.user_Login.user.id);
        let activeTeam = await AsyncStorage.getItem('ACTIVE_TEAM');
        if (!activeTeam) {
          if (data.data.user_Login.teams.length > 0) {
            setActiveTeam(data.data.user_Login.teams[0].id);
          }
        }
        console.log('team_Dashboard iss: '+JSON.stringify(data.data.user_Login.teams[0].id))
        AsyncStorage.setItem('ACTIVE_TEAM', data.data.user_Login.teams[0].id);
        AsyncStorage.setItem('IS_TIMER_RESET', 'true');
        debugger
        let { screenProps: { signIn } } = this.props;
        signIn();
      } else {
        this.setState({
          error: true,
          errorMessage: "Please enter your username and password"
        });
      }
    } catch (e) {
      console.log('Error in signIn', { graphQLErrors: e.graphQLErrors, networkError: e.networkError, message: e.message, extraInfo: e.extraInfo });
      this.setState({
        error: true,
        errorMessage: e.message.replace("GraphQL error: ", "")
      });
    }
  }

  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(user_Login) => (
          <KeyboardAvoidingView
            behavior="padding" style={style.container}>
            <ScrollView>
            <View style={style.subContainer}>
              <View style={style.welcomeContainer}>
                <Image
                  source={require('../../assets/images/alley-oop.png')}
                  style={style.logoName}
                />
                <Text style={style.subTitle}>Deepening inter-generational relationships through play</Text>
                <Image
                  source={require('../../assets/images/alley-oop-logo.png')}
                  style={style.logoImg}
                />
              </View>
              <View style={style.formContainer}>
                <FormLabel raised labelStyle={style.formLabel}>{EMAIL}</FormLabel>
                <FormInput raised
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({ email: value });
                  }}
                />
                <FormLabel raised labelStyle={style.formLabel}>{PASSWORD}</FormLabel>
                <FormInput raised
                  secureTextEntry={true}
                  onChangeText={value => {
                    this.setState({ password: value });
                  }}
                />
                {this.state.error ? <Text style={style.error}>{this.state.errorMessage}</Text> : null}
              </View>
              <Button raised
                title={'Login'}
                borderRadius={5}
                backgroundColor={Color.blue}
                textStyle={{ fontWeight: 'bold' }}
                style={style.button}
                onPress={this.signIn.bind(this, user_Login)}
              />
              <Button raised
                title={'Register'}
                borderRadius={5}
                backgroundColor={Color.blue}
                textStyle={{ fontWeight: 'bold' }}
                style={style.button}
                onPress={() => {
                  this.props.navigation.navigate('register')
                }}
              />
              <TouchableHighlight onPress={() => this.props.navigation.navigate('forgotPassword')}><Text style={style.forgotPassword}>Forgot password?</Text></TouchableHighlight>
              <Text style={style.footerText}>By creating an account you agree to our{'\n'} <Text style={style.tos} onPress={() => this.props.navigation.navigate('tos')}>Terms of Service</Text> and <Text onPress={() => this.props.navigation.navigate('privacyPolicy')} style={style.tos}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Mutation>
    );
  }
}
