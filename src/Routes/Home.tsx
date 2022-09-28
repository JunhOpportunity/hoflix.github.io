import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getMoviesOne,
  getMoviesTwo,
  getMoviesThree,
  IGetMoviesResult
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import Contact from "../Components/Contact";
const API_KEY = "0fdcfff63d148356b809688dca315967";
const BASE_PATH = "https://api.themoviedb.org/3";

// Slider 오류 => 보류
// 좌 : 0 ~ 800 , -800 ~ 0
// 좌 -> 우 : 0 ~ 800 , 800 ~ 0
// 우 : 0 ~ -800 , 800 ~ 0
// 우 -> 좌 : 0 ~ 800 , -800 ~ 0

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled(motion.h2)`
  font-size: 68px;
  margin-bottom: 20px;
`;
const bigTitleVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1
    }
  }
};
const bigInfoVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 1
    }
  }
};
const bigOverviewVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 1.5,
      duration: 2.5
    }
  }
};

const Hr = styled(motion.hr)``;

const bigHrVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 1,
      duration: 1.5
    }
  }
};

const Overview = styled(motion.p)`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  height: 100px;
  margin-bottom: 200px;
`;

const SliderTitle = styled.div`
  padding: 15px 5vw;
  font-size: 2.5vw;
  font-weight: bold;
`;

const Row = styled(motion.div)`
  padding: 0 5vw;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
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
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

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

// custom으로 주려면 variants를 반환하는 function으로 만들어야한다.
const rowVariants = {
  visible: { x: 0 },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth
  }),
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth
  })
};

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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  background-color: #202020;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  border-radius: 15px;
  overflow: auto;
  z-index: 99;
`;

const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 40vh;
`;

const BigTitle = styled(motion.h3)`
  color: ${(props) => props.theme.whtie};
  padding: 20px;
  font-size: 20px;
  position: absolute;
  font-weight: bold;
  bottom: 0px;
`;

const BigInfo = styled(motion.p)`
  text-align: center;
  width: 100%;
  padding: 20px;
  top: -165px;
  color: ${(props) => props.theme.whtie};
`;

const BigOverview = styled(motion.p)`
  width: 100%;
  padding: 20px;
  color: ${(props) => props.theme.whtie};
`;

const SvgButton = styled(motion.div)`
  z-index: 1;
  position: absolute;
  display: flex;
  height: 200px;
  width: 5vw;
  hover: {
    cursor: pointer;
    scale: 1.3;
    transition: {
      delay: 0.5;
      duration: 0.5;
      type: "tween";
    }
  }
`;

const svgVariants = {
  hover: {
    backgroundColor: "rgba(0,0,0, 0.5)",
    cursor: "pointer",
    scale: 1.1,
    fill: "black",
    transition: {
      duration: 0.5
    }
  }
};

const TopCover = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const BottomCover = styled.div`
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Cover = styled.div`
  display: flex;
  flex-direction: column;
`;

const overviewTest = (overview: string) => {
  return overview === "" ? "No Overview" : overview;
};

function Home() {
  const history = useNavigate();
  const onOverlayClick = () => {
    history("/");
  };
  const bigMovieMatch = useMatch("/movies/:movieId");
  const offset = 6;
  const { data: pageOneData, isLoading: pageOneLoading } = useQuery<
    IGetMoviesResult
  >(["nowplayingOneMovie", "nowPlayingOne"], getMoviesOne);

  const { data: pageTwoData, isLoading: pageTwoLoading } = useQuery<
    IGetMoviesResult
  >(["nowplayingTwoMovie", "nowPlayingTwo"], getMoviesTwo);

  const { data: pageThreeData, isLoading: pageThreeLoading } = useQuery<
    IGetMoviesResult
  >(["nowplayingThreeMovies", "nowPlayingThree"], getMoviesThree);

  const [indexOne, setIndexOne] = useState(0);
  const [leavingOne, setLeavingOne] = useState(false);
  const [isBackOne, setBackOne] = useState(false); // 여기서 문제인데 정확히 캐치를 못하겠다
  const toggleLeavingOne = () => setLeavingOne((prevOne) => !prevOne); // 이건 뭐임?

  const [indexTwo, setIndexTwo] = useState(0);
  const [leavingTwo, setLeavingTwo] = useState(false);
  const [isBackTwo, setBackTwo] = useState(false); // 여기서 문제인데 정확히 캐치를 못하겠다
  const toggleLeavingTwo = () => setLeavingTwo((prevTwo) => !prevTwo); // 이건 뭐임?

  const [indexThree, setIndexThree] = useState(0);
  const [leavingThree, setLeavingThree] = useState(false);
  const [isBackThree, setBackThree] = useState(false); // 여기서 문제인데 정확히 캐치를 못하겠다
  const toggleLeavingThree = () => setLeavingThree((prevThree) => !prevThree); // 이건 뭐임?

  const increaseIndexOne = () => {
    setBackOne(false);

    const totalMovies = pageOneData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageOneData) {
      if (leavingOne) return;
    }
    toggleLeavingOne();
    setIndexOne((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndexOne = () => {
    setBackOne(true);

    const totalMovies = pageOneData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageOneData) {
      if (leavingOne) return;
    }
    toggleLeavingOne();

    setIndexOne((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const increaseIndexTwo = () => {
    setBackTwo(false);

    const totalMovies = pageTwoData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageTwoData) {
      if (leavingTwo) return;
    }
    toggleLeavingTwo();
    setIndexTwo((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndexTwo = () => {
    setBackTwo(true);

    const totalMovies = pageTwoData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageTwoData) {
      if (leavingTwo) return;
    }
    toggleLeavingTwo();

    setIndexTwo((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const increaseIndexThree = () => {
    setBackThree(false);

    const totalMovies = pageThreeData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageThreeData) {
      if (leavingThree) return;
    }
    toggleLeavingThree();
    setIndexThree((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndexThree = () => {
    setBackThree(true);
    const totalMovies = pageThreeData.results.length - 1; // 맨 처음에 Banner로 하나 사용했으므로 1 빼줌
    const maxIndex = Math.floor(totalMovies / offset) - 1; // page가 0에서부터 시작이라서 1 빼줌

    if (pageThreeData) {
      if (leavingThree) return;
    }
    toggleLeavingThree();

    setIndexThree((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (pageOneData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    )
      ? pageOneData?.results.find(
          (movie) => movie.id + "" === bigMovieMatch.params.movieId
        )
      : pageTwoData?.results.find(
          (movie) => movie.id + "" === bigMovieMatch.params.movieId
        )
      ? pageTwoData?.results.find(
          (movie) => movie.id + "" === bigMovieMatch.params.movieId
        )
      : pageThreeData?.results.find(
          (movie) => movie.id + "" === bigMovieMatch.params.movieId
        ));

  return (
    <Wrapper>
      {pageOneLoading ? (
        <Loading />
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(pageOneData?.results[0].backdrop_path)}
          >
            <Title>{pageOneData?.results[0].title}</Title>
            <Overview>{pageOneData?.results[0].overview}</Overview>
          </Banner>

          <SliderTitle>내가 찜한 콘텐츠</SliderTitle>
          <Slider>
            <AnimatePresence
              custom={isBackOne}
              initial={false}
              onExitComplete={toggleLeavingOne}
            >
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ left: "0px" }}
                onClick={decreaseIndexOne}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </SvgButton>
              <Row
                custom={isBackOne}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                key={indexOne}
              >
                {pageOneData?.results
                  .slice(1)
                  .slice(offset * indexOne, offset * indexOne + offset)
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ right: "0px" }}
                onClick={increaseIndexOne}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </SvgButton>
            </AnimatePresence>
          </Slider>

          <SliderTitle>지금 뜨는 콘텐츠</SliderTitle>
          <Slider>
            <AnimatePresence
              custom={isBackTwo}
              initial={false}
              onExitComplete={toggleLeavingTwo}
            >
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ left: "0px" }}
                onClick={decreaseIndexTwo}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </SvgButton>
              <Row
                custom={isBackTwo}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                key={indexTwo}
              >
                {pageTwoData?.results
                  .slice(1)
                  .slice(offset * indexTwo, offset * indexTwo + offset)
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ right: "0px" }}
                onClick={increaseIndexTwo}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </SvgButton>
            </AnimatePresence>
          </Slider>

          <SliderTitle>감명을 주는 콘텐츠</SliderTitle>
          <Slider>
            <AnimatePresence
              custom={isBackThree}
              initial={false}
              onExitComplete={toggleLeavingThree}
            >
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ left: "0px" }}
                onClick={decreaseIndexThree}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
              </SvgButton>
              <Row
                custom={isBackThree}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                key={indexThree}
              >
                {pageThreeData?.results
                  .slice(1)
                  .slice(offset * indexThree, offset * indexThree + offset)
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SvgButton
                variants={svgVariants}
                whileHover="hover"
                style={{ right: "0px" }}
                onClick={increaseIndexThree}
              >
                <svg
                  style={{ fill: "white" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg>
              </SvgButton>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></Overlay>
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <Cover>
                        <TopCover>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${makeImagePath(
                                clickedMovie.backdrop_path,
                                "w500"
                              )})`
                            }}
                          />
                          <BigTitle
                            variants={bigTitleVariants}
                            initial="initial"
                            animate="animate"
                          >
                            {clickedMovie.title}
                          </BigTitle>
                        </TopCover>

                        <BottomCover>
                          <BigInfo
                            variants={bigInfoVariants}
                            initial="initial"
                            animate="animate"
                          >
                            {clickedMovie.release_date} ★
                            {clickedMovie.vote_average} 🎬
                            {clickedMovie.original_language}
                          </BigInfo>
                          <Hr
                            variants={bigHrVariants}
                            initial="initial"
                            animate="animate"
                          />
                          <BigOverview
                            variants={bigOverviewVariants}
                            initial="initial"
                            animate="animate"
                          >
                            {overviewTest(clickedMovie.overview)}
                          </BigOverview>
                        </BottomCover>
                      </Cover>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          <Contact />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
