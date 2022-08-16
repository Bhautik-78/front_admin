import React, {useEffect, useState} from 'react';
import queryString from 'query-string'
import axios from "axios";
import * as Spinner from 'react-spinkit';

const CallBack = (props) => {

  const [loading,setLoading] = useState(true);

  useEffect(async () => {
    const code = queryString.parse(props.location && props.location.search).code || '';
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/auth/exchange?code=${code}`);
      if (res && res.data && res.data.access_token && res.data.refresh_token) {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);        
        setLoading(false);
        window.location.href ='/customer'
      }
    } catch (err) {
      console.log("error in getting entities : ", err)
    }
  }, []);

  return (
    <>
      {loading ? (
        <div style={{ position: "fixed", top: "0", left: "0",right:"0",bottom:"0", height: "100%", width: "100%", backgroundColor: "#ffffff", opacity: 0.6, zIndex: 1000 }}>
          <div style={{ position: "absolute", textAlign: "center", top: "47%", left: "47%", zIndex: 1001 }}>
            <Spinner name="ball-beat" />
          </div>
        </div>
      ) : null}
    </>
  )
}
export default CallBack;

