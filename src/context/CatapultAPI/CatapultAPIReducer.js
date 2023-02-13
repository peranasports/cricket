
const CatapultAPIReducer = (state, action) => {
  switch (action.type) {
    case "GET_ACTIVITIES":
      return {
        ...state,
        activities: action.payload.activities,
        tags: action.payload.tags,
        // token: action.payload.token,
        loading: false,
      };
    case "GET_ATHLETES_IN_ACTIVITY":
      return {
        ...state,
        athletes: action.payload.athletes,
        activity: action.payload.activity,
        loading: false,
      };
    case "GET_SENSOR_FOR_ATHLETES_IN_ACTIVITY":
      return {
        ...state,
        sensordata: action.payload.sensordata,
        athlete: action.payload.athlete,
        activity: action.payload.activity,
        loading: false,
      };
    case "GET_DELIVERIES_FOR_ATHLETES_IN_ACTIVITY":
      return {
        ...state,
        deliveriesData: action.payload.deliveriesData,
        loading: false,
      };
      case "GET_DELIVERIES_AND_SENSOR_DATA_FOR_ATHLETES_IN_ACTIVITY":
        return {
          ...state,
          deliveriesData: action.payload.deliveriesData,
          sensorData: action.payload.sensordata,
          loading: false,
        };
      case "SET_LOADING":
      return {
        ...state,
        message: action.payload.message,
        loading: true,
      };
    case "CLEAR_ACTIVITIES":
      return {
        ...state,
        acts: [],
      };
    default:
      return state;
  }
};

export default CatapultAPIReducer;
