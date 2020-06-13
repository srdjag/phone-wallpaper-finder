function toggleTime(e) {
  if (e.target.checked) {
    document.querySelector(".time").style.visibility = "visible";
    document.querySelector(".date").style.visibility = "visible";
    document.querySelector("form").classList.add("hide");
  } else {
    document.querySelector(".time").style.visibility = "hidden";
    document.querySelector(".date").style.visibility = "hidden";
  }
}

$(document).ready(function () {
  const API_KEY = "XXX";
  let imgArr = [];
  let counter = 0;
  let currentCamera = 1;
  let date = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthName = months[date.getMonth()];
  let dayName = days[date.getDay()];

  function moveLeft() {
    if (imgArr.length == 0) return;
    if (counter == 0) {
      counter = imgArr.length;
    }
    counter--;
    $(".backgrounds").slick("slickPrev");
    document.querySelector(
      "body"
    ).style.backgroundImage = `url('${imgArr[counter]}')`;
    document.getElementById("dlLink").setAttribute("href", imgArr[counter]);
  }
  function moveRight() {
    if (imgArr.length == 0) return;
    if (counter == imgArr.length - 1) {
      counter = -1;
    }
    counter++;
    $(".backgrounds").slick("slickNext");
    document.querySelector(
      "body"
    ).style.backgroundImage = `url('${imgArr[counter]}')`;
    document.getElementById("dlLink").setAttribute("href", imgArr[counter]);
  }

  function init() {
    $(".backgrounds").slick({
      infinite: true,
      speed: 320,
      slidesToShow: 1,
      cssEase: "ease-out",
    });

    $(".backgrounds").on("swipe", function (event, slick, direction) {
      if (direction == "right") {
        moveLeft();
      } else if (direction == "left") {
        moveRight();
      }
    });

    document.getElementById("leftIcon").addEventListener("click", () => {
      moveLeft();
    });
    document.getElementById("rightIcon").addEventListener("click", () => {
      moveRight();
    });
    document.getElementById("searchIcon").addEventListener("click", () => {
      document.querySelector(".time").style.visibility = "hidden";
      document.querySelector(".date").style.visibility = "hidden";
      document.getElementById("time").checked = false;
      document.querySelector("form").classList.toggle("hide");
    });
    document.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      getResults(document.getElementById("searchTerm").value);
    });

    document.querySelector(".hours").textContent = date.getHours();
    document.querySelector(".minutes").textContent = date.getMinutes();
    document.querySelector(
      ".date"
    ).textContent = `${dayName}, ${monthName} ${date.getMonth()}`;
    document.querySelector(".camera-trigger").addEventListener("click", () => {
      if (currentCamera == 5) {
        currentCamera = 1;
      } else {
        currentCamera++;
      }
      document.querySelectorAll("div[class^='camera-n']").forEach((cam) => {
        cam.style.display = "none";
      });
      document.querySelector(
        "div[class='camera-n" + currentCamera + "']"
      ).style.display = "flex";
    });

    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
        default:
          break;
      }
    });
  }

  function getResults(term) {
    imgArr = [];
    counter = 0;
    document.querySelector(".no-results").style.display = "none";
    fetch(
      `https://api.unsplash.com/search/photos?query=${term}&client_id=${API_KEY}&per_page=30&orientation=portrait`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length == 0) {
          document.querySelector(".no-results").style.display = "block";
          return;
        }
        document.querySelector(".time-toggle").style.visibility = "visible";
        document.querySelector(".icons").style.visibility = "visible";
        document.querySelector("form").classList.toggle("hide");
        $(".backgrounds").slick("slickRemove", null, null, true);
        data.results.forEach((image) => {
          let preload = new Image();
          preload.src = image.urls.regular;
          imgArr.push(image.urls.regular);
          let node = document.createElement("DIV");
          node.classList.add("bg");
          node.style.backgroundImage = `url('${image.urls.regular}')`;
          $(".backgrounds").slick("slickAdd", node);
        });
        document.getElementById("searchTerm").value = "";
        document.querySelector(
          "body"
        ).style.backgroundImage = `url('${imgArr[0]}')`;
        document.getElementById("dlLink").setAttribute("href", imgArr[0]);
      });
  }

  init();
});
