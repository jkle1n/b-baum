import React from 'react'
import { Node } from './Node';
import { Card, Typography } from '@material-ui/core';

export class Baum extends React.Component {
    componentDidUpdate(prevProps) {
        if (prevProps.found !== this.props.found) {
            let test = this.props.found;
        }
    }
    displayNodes = () => {
        let items = [];
        if (this.props.nodes.length !== 0) {
            let rootIndex = this.props.findIndexOfRoot();
            let index = rootIndex;
            items.push(<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}><Node param={this.props.param} items={this.props.nodes[rootIndex].items} found={rootIndex === this.props.foundItem} /><br /></div>);
            let i = 1;
            let childs = this.props.nodes[index].childs;
            let childIndex;
            let newChilds = [];
            let tmpItems = [];
            while (childs.length !== 0) {
                for (let j = 0; j < childs.length; j++) {
                    childIndex = this.props.findIndexOfNode(childs[j]);
                    tmpItems.push(<Node param={this.props.param} items={this.props.nodes[childIndex].items} found={childIndex === this.props.foundItem} />);
                    newChilds = newChilds.concat(this.props.nodes[childIndex].childs);
                }
                items.push(<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>{tmpItems}</div>);
                tmpItems = [];
                childs = newChilds;
                newChilds = [];
            }
        }
        return items;

    }
    render() {
        return (
            <Card className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography>
                    B-Baum
                </Typography>
                {this.displayNodes()}
            </Card>
        );
    }
}