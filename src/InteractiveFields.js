/* Frage zu Beispiel:
A: insert [2,1,11] --> alle in einem Knoten
B: Baue Baum auf und lösche alles, bis auf 1,2 und 11 (2 = Wurzel) */

import React from 'react';
import CSVReader from 'react-csv-reader';
import { Button, TextField, Input, InputAdornment, Tooltip, Card, Typography, Paper } from '@material-ui/core';
import "./App.css";

export class InteractiveFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: 2,
            tmpItems: "",
            itemsToDelete: [],
            itemsToInsert: [],
            insertedItems: 0,
            randomParam: undefined,
        }
    }
    setParam = (e) => {
        e.persist();
        this.setState({ param: e.target.value });
    }
    updateParam = () => {
        var newParam = parseInt(this.state.param);
        if (newParam >= 2) {
            this.props.updateParam(newParam);
        }
        else { alert("Der Parameter muss >= 2 sein.") }
    }
    setNewItem = (e) => {
        e.persist();
        this.setState(() => ({ tmpItems: e.target.value }));
    }
    insertItem = (items) => {
        if (items === undefined) {
            items = this.state.tmpItems.split(",");
            items = items.map((item) => {
                return parseInt(item);
            })
        }
        if (items) {
            this.continue(items, "insert");
            this.setState(() => ({ tmpItems: '' }))
        }
    }
    setDeleteItem = (e) => {
        e.persist();
        this.setState(() => ({ itemsToDelete: e.target.value }));
    }
    deleteItem = () => {
        if (this.state.itemsToDelete) {
            let itemsToDelete = this.state.itemsToDelete.split(",");
            itemsToDelete = itemsToDelete.map((item) => {
                return parseInt(item);
            })
            this.continue(itemsToDelete, "delete");
        }
    }
    setSearchItem = (e) => {
        var tmpItemToFind = e.target.value;
        this.setState(() => ({ tmpItemToFind: tmpItemToFind }));
    }
    findItem = () => {
        if (this.state.tmpItemToFind !== undefined) {
            let values = this.props.searchItem(parseInt(this.state.tmpItemToFind));
            if (values.indexOfItem === undefined) {
                alert(this.state.tmpItemToFind + " befindet sich nicht im B-Baum.");
            }
            alert("Kosten: " + values.costs);
            this.setState(() => ({ tmpItemToFind: "" }))
        }
    }
    generateRandomNumbers = () => {
        let tmpMax = parseInt(this.state.randomMax);
        let tmpMin = parseInt(this.state.randomMin);
        let tmpParam = parseInt(this.state.randomParam);
        if (tmpMin >= tmpMax) {
            alert("Die Untergrenze muss kleiner als die Obergrenze sein.");
        }
        else if (tmpParam === undefined || tmpMin === undefined || tmpMax === undefined) {
            alert("Bitte definieren Sie die Anzahl und eine Unter- und Obergrenze");
        }
        else {
            let tmpItems = [];
            for (let i = 0; i < tmpParam; i++) {
                //Zufallszahlen zwischen min und max-1
                tmpItems.push(Math.floor(Math.random() * (tmpMax - tmpMin) + tmpMin));
            }
            this.continue(tmpItems, "insert");
            this.setState(() => ({
                randomMax: "",
                randomMin: "",
                randomParam: ""
            }))
        }
    }
    insertItemEvent = () => {
        this.insertItem();
    }
    insertItemsFromCsv = (data, fileInfo) => {
        let items;
        if (data === undefined) {
            items = this.state.itemsToInsert;
        }
        else {
            items = data[0];
            items = items.map((item) => {
                return parseInt(item);
            })
        }
        let answer = prompt(items + " einfügen?\nLöschen Sie den Inhalt des Textfeldes um alle Elemente auf einmal einzufügen.", 'schrittweise');
        if (answer !== null) {
            if (answer === "schrittweise") {
                this.continue(items, "insert");
            }
            else {
                this.props.insertItem(items);
            }
        }
    }
    continueEvent = () => {
        this.continue();
    }
    continue = (items, op) => {
        if (items === undefined && op === undefined) {
            if (this.state.itemsToInsert.length !== 0) {
                items = this.state.itemsToInsert;
                op = "insert";
            }
            else if (this.state.itemsToDelete.length !== 0) {
                items = this.state.itemsToDelete;
                op = "delete"
            }
        }

        let tmpItem = items.shift();
        if (op === "insert") {
            this.setState(() => ({
                itemsToInsert: items,
                lockInteraction: items.length !== 0
            }))
            this.props.insertItem([tmpItem]);
        }
        else {
            this.setState(() => ({
                itemsToDelete: items,
                lockInteraction: items.length !== 0
            }))
            this.props.deleteItem([tmpItem]);
        }
    }

    render() {

        return (
            <Card className="card">
                <Paper className="paper" >

                    <Typography >
                        Allgemeines
                    </Typography>
                    <Button style={{ float: "left" }} onClick={this.props.clearNodes} variant="contained" disabled={this.state.lockInteraction} >Baum löschen</Button>
                    <Tooltip title="Um mehrere Werte einzufügen/zu löschen" placement="top-start">
                        <span style={{ float: "right" }}>
                            <Button onClick={this.continueEvent} variant="contained" disabled={this.state.itemsToInsert.length === 0 && this.state.itemsToDelete.length === 0} >Weiter</Button>
                        </span>
                    </Tooltip>
                    <br /><Input
                        label="Parameter"
                        value={this.state.param}
                        onChange={this.setParam}
                        min={2}
                        onKeyPress={(e) => { if (e.key === "Enter") { this.updateParam() }; }}
                        endAdornment={
                            <InputAdornment position="end">
                                <Button onClick={this.updateParam} disabled={this.state.lockInteraction} >Parameter ändern</Button>
                            </InputAdornment>
                        }
                        placeholder="Parameter einfügen"
                        disabled={this.state.lockInteraction}
                    />

                </Paper>
                <Paper className="paper">
                    <Typography>
                        Werte einfügen
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        disabled={this.state.lockInteraction}
                    >
                        Upload File
                    <CSVReader onFileLoaded={(data, fileInfo) => this.insertItemsFromCsv(data, fileInfo)} inputStyle={{ color: 'red' }} />
                    </Button><br />
                    <Input
                        label="Elemente einfügen"
                        value={this.state.tmpItems}
                        onChange={this.setNewItem}
                        onKeyPress={(e) => { if (e.key === "Enter") { this.insertItem() }; }}
                        endAdornment={
                            <InputAdornment position="end">
                                <Tooltip title="Mehrere Werte trennen durch Kommas (Z.B.: 5,7,2,3)" placement="top-start">
                                    <Button onClick={this.insertItemEvent} disabled={this.state.lockInteraction} >Einfügen</Button>
                                </Tooltip>
                            </InputAdornment>
                        }
                        placeholder="Werte einfügen"
                        disabled={this.state.lockInteraction}
                    />
                    <br />
                    <TextField value={this.state.randomParam} label="Anzahl" onChange={(e) => this.setState({ randomParam: e.target.value })} placeholder="N" min="1" max="20" disabled={this.state.lockInteraction} />
                    <TextField value={this.state.randomMin} label="Untergrenze" onChange={(e) => this.setState({ randomMin: e.target.value })} placeholder="N" min="1" max="20" disabled={this.state.lockInteraction} />
                    <TextField value={this.state.randomMax} label="Obergrenze" onChange={(e) => this.setState({ randomMax: e.target.value })} placeholder="N" min="1" max="20" disabled={this.state.lockInteraction} />
                    <Button onClick={this.generateRandomNumbers} disabled={this.state.lockInteraction} >Zufallszahlen einfügen</Button><br />
                    <br />
                </Paper>
                <Paper className="paper">
                    <Typography>
                        Werte löschen
                </Typography>
                    <Input
                        label="Elemente löschen"
                        value={this.state.itemsToDelete}
                        onChange={this.setDeleteItem}
                        onKeyPress={(e) => { if (e.key === "Enter") { this.deleteItem() }; }}
                        min={0}
                        endAdornment={
                            <InputAdornment position="end">
                                <Tooltip title="Mehrere Werte trennen durch Kommas (Z.B.: 5,7,2,3)" placement="top-start">
                                    <Button onClick={this.deleteItem} disabled={this.state.lockInteraction} >Löschen</Button>
                                </Tooltip>
                            </InputAdornment>
                        }
                        placeholder="Werte löschen"
                        disabled={this.state.lockInteraction}
                    />
                </Paper>
                <Paper className="paper">
                    <Typography>
                        Wert suchen
                </Typography>
                    <Input
                        label="Element suchen"
                        value={this.state.tmpItemToFind}
                        onChange={this.setSearchItem}
                        onKeyPress={(e) => { if (e.key === "Enter") { this.findItem() }; }}
                        min={0}
                        endAdornment={
                            <InputAdornment position="end">
                                <Button onClick={this.findItem} disabled={this.state.lockInteraction} >Suchen</Button>
                            </InputAdornment>
                        }
                        placeholder="Wert suchen"
                        disabled={this.state.lockInteraction}
                    />
                </Paper>
            </Card>
        );
    }
}