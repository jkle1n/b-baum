import React from 'react'
import { Node } from './Node';
import { Card, Typography } from '@material-ui/core';

export class Baum extends React.Component {
    displayNodes = () => {
        let items = [];
        if (this.props.nodes.length !== 0) {
            let rootIndex = this.props.findIndexOfRoot();
            rootIndex = rootIndex === -1 ? 0 : rootIndex;
            let index = rootIndex;
            items.push(<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}><Node param={this.props.param} items={this.props.nodes[rootIndex].items} foundIndex={rootIndex === this.props.foundItem.nodeIndex ? this.props.foundItem.itemIndex : undefined} /><br /></div>);
            let childs = this.props.nodes[index].childs;
            let childIndex;
            let newChilds = [];
            let tmpItems = [];
            while (childs.length !== 0) {
                for (let j = 0; j < childs.length; j++) {
                    childIndex = this.props.findIndexOfNode(childs[j]);
                    tmpItems.push(<Node param={this.props.param} items={this.props.nodes[childIndex].items} foundIndex={childIndex === this.props.foundItem.nodeIndex ? this.props.foundItem.itemIndex : undefined} />);
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