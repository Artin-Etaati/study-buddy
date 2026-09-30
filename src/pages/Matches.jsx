import classes from './Matches.module.css'
const Matches = () => {
    const matches =[
        {
        id: 1, 
        name: "John Doe", 
        Major: "Mathematics", 
    },
    {
        id: 2,
        name: "Jane Smith",
        Major: "Physics",
    },
     {
        id: 3,
        name: "Bob Jones",
        Major: "Computer Science",
    },
    {
    id: 4,
    name: "Charlie Brown",
    Major: "Biology",
    }
    ]
    return(  
        <div className={classes.localbody}>
        <div className={classes.header}>
         <h1>Matches</h1>
        </div>
        <div className={classes.matchesList}>
         {matches.map((match) => (
                <div className={classes.matchCard} key={match.id}> 
                 <div className={classes.avatar}>
            <img src="/images.png"
             alt="User Avatar" />
             </div>
                <div className={classes.matchinfo}>
                    <h2>{match.name}</h2>
                    <p>Major: {match.Major}</p>
                    <button>View Profile</button>
                    <button>Message</button>
               
                </div>
                </div>
            ))}
             </div>
            </div>
    );
}
export default Matches;