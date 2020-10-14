import React from 'react';
import {
    Jumbotron, Card, CardText, CardBody, CardHeader, Button, Row, Col
} from 'reactstrap';
import axios from 'axios';
import { generateSuite } from '../helperFunctions/helpers';

const HomePage = ({history}) => {

    const handleLevelClick = (e) => {
        const level = e.target.value;
        axios.post(`/api/game`, { level })
        .then(res => {            
          if(res.statusText === "OK"){                   
              history.push({
                pathname: `/play/${res.data.level}`,
                state: { 
                    game: res.data.game, 
                    suiteOneCards: generateSuite(res.data.level),
                    suiteTwoCards: generateSuite(res.data.level)
                }
              });
          }
        })
        .catch(err => {console.log(err)});        
    }

    return (
        <div>
            <Jumbotron>
                <h1 className="display-3">Memory Game</h1>

                <hr className="my-2" />
                <p>Please select difficulty level from options below</p>
                <p className="">
                    <Row>
                        <Col xs="6" sm="4">
                            <Card className="text-center">
                                <CardHeader>Easy</CardHeader>
                                <CardBody>
                                    <CardText>
                                        Contains 2 suits with 5 cards in each.
                                    </CardText>
                                    <br />
                                    <Button value="easy" onClick={handleLevelClick} color="success">Play</Button>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="6" sm="4">
                            <Card className="text-center">
                                <CardHeader>Medium</CardHeader>
                                <CardBody>
                                    <CardText>
                                        Contains 2 suits with 10 cards in each.
                                    </CardText>
                                    <br />
                                    <Button value="medium" onClick={handleLevelClick} color="warning">Play</Button>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="6" sm="4">
                            <Card className="text-center">
                                <CardHeader>Hard</CardHeader>
                                <CardBody>
                                    <CardText>
                                        Contains 2 suits with 25 cards in each.
                            </CardText>
                                    <br />
                                    <Button value="hard" onClick={handleLevelClick} color="danger">Play</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </p>
            </Jumbotron>
        </div>
    )
}

export default HomePage;