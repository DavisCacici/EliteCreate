
interface ExecuteProps{
    onClick: () => void;
}

const Button: React.FC<ExecuteProps> = ({onClick}) =>{
     return(
        <div>
            <button onClick={onClick}>Undo</button>
        </div>
     );
}


export default Button;