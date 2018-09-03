import React, { Component,  } from 'react';
import { View, TouchableHighlight, AsyncStorage, Image, ScrollView } from 'react-native';
import { GET_TEAMS } from '../graphql/queries';

import { Query } from "react-apollo";

import Color from 'constants/colors';
import style from 'styles/profile';
import styles from 'styles/help';

import { Text, Icon } from 'react-native-elements';


export default class DadTeams extends Component {
  constructor() {
    super();
    this.state = {
      member: null
    };
  }

  static navigationOptions = ({ navigation: { navigate } }) => ({
    title: 'TEAMS',
    headerMode: 'screen',
    headerTintColor: Color.white,
    headerStyle: {
      backgroundColor: Color.main
    },
    headerLeft: null
  });

  showDadInfo = () => {
    this.props.navigation.navigate('dadProfile', {
      id: this.state.member.id
    });
  }
  showTeamDetail = team => {
    this.props.navigation.navigate('teamProfile', {
      id: team.id,
      dad: team.members[0].id,
      daughter: team.members[1].id,
      title: team.title,
      teamPictureUrl: team.teamPictureUrl
    })
  }

  async componentWillMount() {
    let user = await AsyncStorage.getItem('USER_INFO');

    let user_info = JSON.parse(user);
    console.log(user_info);
    this.setState({
      member: user_info
    })
  }
  render() {
    return (
      <ScrollView>
      <View style={style.container}>
        <View style={style.subContainer}>
          <View style={style.formContainer}>
            {this.state.member ?
              <View style={style.dadProfile}>
                <Image style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25
                }}
                source={{
                  uri: this.state.member.profilePictureUrl
                }} /> 
                <TouchableHighlight onPress={() => this.showDadInfo()}>
                  <Text style={style.partnerName}>{this.state.member.name}</Text>
                </TouchableHighlight>
              </View>
              :
              <Text>Loading...</Text>
            }
            <View style={style.flexGrid}>
              {this.state.member ?
              <Query query={GET_TEAMS} variables={{ memberId: this.state.member.id}}>
                  {({ data: { teamByMember }, loading }) => {
                    if (loading || !teamByMember) {
                    return <Text>Loading ...</Text>;
                  }
                  {
                    return teamByMember.map(team => {
                      let partners = team.members.filter(member_user => {
                        return member_user.id !== this.state.member.id
                      })
                      return (
                        <View style={style.flexItem} key={team.id}>
                          <View style={style.flexItemInner}>
                            <Image style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25
                            }}
                              source={{
                                uri: team.teamPictureUrl
                              }} /> 
                          <TouchableHighlight onPress={() => this.showTeamDetail(team)}>
                            <Text style={[style.teamInfo]}>
                              {team.title}
                            </Text>
                          </TouchableHighlight>
                          {partners.map(partner => {
                              return (
                                <Text style={[style.partnerName]} key={partner.id}>{partner.name}</Text>
                              ); 
                            })
                          }
                            </View>
                        </View>
                      );
                    })
                  }
                }}
              </Query>
              :
              <View></View>
              }
              <View style={style.flexItem}>
                <View style={style.flexItemInner}>
                  <Image style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25
                  }}
                    source={require('../assets/images/add_team.png')} />
                  <TouchableHighlight onPress={() => this.props.navigation.navigate('newTeam')}>
                    <Text style={[style.teamInfo]}>
                      Add New Team
                    </Text>
                  </TouchableHighlight>
                  <Text> </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}
