import "../styles/homeStyle.css";

export default function Home () {
    return (
        <div className="sign-container">
            <a href="/signup" className="sign-btn">Create an account</a>
            <a href="/signin" className="sign-btn">Signin</a>
        </div>

    );
}