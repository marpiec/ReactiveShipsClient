/// <reference path="../utils/Optional.ts"/>

namespace gameView {

    import CellState = game.CellState;
    import GameBoard = game.GameBoard;

    export class BoardXY {
        private _x: number;
        private _y: number;

        constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }


        get x(): number {
            return this._x;
        }

        get y(): number {
            return this._y;
        }
    }

    export class GameBoardViewProps {
        active: boolean;
        board: GameBoard;
        gameInterface: GameInterface;
    }

    export class GameBoardViewState {
        cellDown: Optional<BoardXY>;

        constructor(cellDown: Optional<BoardXY>) {
            this.cellDown = cellDown;
        }
    }


    export class GameBoardView extends React.Component<GameBoardViewProps, GameBoardViewState> {
        constructor(props: GameBoardViewProps) {
            super(props);
            this.state = new GameBoardViewState(None);
        }

        cellClicked(x: number, y: number) {
            if (this.props.active) {
                this.props.gameInterface.toggleCell(x, y);
            }
        }

        cellIsPressed(x: number, y: number) {
            const cellDown = this.state.cellDown;
            return cellDown.isPresent && cellDown.value.x === x && cellDown.value.y === y;
        }

        render() {
            const boardClasses = classNames("gameBoard", {active: this.props.active});
            return (
                <div className={boardClasses}>
                    {this.renderRows(this.props.board.rows)}
                </div>
            );
        }

        renderRows(board: Immutable.List<Immutable.List<CellState>>) {
            return board.map((cells: Immutable.List<CellState>, y: number) => (
                <div className="boardRow" key={y}>
                    {this.renderCells(y, cells)}
                </div>
            ));
        }

        cellToClassName(cell: CellState): string {
            switch (cell) {
                case CellState.empty:
                    return "empty";
                case CellState.hit:
                    return "hit";
                case CellState.miss:
                    return "miss";
                case CellState.ship:
                    return "ship";
                default:
                    throw new Error("Unsupported cell type");
            }
        }


        renderCells(y: number, cells: Immutable.List<CellState>) {
            return cells.map((cell: CellState, x: number) => {
                const cellClasses: string = classNames("boardCell", this.cellToClassName(cell),
                    {pressed: this.cellIsPressed(x, y)});
                return (
                    <div className={cellClasses} key={x}
                         onClick={this.cellClicked.bind(this, x, y)}>
                    </div>
                )
            });
        }
    }

}