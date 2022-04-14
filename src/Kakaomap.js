/*global kakao*/
import { Button, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './KakaoApi.css';
import { ModalConsumer } from '../src/contexts/ModalContext';
import MemoList from './MemoList';
import axios from 'axios';
import { API_BASE_URL } from './app-config';

const { kakao } = window;

const KakaoMap = ({ searchPlace }) => {
  const [places, setPlaces] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [memoList, setMemoList] = useState([]);

  function getMemoList(placeId) {
    axios.get(API_BASE_URL + '/placeMemos/' + placeId).then((response) => {
      console.log(response);
      if (response.data === '' || response.data === null) {
        alert('등록된 리뷰가 없습니다');
      } else {
        setMemoList(response.data);
      }
    });
  }
  useEffect(() => {
    setMemoList(null);
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
                        setPlaceName(place.place_name);
                        getMemoList(place.id, place);
                      }}
                    >
                      {place.place_name}
                    </b>
                    <ModalConsumer>
                      {({ actions }) => (
                        <Button
                          color="primary"
                          onClick={() => {
                            actions.setIsOpen(true);
                            actions.setPlace(place);
                          }}
                        >
                          리뷰작성
                        </Button>
                      )}
                    </ModalConsumer>

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
        <Grid item xs={12}>
          <MemoList responseMemoList={memoList} responsePlaceName={placeName} />
        </Grid>
      </Grid>
    </div>
  );
};
export default KakaoMap;
