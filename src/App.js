import './App.css';
import { Baum } from './Baum';
import { InteractiveFields } from './InteractiveFields';
import React from 'react'

/* TODO:
** Dokumentation
 */

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      param: 2,
      items: [],
      nodes: [],
      foundItem: undefined
    }
  }
  updateParam = (newParam) => {
    let tmpItems = this.state.items;
    this.setState({ param: newParam, nodes: [], items: [] }, () => this.insertItem(tmpItems))
  }
  findIndexOfNode = (id, nodes) => {
    nodes = nodes || this.state.nodes;
    return nodes.indexOf(nodes.find((node) => {
      return node.id === id;
    }))
  }
  findIndexOfRoot = (nodes) => {
    nodes = nodes || this.state.nodes;
    return nodes.indexOf(nodes.find((node) => {
      return !node.fatherId;
    }))
  }
  sortItems = (items) => {
    return items.sort((a, b) => a - b);
  }
  insertItem = (items) => {
    let tmpItems = [...this.state.items];
    let tmpNodes = [...this.state.nodes];
    let insertedNodeIndex;
    items.foreach((newItem) => {
      //check if item is between 0 and 64000
      if (newItem < 0 || newItem > 64000 || isNaN(newItem)) {
        alert("Es dürfen nur Werte zwischen 0 und 64000 eingefügt werden...");
        return;
      }
      //check if item already exists
      let values = this.findItem(newItem, tmpNodes);
      if (values.indexOfItem !== undefined) {
        alert("Doppelte Werte dürfen nicht eingefügt werden...");
        return;
      }
      tmpItems.push(newItem);
      let index = tmpNodes.length !== 0 ? this.findIndexOfRoot(tmpNodes) : 0;
      if (tmpNodes.length === 0) {
        tmpNodes.push({ id: 0, childs: [], fatherId: undefined, items: [newItem] });
        insertedNodeIndex = 0;
      }
      else {
        while (tmpNodes[index].childs.length !== 0) {
          tmpNodes[index].items.find((item, itemIndex) => {
            let found = false;
            if (item > newItem) {
              index = this.findIndexOfNode(tmpNodes[index].childs[itemIndex], tmpNodes);
              found = true;
            }
            else if (item < newItem && itemIndex === tmpNodes[index].items.length - 1) {
              index = this.findIndexOfNode(tmpNodes[index].childs[itemIndex + 1], tmpNodes);
              found = true;
            }
            return found;
          })
        }
        tmpNodes[index].items.push(newItem);
        tmpNodes[index].items = this.sortItems(tmpNodes[index].items);
        insertedNodeIndex = index;
      }
      let newIndex = index;
      while (!this.validateNode(tmpNodes[newIndex].items, tmpNodes, newIndex)) {
        index = newIndex;
        let indexOfInsertedItem = tmpNodes[newIndex].items.indexOf(newItem);
        let node = [...tmpNodes[index].items];
        let splitIndex = Math.round(node.length / 2) - 1;
        tmpNodes[index].items = node.slice(0, splitIndex);    //New Left Node
        let currentLenght = tmpNodes.length;
        let nodeIsRoot = tmpNodes[index].fatherId === undefined;

        //New Parent Node
        if (!nodeIsRoot) {
          let fatherIndex = this.findIndexOfNode(tmpNodes[index].fatherId, tmpNodes);
          tmpNodes[fatherIndex].items.push(node[splitIndex])
          tmpNodes[fatherIndex].childs.splice(tmpNodes[fatherIndex].childs.indexOf(tmpNodes[index].id) + 1, 0, currentLenght);//Add splitted Node as Child
          tmpNodes[fatherIndex].items = this.sortItems(tmpNodes[fatherIndex].items);
          newIndex = fatherIndex;  //set NewIndex to validate new parent node
          if (indexOfInsertedItem === splitIndex) {
            insertedNodeIndex = fatherIndex;
          }
        }
        else {
          if (indexOfInsertedItem === splitIndex) {
            insertedNodeIndex = tmpNodes.length;
          }
          tmpNodes[index].fatherId = currentLenght;
          tmpNodes.push({
            id: currentLenght,
            childs: [tmpNodes[index].id, currentLenght + 1],
            fatherId: undefined,
            items: [node[splitIndex]]
          })
          newIndex = currentLenght;  //set NewIndex to validate new parent node
        }
        if (indexOfInsertedItem > splitIndex) {
          insertedNodeIndex = tmpNodes.length;
        }
        //New Right Node
        if (tmpNodes[index].childs.length !== 0) {

          tmpNodes.push({
            id: nodeIsRoot ? currentLenght + 1 : currentLenght,
            childs: tmpNodes[index].childs.slice(splitIndex + 1, node.length + 1),
            fatherId: tmpNodes[index].fatherId,
            items: node.slice(splitIndex + 1, node.length)
          });
          tmpNodes[index].childs = tmpNodes[index].childs.slice(0, splitIndex + 1);
          tmpNodes[nodeIsRoot ? currentLenght + 1 : currentLenght].childs.forEach(childId => {
            let childIndex = this.findIndexOfNode(childId, tmpNodes);
            tmpNodes[childIndex].fatherId = nodeIsRoot ? currentLenght + 1 : currentLenght;
          })
        }
        else {
          tmpNodes.push({
            id: nodeIsRoot ? currentLenght + 1 : currentLenght,
            childs: [],
            fatherId: tmpNodes[index].fatherId,
            items: node.slice(splitIndex + 1, node.length)
          });
        }

      }
      console.log(tmpItems);
      console.log(tmpNodes);
    })
    this.setState(() => ({
      nodes: tmpNodes,
      items: tmpItems,
      foundItem: insertedNodeIndex
    }));
  }
  getMaxValueOfLeftChild = (node) => {
    let tmpNode = { ...node };
    let tmpNodes = [...this.state.nodes];
    while (tmpNode.childs.length !== 0) {
      tmpNode = tmpNodes[this.findIndexOfNode(tmpNode.childs[tmpNode.childs.length - 1])];
    }
    return this.findIndexOfNode(tmpNode.id);
  }
  deleteItem = (items) => {
    let tmpNodes = [...this.state.nodes];
    let itemId;
    items.foreach((newItem) => {
      let values = this.findItem(newItem);
      //Return, wenn ein Wert nicht im Baum existiert
      if (values.indexOfItem === undefined) {
        alert(newItem + " kann nicht gelöscht werden, da dieser Wert nicht im Baum existiert.");
        return;
      }
      let itemIndex = values.indexOfNode;
      let itemNodeIndex = values.indexOfItem;
      if (tmpNodes[itemIndex].childs.length !== 0) {
        //Wähle größten Wert aus dem linken Pfad des gelöschten Items aus
        let indexOfMaxChildNode = this.getMaxValueOfLeftChild(tmpNodes[this.findIndexOfNode(tmpNodes[itemIndex].childs[itemNodeIndex])]);
        //Lösche größten Wert aus linkem Pfad und füge ihn anstatt des zu löschenden Elements ein
        tmpNodes[itemIndex].items[itemNodeIndex] = tmpNodes[indexOfMaxChildNode].items.pop();
        let fatherIndex;
        itemIndex = indexOfMaxChildNode;
        while (!this.validateNode(tmpNodes[itemIndex].items)) {
          itemId = tmpNodes[itemIndex].id;

          values = this.fixUnderflow(tmpNodes, itemIndex);
          tmpNodes = values.tmpNodes;
          fatherIndex = values.fatherId !== undefined ? this.findIndexOfNode(values.fatherId, tmpNodes) : values.fatherId;

          if (fatherIndex === undefined) {
            tmpNodes[itemIndex].fatherId = undefined;
            break;
          }
          else {
            let test = this.findIndexOfNode(itemId, tmpNodes);
            itemIndex = test === -1 || tmpNodes[itemIndex].fatherId !== undefined ? tmpNodes.indexOf(tmpNodes[fatherIndex]) : itemIndex;
          }
        }
      }
      else {
        //Lösche Wert
        if (tmpNodes.length === 1 && tmpNodes[itemIndex].items.length === 1) {
          tmpNodes = [];
        }
        else {
          tmpNodes[itemIndex].items.splice(itemNodeIndex, 1);
          let fatherIndex;
          while (!this.validateNode(tmpNodes[itemIndex].items)) {
            itemId = tmpNodes[itemIndex].id;
            values = this.fixUnderflow(tmpNodes, itemIndex);
            tmpNodes = values.tmpNodes;
            if (values.fatherId === undefined) {
              break;
            }
            fatherIndex = this.findIndexOfNode(values.fatherId, tmpNodes);
            itemIndex = this.findIndexOfNode(itemId, tmpNodes) === -1 || tmpNodes[itemIndex].fatherId !== undefined ? tmpNodes.indexOf(tmpNodes[fatherIndex]) : itemIndex;

          }
        }
      }
      console.log(tmpNodes);
    })
    this.setState(() => ({
      nodes: tmpNodes,
      foundItem: undefined
    }))
  }
  fixUnderflow = (tmpNodes, nodeIndex) => {
    let node = tmpNodes[nodeIndex];
    if (node.fatherId === undefined) {
      tmpNodes[this.findIndexOfNode(tmpNodes[nodeIndex].childs[0], tmpNodes)].fatherId = undefined;
      tmpNodes.splice(nodeIndex, 1);
      return { fatherId: undefined, tmpNodes: tmpNodes };
    }
    else {
      let fatherIndex = this.findIndexOfNode(node.fatherId, tmpNodes);
      //Ausgleich, wenn möglich mit linkem Nachbarn (wenn balance möglich, dann führe balance aus)
      let index = tmpNodes[fatherIndex].childs.indexOf(node.id);
      let leftIndex = index - 1;
      let rightIndex = index === tmpNodes[fatherIndex].childs.length - 1 ? -1 : index + 1;
      if (leftIndex !== -1 && rightIndex !== -1) {
        //Der Knoten hat 2 Partner
        let leftPartnerIndex = this.findIndexOfNode(tmpNodes[fatherIndex].childs[leftIndex], tmpNodes);
        let rightPartnerIndex = this.findIndexOfNode(tmpNodes[fatherIndex].childs[rightIndex], tmpNodes);
        if (tmpNodes[leftPartnerIndex].items.length > this.state.param - 1) {
          tmpNodes = this.balance(tmpNodes, leftPartnerIndex, nodeIndex, fatherIndex, "left", index);
        }
        else if (tmpNodes[rightPartnerIndex].items.length > this.state.param - 1) {
          tmpNodes = this.balance(tmpNodes, rightPartnerIndex, nodeIndex, fatherIndex, "right", index);
        }
        else {
          tmpNodes = this.merge(tmpNodes, "left", index, nodeIndex, fatherIndex);
        }
      }
      else {
        //Wähle linken bzw. rechten Partner aus
        let partner = leftIndex !== -1 ? "left" : "right";
        let partnerIndex = this.findIndexOfNode(tmpNodes[fatherIndex].childs[partner === "left" ? leftIndex : rightIndex], tmpNodes);
        //balanciere, wenn möglich
        if (tmpNodes[partnerIndex].items.length > this.state.param - 1) {
          tmpNodes = this.balance(tmpNodes, partnerIndex, nodeIndex, fatherIndex, partner, index)
        }
        else {
          tmpNodes = this.merge(tmpNodes, partner, index, nodeIndex, fatherIndex);
        }
      }
      return { fatherId: node.fatherId, tmpNodes: tmpNodes };
    }
  }
  balance = (tmpNodes, partnerNodeIndex, nodeIndex, parentNodeIndex, partner, index) => {
    let partnerNodeItem = partner === "left" ? tmpNodes[partnerNodeIndex].items.pop() : tmpNodes[partnerNodeIndex].items.shift();
    if (tmpNodes[partnerNodeIndex].childs.length !== 0) {
      let tmpChild;
      if (partner === "left") {
        tmpChild = tmpNodes[partnerNodeIndex].childs.pop();
        tmpNodes[this.findIndexOfNode(tmpChild, tmpNodes)].fatherId = tmpNodes[nodeIndex].id;
        tmpNodes[nodeIndex].childs.unshift(tmpChild);
      }
      else {
        tmpChild = tmpNodes[partnerNodeIndex].childs.shift();
        tmpNodes[this.findIndexOfNode(tmpChild, tmpNodes)].fatherId = tmpNodes[nodeIndex].id;
        tmpNodes[nodeIndex].childs.push(tmpChild);
      }
    }
    let item = tmpNodes[parentNodeIndex].items[index === 0 ? 0 : index - 1];
    tmpNodes[parentNodeIndex].items[index === 0 ? 0 : index - 1] = partnerNodeItem;
    tmpNodes[parentNodeIndex].items = this.sortItems(tmpNodes[parentNodeIndex].items);

    tmpNodes[nodeIndex].items.push(item);
    tmpNodes[nodeIndex].items = this.sortItems(tmpNodes[nodeIndex].items);
    return tmpNodes;
  }
  merge = (tmpNodes, partner, index, nodeIndex, fatherIndex) => {
    let item = tmpNodes[fatherIndex].items.splice(partner === "left" ? index - 1 : index, 1);
    let partnerIndex = this.findIndexOfNode(tmpNodes[fatherIndex].childs[partner === "left" ? index - 1 : index + 1], tmpNodes);
    //merge nodes
    tmpNodes[partnerIndex].items = tmpNodes[partnerIndex].items.concat(item).concat(tmpNodes[nodeIndex].items);
    if (tmpNodes[nodeIndex].childs.length !== 0) {
      partner === "right" ?
        tmpNodes[partnerIndex].childs = tmpNodes[nodeIndex].childs.concat(tmpNodes[partnerIndex].childs) :
        tmpNodes[partnerIndex].childs.concat(tmpNodes[nodeIndex].childs);
      tmpNodes[nodeIndex].childs.forEach((id) => {
        tmpNodes[this.findIndexOfNode(id, tmpNodes)].fatherId = tmpNodes[partnerIndex].id;
      })
    }
    this.sortItems(tmpNodes[partnerIndex].items);
    tmpNodes[fatherIndex].childs.splice(index, 1);
    //delete undeflow-node
    if (tmpNodes[nodeIndex].items.length === 0) { tmpNodes.splice(nodeIndex, 1); }
    return tmpNodes;
  }
  searchItem = (searchedItem) => {
    let values = this.findItem(searchedItem);
    if (values.indexOfItem !== undefined) {
      this.setState(() => ({
        foundItem: values.indexOfNode,
      }))
    }
    return values;
  }
  findItem = (searchedItem, tmpNodes) => {
    tmpNodes = tmpNodes || [...this.state.nodes];
    let index = this.findIndexOfRoot(tmpNodes);
    let searchedItemIndex = undefined;
    let costs = 1;
    if (index !== -1) {
      while (searchedItemIndex === undefined) {
        if (index === undefined) {
          break;
        }
        tmpNodes[index].items.find((item, itemIndex) => {
          let breakLoop = false;
          if (item > searchedItem) {
            if (tmpNodes[index].childs.length === 0) {
              index = undefined;
              return true;
            }
            index = this.findIndexOfNode(tmpNodes[index].childs[itemIndex], tmpNodes);
            costs++;
            breakLoop = true;
          }
          else if (item < searchedItem && itemIndex === tmpNodes[index].items.length - 1) {
            if (tmpNodes[index].childs.length === 0) {
              index = undefined;
              return true;
            }
            index = this.findIndexOfNode(tmpNodes[index].childs[itemIndex + 1], tmpNodes);
            costs++;
            breakLoop = true;
          }
          else if (item === searchedItem) {
            searchedItemIndex = itemIndex;
            breakLoop = true;
          }
          return breakLoop;
        })
      }
    }
    return { indexOfNode: index, indexOfItem: searchedItemIndex, costs: costs }; //return indexOfNode and indexOfItem
  }
  validateNode = (items, tmpNodes, indexOfNode) => {
    let nodes = tmpNodes || this.state.nodes;
    //root darf auch nur 1 Element enthalten
    if (indexOfNode !== undefined && nodes[indexOfNode].fatherId === undefined && items.length < 2 * this.state.param) {
      return true;
    }
    else {
      //validate = true, wenn die Anzahl der Elemente eines Knotens zwischen param und 2*param-1 liegt
      return items.length < 2 * this.state.param && items.length >= this.state.param - 1;
    }
  }
  clearNodes = () => {
    this.setState(() => ({
      nodes: [],
      items: []
    }))
  }
  render() {
    return (
      <div className="App" >
        <InteractiveFields updateParam={this.updateParam} insertItem={this.insertItem} deleteItem={this.deleteItem} searchItem={this.searchItem} clearNodes={this.clearNodes} />

        <Baum param={this.state.param} nodes={this.state.nodes} findIndexOfRoot={this.findIndexOfRoot} findIndexOfNode={this.findIndexOfNode} foundItem={this.state.foundItem} />

      </div>
    );
  }
}
