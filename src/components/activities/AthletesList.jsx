import { useState, useReducer } from 'react'
import AthleteItem from "./AthleteItem"

function AthletesList({ athletes, onAthleteSelectionChanged }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const selectAll = () => {
        for (var i = 0; i < athletes.length; i++) {
            athletes[i].selected = true
        }
        onAthleteSelectionChanged(athletes)
        forceUpdate()
    }

    const selectNone = () => {
        for (var i = 0; i < athletes.length; i++) {
            athletes[i].selected = false
        }
        onAthleteSelectionChanged(athletes)
        forceUpdate()
    }

    const doAthleteSelected = (ath) =>
    {
        for (var i = 0; i < athletes.length; i++) {
            if (ath.id === athletes[i].id)
            {
                athletes[i].selected = ath.selected
                break
            }
        }
        onAthleteSelectionChanged(athletes)
    }
    return (
        <>
            <div className="flex space-x-4 mt-2">
                <button className="flex btn btn-sm" onClick={() => selectAll()}>Select All</button>
                <button className="flex btn btn-sm" onClick={() => selectNone()}>Select None</button>
            </div>

            <div className="overflow-y-auto h-[80vh]">
                <div className='pt-2 rounded-lg shadow-lg card-compact bg-base-100'>
                    {athletes.map((athlete) => (
                        <AthleteItem key={athlete.id} athlete={athlete} onAthleteSelected={(ath) => doAthleteSelected(ath)} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default AthletesList