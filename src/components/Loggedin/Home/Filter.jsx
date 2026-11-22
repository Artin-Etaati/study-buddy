import { useEffect, useState } from "react"
import SearchableSelect from '@/components/Frontpage/Setup/SearchableSelect';
import { getMajors } from '@/services/profileService';
import filters from "@/css/LoggedIn/Filters.module.css"

function Filters({ setFilter, getFilter }) {
    const [listOfMajors, setListOfMajors] = useState([])
    const [listOfAges, setListOfAges] = useState([])
    const [getGender, setGender] = useState("")
    const [getStudyStyle, setStudyStyle] = useState("")
    const [getMajor, setMajor] = useState("")
    const [getBirthdayMin, setBirthdayMin] = useState("")
    const [getBirthdayMax, setBirthdayMax] = useState("")


    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const data = await getMajors();
                setListOfMajors(data);
            } catch (error) {
                console.error('Error fetching majors:', error);
            }
        };

        const constructAges = () => {
            const ageList = [];
            for (let i = 15; i <= 100; i++) {
                const object = { id: i, name: String(i) }
                ageList.push(object)
            }
            setListOfAges(ageList)
        }

        fetchMajors();
        constructAges();

    }, []);

    function handleGenderFilter(value) {
        if (getGender != value) {
            setGender(value)
        }
    }

    function handleStudyStyleFilter(value) {
        if (getStudyStyle != value) {
            setStudyStyle(value)
        }
    }

    function handleMajorFilter(value) {
        if (getMajor != value) {
            setMajor(value)
        }
    }

    function handleBirthdayMinFilter(value) {
        if (getBirthdayMin != value) {
            setBirthdayMin(value)
        }
    }

    function handleBirthdayMaxFilter(value) {
        if (getBirthdayMax != value) {
            setBirthdayMax(value)
        }
    }

    function resetFilter() {
        setGender("")
        setStudyStyle("")
        setMajor("")
        setBirthdayMin("")
        setBirthdayMax("")
        setFilter({})
    }
    useEffect(() => {

        const genderJSON = getGender != "" ? { gender: getGender } : {};
        const studyStyleJSON = getStudyStyle != "" ? { study_style: getStudyStyle } : {};
        const majorJSON = getMajor != "" ? { major: getMajor } : {}
        let birthdayMinJSON = getBirthdayMin != "" ? { birthday_min: getBirthdayMin } : {};
        let birthdayMaxJSON = getBirthdayMax != "" ? { birthday_max: getBirthdayMax } : {};

        setFilter(Object.assign({}, genderJSON, studyStyleJSON, majorJSON, birthdayMinJSON, birthdayMaxJSON))
    }, [getGender, getStudyStyle, getMajor, getBirthdayMin, getBirthdayMax])


    return (
        <div className={filters.parentContainer}>
            <div className={filters.title}>Filters</div>
            <div className={filters.container}>
                <div className={filters.subContainer}>
                    <select
                        name="gender"
                        onChange={(e) => { handleGenderFilter(e.target.value) }}
                        className={filters.input}
                        value={getGender}
                    >
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className={filters.subContainer}>
                    <select
                        name="studyStyle"
                        onChange={(e) => { handleStudyStyleFilter(e.target.value) }}
                        className={filters.input}
                        value={getStudyStyle}
                    >
                        <option value="">Study Style</option>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                        <option value="Either">Either</option>
                    </select>
                </div>
                <div className={filters.subContainer + " " + filters.searchableInputContainer}>
                    <SearchableSelect
                        name="major"
                        options={listOfMajors}
                        value={getMajor}
                        onChange={(e) => handleMajorFilter(e.target.value)}
                        placeholder="Major"
                        styleClass={filters.searchableInput}
                    />
                    {getMajor ? <button type="button" className={filters.closeBtn} onClick={() => setMajor("")}>x</button> : <></>}
                </div>
                <div className={filters.subContainer}>
                    <select name="birthday_min"
                        onChange={(e) => { handleBirthdayMinFilter(e.target.value) }}
                        className={filters.input}
                        value={getBirthdayMin}
                    >
                        <option key="" value="">Min Age</option>
                        {listOfAges.map((item) => {

                            return <option key={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>
                </div>
                <div className={filters.subContainer}>

                    <select name="birthday_max"
                        onChange={(e) => { handleBirthdayMaxFilter(e.target.value) }}
                        className={filters.input}
                        value={getBirthdayMax}
                    >
                        <option key="" value="">Max Age</option>
                        {listOfAges.map((item) => {
                            return <option key={item.id} value={item.id}>{item.name}</option>
                        })}
                    </select>
                </div>
                {Object.keys(getFilter).length != 0 ? <div className={filters.subContainer}>
                    <button type="button" className={filters.reset} onClick={resetFilter}>Reset</button>
                </div> : <></>}
                {/* <SearchableSelect
                name="birthday-min"
                options={listOfAges}
                value={getBirthdayMin}
                onChange={(e) => handleBirthdayMinFilter(e.target.value)}
                placeholder="Min Age"
            /> */}

                {/* <SearchableSelect
                name="birthday-max"
                options={listOfAges}
                value={getBirthdayMax}
                onChange={(e) => handleBirthdayMaxFilter(e.target.value)}
                placeholder="Max Age"
            /> */}

                {/* <button onClick={onApply}>Apply</button> */}

            </div>
        </div>
    )
}

export default Filters