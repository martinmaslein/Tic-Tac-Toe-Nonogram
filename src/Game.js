import React from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import Switch from '@material-ui/core/Switch';

class Game extends React.Component {

  pengine;

  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      rowClues: null,
      colClues: null,
      waiting: false,
      modo: '#',
      satisface_fila: [],
      satisface_columna: [],
      win: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePengineCreate = this.handlePengineCreate.bind(this);
    this.pengine = new PengineClient(this.handlePengineCreate);
  }

  handlePengineCreate() {
    const queryS = 'init(PistasFilas, PistasColumns, Grilla)';
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['Grilla'],
          rowClues: response['PistasFilas'],
          colClues: response['PistasColumns'],
          filaSatisface : Array(response['PistasFilas'].length).fill(0),
          columnaSatisface : Array(response['PistasColumns'].length).fill(0),
        });
      }
    });
  }

  cambiarModo() {
    var nModo = 'X';
    if (this.state.modo === 'X') 
      nModo = '#';

    this.setState({
      modo: nModo,
    })
  }

  handleClick(i, j) {
    // No action on click if we are waiting.
    if (this.state.waiting) {
      return;
    }
    
    const squaresS = JSON.stringify(this.state.grid).replaceAll('""', "");
    const queryS = 'put("'+ this.state.modo +'", [' + i + ',' + j + '], '+JSON.stringify(this.state.rowClues)+', '+JSON.stringify(this.state.colClues)+',' + squaresS + ', GrillaRes, FilaSat, ColSat)';
    //const queryS = 'put("'+this.state.modo+'", [' + i + ',' + j + ']' + ', [], [],' + squaresS + ', GrillaRes, FilaSat, ColSat)';

    this.setState({
      waiting: true
    });

    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['GrillaRes'],
          waiting: false,
        });
        this.actualizarFilaValida(i, response['FilaSat']);
        this.actualizarColumnaValida(j, response['ColSat']);

        this.winCheck();
      } else {
        this.setState({
          waiting: false
        });
      }
    });
  }

  actualizarFilaValida(indice, condicion){
    let satisface_fila= [...this.state.satisface_fila];
    satisface_fila[indice]=condicion;
    this.setState({satisface_fila});

    //console.log("satisface_fila "+ JSON.stringify(this.state.satisface_fila));
  }

  actualizarColumnaValida(indice, condicion){
    let satisface_columna = [...this.state.satisface_columna]; 
    satisface_columna[indice] = condicion;
    this.setState({satisface_columna});

    //console.log("satisface_columna " + JSON.stringify(this.state.satisface_columna));
  }

  winCheck() {
    let win = true;

    for (let i = 0; i < this.state.rowClues.length && win; i++) {
      if (!this.state.satisface_fila[i]) {
        win = false;
      }
    }

    for(let i = 0; i < this.state.colClues.length && win; i++) {
      if (!this.state.satisface_columna[i]) {
        win = false;
      }
    }
    
    if (win)
      window.alert("Ganaste!");

  }

  render() {
    if (this.state.grid === null) {
      return null;
    }
    const statusText = 'Cambiar modo # | X';
    return (
      <div className="game">
        <Board
          grid={this.state.grid}
          rowClues={this.state.rowClues}
          colClues={this.state.colClues}
          onClick={(i, j) => this.handleClick(i,j)}
          filaSat={this.state.satisface_fila}
          colSat={this.state.satisface_columna}
        />
        <div className="switch-panel"> 
          <div className="gameInfo">
            {statusText}
          </div>
          <Switch onChange={() => this.cambiarModo() }/>
        </div>
      </div>
    );
  }
}

export default Game;