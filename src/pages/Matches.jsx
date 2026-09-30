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
    ]
    return(
        <div>
            <h1>My Matches</h1>
            <p>Here you can view your study buddy matches and connect with them for collaborative learning.</p>

        <div className={classes.matchesList}></div>
         {matches.map((match) => (
                <div className={classes.matchCard} key={match.id}>
                    <h2>{match.name}</h2>
                    <p>Major: {match.Major}</p>
                    <button>View Profile</button>
                    <button>Message</button>
                </div>
            ))}
        </div>
    );
}
export default Matches;