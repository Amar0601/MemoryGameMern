import React, { useEffect, useState } from 'react';
import { Suite } from './Suites';
import ModalPopup from './Modal';
import { Row, Container, Button, Badge, Alert } from 'reactstrap'
import axios from 'axios';
import ErrorCounter from './ErrorCounter'
import Timer from './Timer';

const PlayGame = (props) => {
    const [game,] = useState(props.location.state.game);
    const [seconds, setSeconds] = useState(0);
    const [active, setActive] = useState(true);
    const [interval, setinterval] = useState(null);
    const [modal, setModal] = useState(props.isOpen);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertColor, setAlertColor] = useState();
    
    const toggle = () => setModal(!modal);

    const [roundData, setRoundData] = useState({ game });
    const handleSetRoundData = (data) => {
        setRoundData({ ...roundData, ...data });
    }

    const checkStatus = () => {
        if (suiteOneData.length === 0) {
            setActive(false);
            toggle();
        }
    }

    const removeBothCards = ({ card1, card2 }) => {
        let newArray = suiteOneData;
        suiteOneData.map((e, index) => {
            if (e.data === parseInt(card1)) {
                newArray.splice(index, 1);
                return;
            }
        });

        setSuiteOneData(newArray.map((element) => ({ "data": element.data, "visibility": false })));

        newArray = suiteTwoData;
        suiteTwoData.map((e, index) => {
            if (e.data === parseInt(card2)) {
                newArray.splice(index, 1);
                return;
            }
        });

        setSuiteTwoData(newArray.map((element) => ({ "data": element.data, "visibility": false })));
    }

    const hideBothCards = () => {
        setSuiteOneData(suiteOneData.map((element) => ({ "data": element.data, "visibility": false })));
        setSuiteTwoData(suiteTwoData.map((element) => ({ "data": element.data, "visibility": false })));
    }

    const showMessage = (flag, msgText) => {
        setAlertColor(flag ? "success" : "danger");
        setAlertMessage(msgText);
        setAlertVisible(true);
        setTimeout(()=>{
            setAlertVisible(false);
        },2000)
    }

    useEffect(() => {
        if (active) {
            if (interval === null) {
                setinterval(setInterval(() => {
                    setSeconds(seconds => seconds + 1);
                }, 1000));
            }
        } else {
            clearInterval(interval);
            return;
        }

        if (roundData.card1 !== undefined && roundData.card2 !== undefined) {
            axios.put(`/api/game`, roundData)
                .then(res => {
                    if (res.statusText === "OK") {
                        console.log(res);
                        console.log(res.data);

                        if (res.data.match) {
                            // Remove cards i.e pop item from array                            
                            removeBothCards(res.data);
                            // check game status and sto timer.
                            checkStatus();
                            // show message
                            showMessage(res.data.match, "Well played...");
                        } else {
                            // Hide card content i.e set visibility property
                            setTimeout(() => {
                                hideBothCards();
                            }, 3000);

                            handleErrorCount(errorCount + 1)
                            showMessage(res.data.match, "Ohhh! try again...");
                        }

                        setRoundData({ game });
                    }
                })
                .catch(err => { console.log(err) });
        } else {

        }
    }, [roundData, active])

    const [errorCount, setErrorCount] = useState(0);
    const handleErrorCount = () => {
        setErrorCount(errorCount + 1);
    }

    const [suiteOneData, setSuiteOneData] = useState(props.location.state.suiteOneCards);
    const handleSuiteOneData = (newData, roundData) => {
        const visible = suiteOneData.filter((element) => element.visibility === true);
        if (visible.length === 0) {
            setSuiteOneData(suiteOneData.map((element) => {
                if (element.data === newData){
                    if(roundData.card2 !== undefined) {
                        const style = roundData.card2 === newData ? {"border": "1px solid green"} : {"border": "1px solid red"};
                        return { "data": element.data, "visibility": true, style};
                    } else {
                        return { "data": element.data, "visibility": true, style: {"border": "1px solid green"}};
                    }
                    
                }
                else{
                    return { "data": element.data, "visibility": false, style: {}};
                }
                    
            }));
            return true;
        } else {
            return false;
        }
    }

    const [suiteTwoData, setSuiteTwoData] = useState(props.location.state.suiteTwoCards);
    const handleSuiteTwoData = (newData, roundData) => {
        const visible = suiteTwoData.filter((element) => element.visibility === true);
        if (visible.length === 0) {
            setSuiteTwoData(suiteTwoData.map((element) => {
                if (element.data === newData){
                    if(roundData.card1 !== undefined) {
                        const style = roundData.card1 === newData ? {"border": "1px solid green"} : {"border": "1px solid red"};
                        return { "data": element.data, "visibility": true, style};
                    } else {
                        return { "data": element.data, "visibility": true, style: {"border": "1px solid green"}};
                    }
                    
                }
                else{
                    return { "data": element.data, "visibility": false, style: {}};
                }
            }));
            return true;
        } else {
            return false;
        }
    }

    return (
        <div>
            <ModalPopup isOpen={modal} time={seconds} toggle={toggle} errors={errorCount} />
            <Container style={{ "margin-top": "5px" }}>
                <Row>
                    <Timer seconds={seconds} />                    
                    <div className="col-sm-6 text-center">
                        <Alert color={alertColor} isOpen={alertVisible} >
                            {alertMessage}
                        </Alert>
                    </div>
                    <ErrorCounter errorCount={errorCount} />
                </Row>
            </Container>
            <Container>
                <Suite
                    data={suiteOneData}
                    suite={1}
                    game={game}
                    handleSuiteData={handleSuiteOneData}
                    handleSetRoundData={handleSetRoundData}
                    roundData={roundData}
                />

                <hr style={{ "border-top": "10px solid rgba(0,0,0,.1)" }} />

                <Suite
                    data={suiteTwoData}
                    suite={2}
                    game={game}
                    handleSuiteData={handleSuiteTwoData}
                    handleSetRoundData={handleSetRoundData}
                    roundData={roundData}
                />
            </Container>
        </div>
    )
}

export default PlayGame;