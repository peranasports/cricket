import { useState, useEffect } from "react";
import Select from "react-select";

function PlayerStats({ athlete, stats, allParameters }) {
  const [allParams, setAllParams] = useState([])
  const [selectedParams, setSelectedParams] = useState([])
  const [params, setParams] = useState([
    "acceleration_band1_total_distance",
    "acceleration_band1_total_duration",
    "acceleration_band1_total_effort_count",
    "acceleration_band2_total_distance",
    "acceleration_band2_total_duration",
    "acceleration_band2_total_effort_count",
  ]);
  const [statsRows, setStatsRows] = useState([]);
  const [, forceUpdate] = useState(0);

  function getPhoto(pl) {
    const fn = pl.first_name + `-` + pl.last_name + `.png`;
    console.log(fn);

    // return require(fn);
    try {
      return require(`../assets/photos/${fn}`);
    } catch {
      return require(`../assets/photos/male-no-photo.png`);
    }
  }

  function handleSelectParameters(data) {
    setSelectedParams(data);
  }

  const doParametersModalClosed = () =>
  {
    var ps = []
    for (var np=0; np<selectedParams.length; np++)
    {
      ps.push(selectedParams[np].slug)
    }
    setParams(ps)
    doStatsRows(ps)
    localStorage.setItem("selectedParameters", ps)
    forceUpdate((n) => !n);
  }

  const doStatsRows = (ps) => {
    const cols = 3;
    const rows = Number.parseInt(Math.ceil(ps.length / cols));
    var srows = [];
    for (var nr = 0; nr < rows; nr++) {
      var scols = [];
      for (var nc = 0; nc < cols; nc++) {
        const np = nr * cols + nc;
        if (np === ps.length) {
          break;
        }
        scols.push({
          param: ps[np].replace(/_/g, " ").toUpperCase(),
          value: stats[ps[np]],
        });
      }
      srows.push(scols);
    }
    setStatsRows(srows);
  };

  useEffect(() => {
    const po = localStorage.getItem("selectedParameters")
    if (po !== null)
    {
      const prs = po.split(",")
      setParams(prs)
      doStatsRows(prs);
    }
    else
    {
      doStatsRows(params);
    }
    var aps = []
    var selps = []
    allParameters.sort((a,b) => (a.slug > b.slug) ? 1 : ((b.slug > a.slug) ? -1 : 0))
    for (var np=0; np<allParameters.length; np++)
    {
      aps.push({value:np, label:allParameters[np].name, slug:allParameters[np].slug})
      if (params.includes(allParameters[np].slug))
      {
        var exists = false
        for (var nn=0; nn<selps.length; nn++)
        {
          if (selps[nn].slug === allParameters[np].slug)
          {
            exists = true
            break
          }
        }
        if (!exists)
        {
          selps.push({value:np, label:allParameters[np].name, slug:allParameters[np].slug})
        }
      }
    }
    setAllParams(aps)
    setSelectedParams(selps)
  }, [athlete.id]);

  return (
    <>
      <div>
        <div className="flex justify-between">
        <h3 className="text-2xl font-bold mb-4">
          {athlete.first_name.toUpperCase()} {athlete.last_name.toUpperCase()}
        </h3>
        <label className="btn btn-primary btn-sm" htmlFor="parameters-modal">Parameters</label>
        </div>

        <input type="checkbox" id="parameters-modal" className="modal-toggle" />
          <div className="modal w-full h-full">
            <div className="modal-box">
              <h3 className="mb-4 font-bold text-2xl">Parameters</h3>
              <div className="form">
                <div className="my-4">
                  <p className="text-xs">Paramters</p>
                  <div className="flex-col justify-between">
                    <Select
                      id="paramsSelect"
                      name="paramsSelect"
                      onChange={handleSelectParameters}
                      className="mt-2 block w-full border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-lg sm:text-md"
                      options={allParams}
                      value={selectedParams}
                      isMulti
                    />
                    <button
                      className="btn btn-sm btn-secondary mt-2"
                      onClick={() => setSelectedParams([])}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <label
                  htmlFor="parameters-modal"
                  className="btn btn-primary"
                  onClick={() => doParametersModalClosed()}
                >
                  Close
                </label>
              </div>
            </div>
          </div>

        <div className="flex w-full">
          <div className="my-2 shadow w-80 h-120">
            <img src={getPhoto(athlete)} alt="Profile" />
          </div>
          {stats === null ? (
            <></>
          ) : (
            <div className="flex-col">
              {statsRows.map((statsRow, id) => (
                <div className="stats shadow" key={id}>
                  {statsRow.map((stat, idx) => (
                    <div className="card shadow-md compact w-60 mr-2 mt-2 side bg-gray-700">
                      <div className="flex-row items-center space-x-4 card-body">
                        <div className="flex-col">
                          <div>
                            <h2 className="card-title text-sm justify-center">
                              {stat.param.replace(/_/g, " ").toUpperCase()}
                            </h2>
                            <h1 className="card-title text-secondary text-4xl justify-center">
                              {stat.value.toFixed(2)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>

                    // <div className="stat place-items-center" key={idx}>
                    //   <div className="stat-title">{stat.param}</div>
                    //   <div className="stat-value">{stat.value.toFixed(2)}</div>
                    // </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PlayerStats;
