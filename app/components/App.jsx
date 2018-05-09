import axios from 'axios';
import _ from 'lodash';
import React from 'react';

import Badge from 'material-ui/Badge';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

class App extends React.Component {
  static colors = ['#FCA49F', '#FCC99F', '#F9DF94', '#CFFF9F', '#6CD4AC'];

  constructor() {
    super();

    this.getBeers = this.getBeers.bind(this);
    this.handleBeerUpdate = this.handleBeerUpdate.bind(this);
    this.updateColor = this.updateColor.bind(this);

    this.getBeers();

    this.state = {
      color: _.first(this.constructor.colors),
      colorIndex: 0,
      loading: true
    };
  }

  getBeers() {
    axios.get('/beers/').then((response) => {
      this.setState({ data: response.data });
    }).catch((error) => {
      this.setState({ error });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleBeerUpdate(beer) {
    axios.put(`beers/mixBeer/${beer.id}/`, this.state.activeBeer).then(() => {
      this.getBeers();
      this.setState({ activeBeer: null });
    }).catch((error) => {
      this.setState({ error });
    });
  }

  updateColor() {
    let colorIndex;
    if (this.state.colorIndex === this.constructor.colors.length - 1) {
      colorIndex = 0;
    } else {
      colorIndex = this.state.colorIndex + 1;
    }

    this.setState({
      colorIndex,
      color: this.constructor.colors[colorIndex]
    });
  }

  render() {
    const error = this.state.error ?
      (
        <Snackbar
          open={ _.some(this.state.error) }
          message={ this.state.error.message }
          autoHideDuration={ 5000 }
        />
      ) :
      null;

    let content;
    if (this.state.loading) {
      content = (
        <CircularProgress
          color={ this.state.color }
          size={ 30 }
        />
      );
    } else if (this.state.error) {
      content = this.state.error.message;
    } else {
      content = _.map(this.state.data, (beer, index) => (
        <span key={ index }>
          <ListItem
            primaryText={ `${beer.brewery} ${beer.name}` }
            secondaryText={ beer.type }
            onClick={ () => this.setState({ activeBeer: beer }) }
            leftIcon={
              <Badge
                badgeContent={ beer.ranking }
                badgeStyle={ { backgroundColor: this.state.color } }
                style={ {
                  padding: 0,
                  paddingLeft: '34px',
                  width: 0
                } }
              />
            }
          />
          { index === this.state.data.length - 1 ? null : <Divider /> }
        </span>
      ));
    }

    const popupActions = [
      <FlatButton
        label="Edit"
        style={ { color: this.state.color } }
      />,
      <FlatButton
        label="Close"
        onClick={ () => this.setState({ activeBeer: null }) }
        style={ { color: this.state.color } }
      />
    ];

    const popup = this.state.activeBeer ?
      (
        <Dialog
          title={ `${this.state.activeBeer.brewery} ${this.state.activeBeer.name}` }
          actions={ popupActions }
          open={ _.some(this.state.activeBeer) }
          onRequestClose={ () => this.setState({ activeBeer: null }) }
        >
          <List>
            <ListItem disabled style={ { padding: '10px 0' } }>{ `Type: ${this.state.activeBeer.type}` }</ListItem>
            <ListItem disabled style={ { padding: '10px 0' } }>{ `Brewed in: ${this.state.activeBeer.city}, ${this.state.activeBeer.state} ${this.state.activeBeer.country}` }</ListItem>
            <ListItem disabled style={ { padding: '10px 0' } }>{ `Professional Critque:\n\n${this.state.activeBeer.comments}` }</ListItem>
          </List>
        </Dialog>
      ) :
      null;

    return (
      <div
        className="app"
        style={ { backgroundColor: this.state.color } }
      >
        <div className="app-container">
          { error }
          { popup }
          <Paper zDepth={ 2 }>
            <Card>
              <CardTitle
                title="The Beer List"
                style={ { paddingBottom: '0' } }
              />
              <CardText>
                <List
                  style={
                    this.state.loading ?
                    {
                      display: 'flex',
                      justifyContent: 'center'
                    } :
                    null
                  }
                >
                  { content }
                </List>
              </CardText>
            </Card>
          </Paper>
        </div>
      </div>
    );
  }
}

export default App;
