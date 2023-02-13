import { useContext, useState, useEffect } from "react";
import Spinner from "../layout/Spinner";
import ActivityItem from "./ActivityItem";
import CatapultAPIContext from "../../context/CatapultAPI/CatapultAPIContext";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ActivityResults() {
  const { activities, tags, loading } = useContext(CatapultAPIContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [, forceUpdate] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateValueChange = (newValue) => {
    console.log("newValue:", newValue);
    // setValue(newValue);
  };

  function handleSelectTags(data) {
    setSelectedTags(data);
    filterActivities(data);
  }

  const toggleTagSelect = () => {};

  const doOptionChanged = (filter, item) => {};

  const filterActivities = (seltags, sdate, edate) => {
    const filters = {selectedTags: seltags, startDate: sdate, endDate: edate}
    localStorage.setItem("filters", JSON.stringify(filters));

    var tns = [];
    for (var nn = 0; nn < seltags.length; nn++) {
      tns.push(seltags[nn].label);
    }

    var acts = [];
    const sdt = sdate.getTime() / 1000;
    const edt = edate.getTime() / 1000;
    for (var n = 0; n < activities.length; n++) {
      const activity = activities[n];
      if (activity.start_time < sdt || activity.start_time > edt) {
        continue;
      }
      var exist = false;
      for (var nt = 0; nt < activity.tags.length; nt++) {
        var tag = activity.tags[nt];
        if (tns.includes(tag)) {
          acts.push(activity);
          exist = true;
          break;
        }
      }
      if (exist === false) {
        // console.log(activity)
      }
    }
    setSelectedActivities(acts);
  };

  const doFiltersModalClosed = () => {
    filterActivities(selectedTags, startDate, endDate);
  };

  const doSelectAllTags = () => {
    localStorage.setItem("selectedTags", JSON.stringify(allTags));
    setSelectedTags(allTags);
    setSelectedActivities(activities);
  };

  useEffect(() => {
    if (activities === null || activities.length === 0)
    {
      return
    }

    var xtags = tags.sort((a, b) => a.localeCompare(b));
    var ttt = [];
    for (var nx = 0; nx < xtags.length; nx++) {
      ttt.push({ value: nx, label: xtags[nx] });
    }
    setAllTags(ttt);

    const flts = localStorage.getItem("filters");
    if (flts !== null)
    {
      const filters = JSON.parse(flts)
      setSelectedTags(filters.selectedTags)
      const sdate = new Date(filters.startDate)
      const edate = new Date(filters.endDate)
      setStartDate(sdate);
      setEndDate(edate);

      var sts = [];
      for (var nt = 0; nt < filters.selectedTags.length; nt++) {
        for (var nxt = 0; nxt < ttt.length; nxt++) {
          if (ttt[nxt].label === filters.selectedTags[nt].label) {
            sts.push(filters.selectedTags[nt]);
            break;
          }
        }
      }
      setSelectedTags(sts);
      filterActivities(sts, sdate, edate)
    }
    else
    {
      var sdt = 16759858360; //new Date()
      var edt = 0; // new Date(1970, 1, 1)
      for (var na = 0; na < activities.length; na++) {
        sdt = activities[na].start_time < sdt ? activities[na].start_time : sdt;
        edt = activities[na].start_time > edt ? activities[na].start_time : edt;
      }
      const sdate = new Date(sdt * 1000) 
      const edate = new Date(edt * 1000)
      setStartDate(sdate);
      setEndDate(edate);
      setSelectedTags(ttt);
      // setSelectedActivities(activities);
      filterActivities(ttt, sdate, edate)
    }


    var vox = localStorage.getItem("selectedTags");
    // if (vox !== null) {
    //   const vo = JSON.parse(vox);
    //   var sts = [];
    //   for (var nt = 0; nt < vo.length; nt++) {
    //     for (var nxt = 0; nxt < ttt.length; nxt++) {
    //       if (ttt[nxt].label === vo[nt].label) {
    //         sts.push(vo[nt]);
    //         break;
    //       }
    //     }
    //   }
    //   setSelectedTags(sts);
    //   localStorage.setItem("selectedTags", JSON.stringify(sts));
    //   filterActivities(sts);
    // } else {
    // }

  }, [activities]);

  if (!loading) {
    if (activities === undefined) {
      return <></>;
    }
    return (
      <>
        <div className="form">
          <div className="flex my-2 justify-between">
            <p className="font-bold text-xl mt-2">{selectedActivities.length} ACTIVITIES</p>
          <label htmlFor="my-modal" className="btn btn-primary w-40">
            Activities Filters
          </label>
          </div>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <h3 className="mb-4 font-bold text-2xl">Activities Filters</h3>
              <div className="form">
                <div className="flex">
                  <div className="flex-col">
                    <p className="text-xs mb-2">Start Date</p>
                    <DatePicker className="h-8 px-2 rounded-sm bg-white text-gray-500"
                      selected={startDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                  <div className="flex-col mx-4">
                    <p className="text-xs mb-2">End Date</p>
                    <DatePicker className="h-8 px-2 rounded-sm bg-white text-gray-500"
                      selected={endDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={(date) => setEndDate(date)}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <p className="text-xs">Activity Tags</p>
                  <div className="flex-col justify-between">
                    <Select
                      id="tagsSelect"
                      name="tagsSelect"
                      onChange={handleSelectTags}
                      className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                      options={allTags}
                      value={selectedTags}
                      isMulti
                    />
                    <button
                      className="btn btn-sm btn-secondary mt-2"
                      onClick={() => doSelectAllTags()}
                    >
                      Select All Tags
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <label
                  htmlFor="my-modal"
                  className="btn btn-primary"
                  onClick={() => doFiltersModalClosed()}
                >
                  Close
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
            {selectedActivities &&
              selectedActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
          </div>
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
}

export default ActivityResults;
