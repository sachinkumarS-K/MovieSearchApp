const APIURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
let count = 0;

const wrapper = document.querySelector(".wrapper");
const loader = document.querySelector(".spinner");
let movieData;
const getMovie = async (api) => {
  wrapper.classList.add("active");
  loader.classList.remove("active");
  console.log("API CALL  ", count++);
  const response = await fetch(api);
  const data = await response.json();
  console.log(data);
  movieData = data.results;
  wrapper.classList.remove("active");
  loader.classList.add("active");
  showMovie(data.results);
};

const showMovie = (data) => {
  document.querySelector(".movieContainer").innerHTML = "";
  data.forEach((el) => {
    const imagePath =
      el.poster_path === null
        ? "img/image-missing.png"
        : IMGPATH + el.poster_path;

    const div = document.createElement("div");
    div.classList.add("movieCard");
    div.innerHTML = `
        <!-- Card Starts Here -->
        <div class="posterBox">
               <img src="${IMGPATH + el.poster_path}" alt="${
      el.title
    } Movie Poster"></img>
            </div>
            <div class="desBox">
                <div class="titleAndRatingBox">
                    <div class="title">${el.title}</div>
                    <div class="rating">${el.vote_average.toFixed(1)}</div>
                </div>
                <div class="overviewBox">
                    <div class="overviewTitle">
                        Overview :
                    </div>
                    <div class="overviewContent" id = ${el.id} >
                        ${el.overview.slice(0, 140)}
                              <span style = "padding-left = 6px ; color:gray ;font-weight:700" class = "showMore" onclick= "showMore(${
                                el.id
                              })" >  ....show More  </span>
                             
                    </div>
                </div>
            </div>
            <!-- Card Ends Here -->
        `;
    document.querySelector(".movieContainer").appendChild(div);
  });
};

const showLess = (id) => {
  const data = movieData.filter((movie) => movie.id == id);
  const text = document.getElementById(`${id}`);

  text.innerHTML = ` ${data[0].overview.slice(0, 150)} 
   <span style = "padding-left = 4px ;  color:gray ;font-weight:700" class = "showLess"onclick= "showMore(${
     data[0].id
   })"   >  ....show More  </span>`;
};

const showMore = (id) => {
  const data = movieData.filter((movie) => movie.id == id);
  const text = document.getElementById(`${id}`);
  text.innerHTML = `${data[0].overview}  <span style = "padding-left = 4px ;  color:aqua ;font-weight:700" class = "showLess" onclick= "showLess(${data[0].id})"   >  ....show Less  </span>`;
};

const debounced = debouce(getMovie, 300);

function debouce(fn, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

document.querySelector("#searchBar").addEventListener("keyup", (e) => {
  if (e.target.value != "") {
    debounced(SEARCHAPI + e.target.value);
    document.querySelector(".fa-times").addEventListener("click", () => {
      document.querySelector("#searchBar").value = "";
      getMovie(APIURL);
    });
  } else {
    getMovie(APIURL);
  }
});

getMovie(APIURL);
