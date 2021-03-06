import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import { getDeck } from '../utils/api';
import { clearLocalNotification, setLocalNotification } from '../utils/notifications';

export default class DeckQuiz extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { deck } = navigation.state.params;
    return {
      title: deck
    }
  }

  state = {
    deck: {},
    currentCardIndex: 0,
    correctGuesses: 0,
    finishedQuiz: false
  }

  componentDidMount(){
    getDeck(this.props.navigation.state.params.deck)
    .then(
      (deck) => {
        this.setState(()=>({
          deck
        }))
    }
    );
  }

  onGuessAnswer(guess){
    if(guess == 'yes'){
      this.setState((prevState)=>({
        correctGuesses: prevState.correctGuesses + 1
      }))
    } else {
      console.log('better luck next time');
    };

    if (this.state.currentCardIndex === this.state.deck.questions.length -1 ){
      this.setState(()=>({
        finishedQuiz: true
      }))
      clearLocalNotification()
        .then(setLocalNotification)
    } else {
      this.setState((prevState)=>({
        currentCardIndex: prevState.currentCardIndex + 1
      }))
    }
  }

  render() {
    const questions = this.state.deck.questions ? this.state.deck.questions : [];
    const currentQuestion = this.state.currentCardIndex;

    if(questions.length === 0) {
      return(
        <View>
          <Text>No questions are available to be quizzed.</Text>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Home')}>
            <Text style={styles.goHome} >Go back home</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if(this.state.finishedQuiz){
      return (
        <View style={styles.finished}>
          <Text>
            You have finished the quiz! You got {this.state.correctGuesses} out of {this.state.deck.questions.length}
          </Text>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Home')}>
            <Text style={styles.goHome} >Go back home</Text>
          </TouchableOpacity> 
        </View>
      )
    }

    return (
      <View style={styles.quiz}>
        <Text>Let's quiz!</Text>
        <Card card={questions[currentQuestion]} index={currentQuestion} onGuessAnswer={this.onGuessAnswer.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  quiz: {
    flex: 1,
  },
  goHome: {
    margin: 5
  },
  finished: {
    alignItems: 'center',
  }
});