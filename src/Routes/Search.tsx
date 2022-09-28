import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvResult } from "../api";
import { makeImagePath } from "../utils";
import Loading from "../Components/Loading";
const API_KEY = "0fdcfff63d148356b809688dca315967";
const BASE_PATH = "https://api.themoviedb.org/3";

const DataCom = styled.div`
  padding-top: 100px;
`;

const Row = styled.div`
  padding: 0 5vw;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  height: 200px;
  font-size: 20px;
  background-size: cover;
  background-position: center center;

  cursor: pointer;
`;

const boxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.2,
    y: -20,
    transition: {
      type: "tween"
    }
  }
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      duaration: 0.1,
      type: "tween"
    }
  }
};

const SearchResultTitle = styled.div`
  padding: 15px 5vw;
  font-size: 2.5vw;
  font-weight: bold;
`;

function Search() {
  const history = useNavigate();
  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [movieData, setMovieData] = useState<IGetMoviesResult>();
  const [isLoading, setIsLoading] = useState(true);
  const [tvData, setTvData] = useState<IGetTvResult>();

  useEffect(() => {
    const fetchMovieData = async () => {
      const result = await fetch(
        `
        ${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
      ).then((response) => response.json());
      await setMovieData(result);
    };
    const fetchTvData = async () => {
      const result = await fetch(
        `
        ${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
      ).then((response) => response.json());
      await setTvData(result);
    };

    fetchMovieData();
    fetchTvData();
  }, [keyword]);

  useEffect(() => {
    setIsLoading(false);
  }, [movieData]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DataCom>
            <SearchResultTitle>영화 PLUS</SearchResultTitle>
            <Row>
              {movieData?.results.slice(0, 12).map((movie) => (
                <Box
                  variants={boxVariants}
                  layoutId={movie.id + ""}
                  key={movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </DataCom>
          <DataCom>
            <SearchResultTitle>TV PLUS</SearchResultTitle>
            <Row>
              {tvData?.results.slice(0, 12).map((movie) => (
                <Box
                  variants={boxVariants}
                  layoutId={movie.id + ""}
                  key={movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.name}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </DataCom>
        </>
      )}
    </>
  );
}
export default Search;
