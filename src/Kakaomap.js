/*global kakao*/ 
import { useEffect } from "react";

const { kakao } = window;

const Kakaomap= ({ searchPlace })=>{
   
    useEffect(()=>{
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3
        };
        var map = new kakao.maps.Map(container, options);

        const ps = new kakao.maps.services.Places(); 

        ps.keywordSearch(searchPlace, placesSearchCB); 

        function placesSearchCB (data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {

                let bounds = new kakao.maps.LatLngBounds();

                for (let i=0; i<data.length; i++) {
                    displayMarker(data[i]);    
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }       

                map.setBounds(bounds);
            } 
        }

        function displayMarker(place) {
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x) 
            });
        }
    }, [searchPlace]);

    
        return (
            <div>
                <div id="map" style={{width:"500px", height:"400px"}}></div> 
            </div>
        );
};
export default Kakaomap;