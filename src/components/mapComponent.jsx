
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMap } from '../reducer/mapReducer';

Date.prototype.addMinutes = function(minutes) {
  var copiedDate = new Date(this.getTime());
  return new Date(copiedDate.getTime() + minutes * 60000);
}

export const Map = (props) => {
  const map = props.map

    const style = map.style
    const center = map.center
    const zoom = map.zoom

      
    const ref = useRef(map.ref)
    useEffect(() => {
      new window.google.maps.Map(ref.current, {
        center,
        zoom
      })
    })
    return (<li><div ref={ref} className="map" style={style} /></li>)
  }




export const MapListWithStore = () => {
    const dispatch = useDispatch();
    const maps =  useSelector((state) => state.map);

    const style = {
      display: "flex",
      flexWrap: "wrap"
    }

    return (<div>
      <ul style={style}> 
        {maps.map((map => {
            return <Map map={map} key={map.id}></Map>
        }))}
      </ul>
      <button onClick={() => {dispatch(addMap())}}>+</button>
      
    </div>
    )
  }

