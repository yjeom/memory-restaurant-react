/*global kakao*/
import { Button, Grid } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import './KakaoApi.css';
import ModalContext from '../src/contexts/ModalContext';
import axios from 'axios';
import { API_BASE_URL } from './app-config';
import MemoListContext from './contexts/MemoListContext';
import jwtDecode from 'jwt-decode';

const { kakao } = window;

const KakaoMap = ({ searchPlace }) => {
  const [places, setPlaces] = useState([]);
  const { state, actions } = useContext(ModalContext);
  const { memoList, listFunc } = useContext(MemoListContext);

  function getMemoList(placeId) {
    axios.get(API_BASE_URL + '/placeMemos/' + placeId).then((response) => {
      console.log(response);
      if (response.data === '' || response.data === null) {
        alert('등록된 리뷰가 없습니다');
      } else {
        listFunc.setMemoList(response.data);
        listFunc.setIsShow(true);
      }
    });
  }
  useEffect(() => {
    listFunc.setMemoList([]);
    listFunc.setIsShow(false);
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    };
    var map = new kakao.maps.Map(container, options);
    var markers = [];
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
        displayPagination(pagination);
      }
    }
    function displayPlaces(data) {
      var bounds = new kakao.maps.LatLngBounds();

      setPlaces(data);
      for (var i = 0; i < data.length; i++) {
        var placePosition = new kakao.maps.LatLng(data[i].y, data[i].x),
          marker = addMarker(placePosition, i);
        bounds.extend(placePosition);
      }

      map.setBounds(bounds);
    }
    function addMarker(position, idx, title) {
      var imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        imageSize = new kakao.maps.Size(36, 37),
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691),
          spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
          offset: new kakao.maps.Point(13, 37),
        },
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions,
        ),
        marker = new kakao.maps.Marker({
          position: position,
          image: markerImage,
        });

      marker.setMap(map);
      markers.push(marker);

      return marker;
    }

    function removeMarker() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = '#';
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }
  }, [searchPlace]);

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <div id="map" style={{ width: '100%', height: '400px' }}></div>
        </Grid>
        <Grid item xs={6}>
          <div>
            <ul id="placesList">
              {places.map((place, index) => (
                <li key={index} className="item">
                  <span className={`markerbg marker_${index + 1}`}></span>
                  <div className="info">
                    <b
                      onClick={() => {
                        listFunc.setListPlace(place);
                        getMemoList(place.id, place);
                      }}
                    >
                      {place.place_name}
                    </b>
                    <Button
                      color="primary"
                      onClick={() => {
                        if (localStorage.getItem('ACCESS_TOKEN') !== null) {
                          actions.setIsOpen(true);
                          actions.setPlace(place);
                        } else {
                          alert('로그인 후 작성할 수 있습니다');
                          window.location.href = '/login';
                        }
                      }}
                    >
                      리뷰작성
                    </Button>

                    <span>{place.road_address_name}</span>
                    <span className="jibun gray">{place.address_name}</span>
                    <span className="tel">{place.phone}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="pagination"></div>
        </Grid>
        {/* <Grid item xs={12}>
          <MemoList responseMemoList={memoList} responsePlaceName={placeName} />
        </Grid> */}
      </Grid>
    </div>
  );
};
export default KakaoMap;
