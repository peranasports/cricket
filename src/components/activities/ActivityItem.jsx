import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { secsToDateTime } from "../../utils/utils";
import { UsersIcon } from "@heroicons/react/20/solid";

function ActivityItem({ activity }) {
  const { id, name, start_time } = activity;

  function getLogo(act) {
    // console.log(activity.name)
    if (act.tags.includes("T20 Domestic")) {
      return require(`../assets/logos/bbl-logo.png`);
    } else if (act.tags.includes("50 Over Domestic")) {
      return require(`../assets/logos/marsh-logo.png`);
    } else if (act.tags.includes("Multiday Domestic")) {
      return require(`../assets/logos/shield-logo.png`);
    } else if (act.name.toUpperCase().startsWith("HEAT")) {
      return require(`../assets/logos/heat-logo.png`);
    } else if (act.name.toUpperCase().startsWith("BULLS")) {
      return require(`../assets/logos/bulls-logo.png`);
    } else if (act.name.toUpperCase().startsWith("QLD")) {
      return require(`../assets/logos/qld-logo.png`);
    } else {
      return require(`../assets/logo64.png`);
    }
  }

  function getOppositionLogo(act) {
    const actname = act.name.toUpperCase();
    // console.log(actname)
    if (actname.includes("V THUNDER")) {
      return require(`../assets/logos/thunder-logo.png`);
    } else if (actname.includes("V SIXERS")) {
      return require(`../assets/logos/sixers-logo.png`);
    } else if (actname.includes("V STARS")) {
      return require(`../assets/logos/stars-logo.png`);
    } else if (actname.includes("V RENEGADES")) {
      return require(`../assets/logos/renegades-logo.png`);
    } else if (actname.includes("V SCORCHERS")) {
      return require(`../assets/logos/scorchers-logo.png`);
    } else if (actname.includes("V STRIKERS")) {
      return require(`../assets/logos/strikers-logo.png`);
    } else if (actname.includes("V HURRICANES")) {
      return require(`../assets/logos/hurricanes-logo.png`);
    } else if (actname.includes("V HEAT")) {
      return require(`../assets/logos/heat-logo.png`);
    } else if (actname.includes("V WA")) {
        return require(`../assets/logos/wa-logo.png`);
    } else if (actname.includes("V VIC")) {
        return require(`../assets/logos/vic-logo.png`);
    } else if (actname.includes("V SA")) {
        return require(`../assets/logos/sa-logo.png`);
    } else if (actname.includes("V TAS")) {
        return require(`../assets/logos/tasmania-logo.png`);
    } else if (actname.includes("V NSW")) {
        return require(`../assets/logos/nsw-logo.png`);
    } else if (actname.includes("V QLD")) {
        return require(`../assets/logos/bulls-logo.png`);
                } else {
      return null;
      //   return require(`../assets/logo64.png`);
    }
  }

  return (
    <div className="card shadow-md compact side bg-gray-700">
      <div className="flex-row items-center space-x-4 card-body">
        <div className="flex-col">
          <div className="avatar">
            <div className="my-2 shadow w-10 h-10">
              <img src={getLogo(activity)} alt="Profile" />
            </div>
          </div>
          {getOppositionLogo(activity) === null ? (
            <></>
          ) : (
            <div className="avatar">
              <div className="w-9 bg-gray-600 rounded-full">
                <img src={getOppositionLogo(activity)} />
              </div>
            </div>
          )}
        </div>
        <div>
          <Link className="text-base-content" to={`/activities/${id}`}>
            <h2 className="card-title text-lg">
              {name.replace(/_/g, " ").toUpperCase()}
            </h2>
            <div className="flex justify-between">
              <UsersIcon className="h-4 w-4 flex-shrink-0" />
              <div className="mx-2 badge badge-primary">
                {activity.athlete_count}
              </div>
              <p>{secsToDateTime(start_time).toDateString()}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityItem;
