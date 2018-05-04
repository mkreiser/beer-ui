import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { renderRoutes } from 'react-router-config';

import Badge from 'material-ui/Badge';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';

class App extends React.Component {
  static colors = ['#FCA49F', '#FCC99F', '#F9DF94', '#CFFF9F', '#6CD4AC'];

  constructor() {
    super();

    this.updateColor = this.updateColor.bind(this);

    axios.get('/beers/').then((response) => {
      this.setState({
        data: response.data,
        loading: false
      });
    });

    this.state = {
      color: _.first(this.constructor.colors),
      colorIndex: 0,
      loading: true
    };
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
    return (
      <div
        className="app"
        style={{
          backgroundColor: this.state.color
        }}
      >
        <div className="app-container">
        <Paper zDepth={2}>
          <Card>
            <CardTitle
              title="The Beer List"
              style={{ paddingBottom: '0' }}
            />
            <CardText>
              <List
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {
                  this.state.loading ?
                    <CircularProgress
                      color={ this.state.color }
                      size={30}
                    /> :
                    _.map(this.state.data, (beer, index) => (
                      <span key={ index }>
                        <Badge
                          badgeContent={ beer.ranking }
                          badgeStyle={{
                            position: 'unset',
                            top: 'unset',
                            left: 'unset',
                            backgroundColor: this.state.color
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flexDirection: 'row-reverse',
                            padding: '12px 24px'
                          }}
                        >
                          <ListItem
                            primaryText={ `${beer.brewery} ${beer.name}` }
                            secondaryText={ beer.type }
                            containerElement="div"
                            style={{ flexGrow: 1 }}
                          />
                        </Badge>
                        { index === this.state.data.length - 1 ? null : <Divider /> }
                      </span>
                    ))
                }
              </List>
            </CardText>
          </Card>
          </Paper>
        </div>
      </div>
    );
  }
};

export default App;
