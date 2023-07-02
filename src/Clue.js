import React from 'react';

class Clue extends React.Component {

    

    render() {
        const clue = this.props.clue;
        const color = this.props.color;

        return (
            color ? 
                <div className={"clueGREEN"} >
                {clue.map((num, i) =>
                    <div key={i}>
                        {num}
                    </div>
                )}
            </div>
         : 
         <div className={"clueRED"} >
         {clue.map((num, i) =>
             <div key={i}>
                 {num}
             </div>
         )}
         </div>
            
        );
}	
}

export default Clue;