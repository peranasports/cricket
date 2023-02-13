import { useEffect, useContext, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ActivitySearch from "../components/activities/ActivitySearch";
import ActivityResults from "../components/activities/ActivityResults";

function Home() {
  const [theme, setTheme] = useState('business');

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
     <div>
         <ActivitySearch />
         <ActivityResults />
     </div>
    </>
  );
}

export default Home;
