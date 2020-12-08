import React from 'react';
import { Paper } from '@material-ui/core';

export class Node extends React.Component {

    render() {
        return (
            <Paper style={{ display: "flex", flexDirection: "row", float: "left", margin: 5, background: "black" }}>
                {this.props.items.map((item, index) => {
                    return <Paper style={{ background: this.props.foundIndex === index ? "white" : "grey", color: this.props.foundIndex === index ? "black" : "white", width: "auto", height: 15, minWidth: 15, fontSize: 10, margin: 1, textAlign: "center" }}>{item}</Paper>
                })}
            </Paper>
        );
    }
}