import { Link } from "react-router-dom";

function AthleteItem({ athlete, onAthleteSelected }) {
  const toggleAthleteSelect = () => {
    athlete.selected = !athlete.selected;
    onAthleteSelected(athlete);
  };

  function getPhoto(pl) {
    const fn = pl.first_name + `-` + pl.last_name + `.png`
    console.log(fn)

    // return require(fn);
    try
    {
        return require(`../assets/photos/${fn}`)
    }
    catch
    {
        return require(`../assets/photos/male-no-photo.png`)
    }
   }
  return (
    <>
      <div className="mb-1 rounded-md card-compact bg-base-200 hover:bg-base-300">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            {/* <input
                            className="form-input mt-2 ml-2 px-2"
                            key={Math.random()}
                            type="checkbox"
                            id={`custom-checkbox-${athlete.id}`}
                            name={athlete.id}
                            value={athlete.id}
                            defaultChecked={athlete.selected}
                            onChange={() => toggleAthleteSelect()}
                        /> */}
            <div className="avatar">
              <div className="my-2 shadow w-8 h-10">
                <img src={getPhoto(athlete)} alt="Profile" />
              </div>
            </div>

            <p className="pt-2 text-md font-semibold">
              {athlete.first_name} {athlete.last_name.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AthleteItem;
