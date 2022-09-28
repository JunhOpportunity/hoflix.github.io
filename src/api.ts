const API_KEY = "0fdcfff63d148356b809688dca315967";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  vote_average: string;
  release_date: string;
  genre_ids: string[]; // -> genres / genres[0].name
  original_language: string; // 삭제
  genres: string[];
  production_countries: string;
  runtime: string;
}
export interface IGetMoviesResult {
  results: IMovie[];
}

interface ITv {
  id: number;
  backdrop_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: string;
  origin_country: string;
}

export interface IDetailData {
  id: number;
  runtime: string;
}

export interface IGetTvResult {
  results: ITv[];
}

export interface IGetMoviesDetails {
  runtime: number;
}

export function getMoviesOne() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}
export function getMoviesTwo() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=2`
  ).then((response) => response.json());
}
export function getMoviesThree() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=3`
  ).then((response) => response.json());
}

export function getTvToday() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko&page=2`
  ).then((response) => response.json());
}

export function getTvOnAir() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}

export function getTvPopular() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko&page=3`
  ).then((response) => response.json());
}
export async function getMoviesOneDetails() {
  const data = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());

  const detailData = await data.results.map((response) =>
    fetch(
      `${BASE_PATH}/movie/${response.id}?api_key=${API_KEY}&language=kor`
    ).then((response) => response.json())
  );
  return detailData;
}
