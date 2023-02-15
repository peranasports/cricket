import { Link } from "react-router-dom";
import { getPlayerPhoto } from "../../utils/utils";

function AthleteItem({ athlete, isSelected, onAthleteSelected }) {

  const doAthleteSelect = () => {
    onAthleteSelected(athlete);
  };

  const background = () => {
    if (isSelected === false)
    {
      return "mb-1 rounded-md card-compact bg-base-200 hover:bg-base-300"
    }
    else
    {
      return "mb-1 rounded-md card-compact bg-blue-800 hover:bg-blue-900"
    }
  }
  return (
    <>
      <div className={background()} onClick={() => doAthleteSelect()}>
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div className="avatar">
              <div className="my-2 shadow w-8 h-10">
                <img src={getPlayerPhoto(athlete)} alt="Profile" />
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
