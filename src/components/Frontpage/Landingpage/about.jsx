import classes from "./about.module.css"
import y from '../../../assets/y.png'

const About = () => {
  return (
      <div className={classes.container}>
        <div className={classes.textContent}>
          <span className={classes.badge}>Our Mission</span>
          <h2 className={classes.title}>Finding Study Partners Shouldn't Be Hard</h2>
          
          <p className={classes.description}>
            Connecting with classmates can feel overwhelming. Whether you struggle to break 
            the ice in massive lecture halls or simply don't have the time to track down a study 
            buddy between a busy class schedule and daily life.
          </p>

          <p className={classes.description}>
            StudyBuddy is a study study partner matchmaking platform built to take 
            the friction out of studying. Using custom targeted search filters like shared courses, 
            majors, and study habits, we instantly match you with people who share your goals and 
            preferences so you can make friends and get better grades.
          </p>

          <div className={classes.statsGrid}>
            <div className={classes.statItem}>
              <span className={classes.statNumber}>100%</span>
              <span className={classes.statLabel}>Reliable</span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statNumber}>Zero</span>
              <span className={classes.statLabel}>Awkward Icebreakers</span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statNumber}>100%</span>
              <span className={classes.statLabel}>Free</span>
            </div>
          </div>
        </div>
        <div className={classes.teamSection}>
          <span className={classes.badge}>The Builders</span>
          <h3 className={classes.teamTitle}>Meet the Developers</h3>
          <p className={classes.teamSubtitle}>
            Built by students, for students. We created StuddyBuddy to solve the exact networking 
            challenges we faced on campus.
          </p>
          <div className={classes.meet}>
            <div>
                <img src={y} alt="" />
                <p>This is Yoni</p>
            </div>
            <div>
                <img src="" alt="" />
                <p>This is Artin</p>
            </div>
            <div>
                <img src="" alt="" />
                <p>This is Erik</p>
            </div>
            <div>
                <img src="" alt="" />
                <p>This is Angel</p>
            </div>
            </div>
          </div>
      </div>
  )
}

export default About