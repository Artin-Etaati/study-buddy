import classes from './Feature.module.css'

const Features = () => {
  return (
      <div className={classes.container}>
        <div className={classes.header}>
          <h2 className={classes.title}>Everything You Need to Connect</h2>
          <p className={classes.subtitle}>
            Built specifically for students to find reliable study partners without the hassle.
          </p>
        </div>

        <div className={classes.grid}>
          
              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Matchmaking</h3>
                <p className={classes.cardDescription}>Instantly get paired with ideal study partners ranked by common classes,
                  academic major, and shared learning habits.</p>
              </div>

              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Live chat</h3>
                <p className={classes.cardDescription}>Connect directly with matched study partners through instant live messaging 
                  to organize study sessions and share notes.</p>
              </div>

              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Search Filters</h3>
                <p className={classes.cardDescription}>Filter students by classes, study style, 
                  major, age and more.</p>
              </div>

              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Campus Security</h3>
                <p className={classes.cardDescription}>Strict security enforced through mandatory 
                  .edu university email verification to ensure a safe, student-only environment.</p>
              </div>

              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Swipe system</h3>
                <p className={classes.cardDescription}>Swipe right if a students major, classes, and study 
                  style match your goals, or swipe left to keep browsing</p>
              </div>

              <div className={classes.card}>
                <h3 className={classes.cardTitle}>Privacy</h3>
                <p className={classes.cardDescription}>Your personal data stays safe and under your control. 
                  All data you enter into this app stays with you and you only. 
                </p>
              </div>

            </div>
        </div>
  )
}

export default Features