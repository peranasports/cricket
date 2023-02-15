import { useState, useReducer } from 'react'
import AthleteItem from "./AthleteItem"

function AthletesList({ athletes, onAthleteSelectionChanged }) {
    const [selectedAthlete, setSelectedAthlete] = useState(null)
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const doAthleteSelected = (ath) =>
    {
        setSelectedAthlete(ath)
        onAthleteSelectionChanged(ath)
    }
    return (
        <>
            <div className="overflow-y-auto h-[80vh]">
                <div className='pt-2 rounded-lg shadow-lg card-compact bg-base-100'>
                    {athletes.map((athlete) => (
                        <AthleteItem key={athlete.id} athlete={athlete} isSelected={selectedAthlete === athlete} onAthleteSelected={(ath) => doAthleteSelected(ath)} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default AthletesList